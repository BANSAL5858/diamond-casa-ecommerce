# -*- coding: utf-8 -*-
"""
Sync utilities for DiamondCasa integration
Handles bi-directional sync between ERPNext and DiamondCasa.com
"""

import frappe
import json
import hashlib
import requests
from frappe.utils import now, get_datetime, add_to_date
from datetime import datetime, timedelta


def get_diamondcasa_config():
	"""Get DiamondCasa integration configuration"""
	return frappe.conf.get("diamondcasa_config") or {
		"api_url": frappe.conf.get("diamondcasa_api_url") or "",
		"api_key": frappe.conf.get("diamondcasa_api_key") or "",
		"api_secret": frappe.conf.get("diamondcasa_api_secret") or "",
		"webhook_secret": frappe.conf.get("diamondcasa_webhook_secret") or "",
		"sync_enabled": frappe.conf.get("diamondcasa_sync_enabled", False),
		"sync_interval": frappe.conf.get("diamondcasa_sync_interval", 900),  # 15 minutes
	}


def log_integration(
	integration_type,
	direction,
	status,
	endpoint=None,
	method=None,
	request_payload=None,
	response_payload=None,
	error_message=None,
	error_traceback=None,
	retry_count=0,
	max_retries=3,
	next_retry_at=None,
	idempotency_key=None,
	reference_doctype=None,
	reference_name=None,
	duration_ms=None
):
	"""Create integration log entry"""
	try:
		log_doc = frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": integration_type,
			"direction": direction,
			"status": status,
			"endpoint": endpoint,
			"method": method,
			"request_payload": json.dumps(request_payload) if request_payload else None,
			"response_payload": json.dumps(response_payload) if response_payload else None,
			"error_message": error_message,
			"error_traceback": error_traceback,
			"retry_count": retry_count,
			"max_retries": max_retries,
			"next_retry_at": next_retry_at,
			"idempotency_key": idempotency_key,
			"reference_doctype": reference_doctype,
			"reference_name": reference_name,
			"duration_ms": duration_ms,
			"sync_timestamp": now()
		})
		log_doc.insert(ignore_permissions=True)
		frappe.db.commit()
		return log_doc.name
	except Exception as e:
		frappe.log_error(f"Failed to create integration log: {str(e)}", "Integration Log Error")
		return None


def calculate_hash(data):
	"""Calculate hash for change detection"""
	if isinstance(data, dict):
		data_str = json.dumps(data, sort_keys=True)
	else:
		data_str = str(data)
	return hashlib.sha256(data_str.encode()).hexdigest()


def make_api_request(method, endpoint, data=None, idempotency_key=None, retry=True):
	"""Make API request to DiamondCasa with retry logic"""
	config = get_diamondcasa_config()
	
	if not config.get("sync_enabled"):
		return {"status": "disabled", "message": "Sync is disabled"}
	
	if not config.get("api_url"):
		return {"status": "error", "message": "DiamondCasa API URL not configured"}
	
	url = f"{config['api_url']}/api/diamondcasa/{endpoint}"
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer {config['api_key']}:{config['api_secret']}"
	}
	
	if idempotency_key:
		headers["Idempotency-Key"] = idempotency_key
	
	start_time = datetime.now()
	error_message = None
	error_traceback = None
	response_payload = None
	
	try:
		response = requests.request(
			method=method,
			url=url,
			headers=headers,
			json=data,
			timeout=30
		)
		
		duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
		response_payload = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
		
		if response.status_code >= 200 and response.status_code < 300:
			log_integration(
				integration_type="API Request",
				direction="ERPNext → DiamondCasa",
				status="Success",
				endpoint=endpoint,
				method=method,
				request_payload=data,
				response_payload=response_payload,
				idempotency_key=idempotency_key,
				duration_ms=duration_ms
			)
			return {"status": "success", "data": response_payload}
		else:
			error_message = f"HTTP {response.status_code}: {response_payload}"
			raise Exception(error_message)
			
	except Exception as e:
		duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
		error_message = str(e)
		import traceback
		error_traceback = traceback.format_exc()
		
		log_integration(
			integration_type="API Request",
			direction="ERPNext → DiamondCasa",
			status="Failed",
			endpoint=endpoint,
			method=method,
			request_payload=data,
			response_payload=response_payload,
			error_message=error_message,
			error_traceback=error_traceback,
			idempotency_key=idempotency_key,
			duration_ms=duration_ms
		)
		
		if retry:
			# Schedule retry with exponential backoff
			schedule_retry(endpoint, method, data, idempotency_key)
		
		return {"status": "error", "message": error_message}


def schedule_retry(endpoint, method, data, idempotency_key, retry_count=0, max_retries=3):
	"""Schedule retry with exponential backoff"""
	if retry_count >= max_retries:
		return
	
	# Exponential backoff: 2^retry_count minutes
	delay_minutes = 2 ** retry_count
	next_retry_at = add_to_date(now(), minutes=delay_minutes)
	
	log_integration(
		integration_type="API Request",
		direction="ERPNext → DiamondCasa",
		status="Retrying",
		endpoint=endpoint,
		method=method,
		request_payload=data,
		retry_count=retry_count + 1,
		max_retries=max_retries,
		next_retry_at=next_retry_at,
		idempotency_key=idempotency_key
	)
	
	# Schedule background job
	frappe.enqueue(
		"diamondcasa_jewellery.utils.sync.make_api_request",
		method=method,
		endpoint=endpoint,
		data=data,
		idempotency_key=idempotency_key,
		retry=(retry_count + 1 < max_retries),
		queue="default",
		job_name=f"retry_{endpoint}_{idempotency_key}",
		enqueue_after=delay_minutes * 60
	)


# Document event handlers

def on_item_update(doc, method):
	"""Triggered when Item is updated"""
	if doc.item_group == "Jewelry":
		frappe.enqueue(
			"diamondcasa_jewellery.utils.sync.sync_product_to_diamondcasa",
			item_code=doc.name,
			queue="default",
			timeout=300
		)


def validate_item(doc, method):
	"""Validate Item before save"""
	# Add any custom validations here
	pass


def on_sales_order_submit(doc, method):
	"""Triggered when Sales Order is submitted"""
	frappe.enqueue(
		"diamondcasa_jewellery.utils.sync.sync_order_to_diamondcasa",
		sales_order=doc.name,
		queue="default",
		timeout=300
	)


def on_sales_order_cancel(doc, method):
	"""Triggered when Sales Order is cancelled"""
	frappe.enqueue(
		"diamondcasa_jewellery.utils.sync.sync_order_cancellation_to_diamondcasa",
		sales_order=doc.name,
		queue="default",
		timeout=300
	)


def on_stock_entry_submit(doc, method):
	"""Triggered when Stock Entry is submitted"""
	if doc.purpose in ["Material Receipt", "Material Issue", "Material Transfer"]:
		frappe.enqueue(
			"diamondcasa_jewellery.utils.sync.sync_inventory_to_diamondcasa",
			item_codes=[item.item_code for item in doc.items],
			queue="default",
			timeout=300
		)


def on_sales_invoice_submit(doc, method):
	"""Triggered when Sales Invoice is submitted"""
	frappe.enqueue(
		"diamondcasa_jewellery.utils.sync.sync_invoice_to_diamondcasa",
		sales_invoice=doc.name,
		queue="default",
		timeout=300
	)


# Sync functions

def sync_product_to_diamondcasa(item_code):
	"""Sync product to DiamondCasa"""
	try:
		item = frappe.get_doc("Item", item_code)
		
		# Check if SKU exists
		sku = frappe.db.get_value("Jewellery SKU", {"item_code": item_code}, "name")
		if not sku:
			return {"status": "skipped", "message": "No SKU found for item"}
		
		sku_doc = frappe.get_doc("Jewellery SKU", sku)
		if not (sku_doc.is_web_visible and sku_doc.is_web_approved):
			return {"status": "skipped", "message": "SKU not approved for web"}
		
		# Prepare payload
		payload = prepare_product_payload(sku_doc, item)
		idempotency_key = f"product_{item_code}_{calculate_hash(payload)}"
		
		# Make API request
		result = make_api_request("POST", "products", data=payload, idempotency_key=idempotency_key)
		
		if result.get("status") == "success":
			sku_doc.sync_status = "Synced"
			sku_doc.last_synced = now()
			sku_doc.save(ignore_permissions=True)
			frappe.db.commit()
		
		return result
	except Exception as e:
		frappe.log_error(f"Failed to sync product {item_code}: {str(e)}", "Product Sync Error")
		return {"status": "error", "message": str(e)}


def sync_sku_to_diamondcasa(sku_name):
	"""Sync SKU to DiamondCasa"""
	sku_doc = frappe.get_doc("Jewellery SKU", sku_name)
	item = frappe.get_doc("Item", sku_doc.item_code)
	return sync_product_to_diamondcasa(item.name)


def sync_design_to_diamondcasa(design_name):
	"""Sync design to DiamondCasa"""
	# Implementation for design sync
	pass


def prepare_product_payload(sku_doc, item):
	"""Prepare product payload for DiamondCasa API"""
	return {
		"sku_code": sku_doc.sku_code,
		"item_code": item.item_code,
		"item_name": item.item_name,
		"description": item.description,
		"category": item.item_group,
		"metal_type": sku_doc.metal_spec,
		"metal_purity": sku_doc.metal_purity,
		"stone_type": sku_doc.stone_spec,
		"stone_carat": sku_doc.stone_carat,
		"price": sku_doc.final_price,
		"available_qty": sku_doc.available_qty or 0,
		"is_active": sku_doc.is_active,
		"images": get_item_images(item.name),
		"videos": get_item_videos(item.name)
	}


def get_item_images(item_code):
	"""Get item images"""
	images = []
	files = frappe.get_all(
		"File",
		filters={
			"attached_to_doctype": "Item",
			"attached_to_name": item_code,
			"is_folder": 0
		},
		fields=["file_url", "file_name"]
	)
	for file in files:
		if file.file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
			images.append(file.file_url)
	return images[:5]  # Max 5 images


def get_item_videos(item_code):
	"""Get item videos"""
	videos = []
	files = frappe.get_all(
		"File",
		filters={
			"attached_to_doctype": "Item",
			"attached_to_name": item_code,
			"is_folder": 0
		},
		fields=["file_url", "file_name"]
	)
	for file in files:
		if file.file_name.lower().endswith(('.mp4', '.webm', '.ogg', '.mov')):
			videos.append(file.file_url)
	return videos[:1]  # Max 1 video


def sync_inventory_to_diamondcasa(item_codes=None):
	"""Sync inventory to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get inventory for jewellery items
		if item_codes:
			items = item_codes
		else:
			items = frappe.db.get_all("Item", 
				filters={"item_group": "Jewelry", "disabled": 0},
				pluck="name"
			)
		
		# Get stock levels
		inventory_data = []
		for item_code in items:
			sku = frappe.db.get_value("Jewellery SKU", {"item_code": item_code}, "name")
			if not sku:
				continue
			
			sku_doc = frappe.get_doc("Jewellery SKU", sku)
			if not (sku_doc.is_web_visible and sku_doc.is_web_approved):
				continue
			
			# Get stock from all warehouses
			bins = frappe.db.get_all("Bin",
				filters={"item_code": item_code},
				fields=["warehouse", "actual_qty", "reserved_qty"]
			)
			
			for bin in bins:
				inventory_data.append({
					"sku_code": sku_doc.sku_code,
					"item_code": item_code,
					"warehouse": bin.warehouse,
					"available_qty": bin.actual_qty or 0,
					"reserved_qty": bin.reserved_qty or 0
				})
		
		# Sync inventory
		if inventory_data:
			idempotency_key = f"inventory_{calculate_hash(inventory_data)}"
			result = make_api_request("PATCH", "inventory", data={"inventory": inventory_data}, idempotency_key=idempotency_key)
			return result
		
		return {"status": "success", "message": "No inventory to sync"}
	except Exception as e:
		frappe.log_error(f"Failed to sync inventory: {str(e)}", "Inventory Sync Error")
		return {"status": "error", "message": str(e)}


def sync_prices_to_diamondcasa():
	"""Sync prices to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get all web-visible SKUs
		skus = frappe.db.get_all("Jewellery SKU",
			filters={"is_web_visible": 1, "is_web_approved": 1, "is_active": 1},
			fields=["name", "sku_code", "item_code", "final_price"]
		)
		
		# Prepare price data
		price_data = []
		for sku in skus:
			price_data.append({
				"sku_code": sku.sku_code,
				"item_code": sku.item_code,
				"price": sku.final_price or 0
			})
		
		# Sync prices
		if price_data:
			idempotency_key = f"prices_{calculate_hash(price_data)}"
			result = make_api_request("PATCH", "prices", data={"prices": price_data}, idempotency_key=idempotency_key)
			return result
		
		return {"status": "success", "message": "No prices to sync"}
	except Exception as e:
		frappe.log_error(f"Failed to sync prices: {str(e)}", "Price Sync Error")
		return {"status": "error", "message": str(e)}


def sync_media_to_diamondcasa():
	"""Sync media to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get all web-visible SKUs
		skus = frappe.db.get_all("Jewellery SKU",
			filters={"is_web_visible": 1, "is_web_approved": 1, "is_active": 1},
			fields=["name", "sku_code", "item_code"]
		)
		
		# Prepare media data
		media_data = []
		for sku in skus:
			item = frappe.get_doc("Item", sku.item_code)
			images = get_item_images(item.name)
			videos = get_item_videos(item.name)
			
			if images or videos:
				media_data.append({
					"sku_code": sku.sku_code,
					"item_code": sku.item_code,
					"images": images,
					"videos": videos
				})
		
		# Sync media
		if media_data:
			idempotency_key = f"media_{calculate_hash(media_data)}"
			result = make_api_request("PATCH", "media", data={"media": media_data}, idempotency_key=idempotency_key)
			return result
		
		return {"status": "success", "message": "No media to sync"}
	except Exception as e:
		frappe.log_error(f"Failed to sync media: {str(e)}", "Media Sync Error")
		return {"status": "error", "message": str(e)}


def sync_order_to_diamondcasa(sales_order):
	"""Sync order to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get Sales Order
		so = frappe.get_doc("Sales Order", sales_order)
		
		# Prepare order data
		order_data = {
			"sales_order": so.name,
			"order_id": getattr(so, "custom_website_order_id", None) or so.name,
			"customer": so.customer,
			"status": so.status,
			"items": []
		}
		
		# Add items
		for item in so.items:
			order_data["items"].append({
				"item_code": item.item_code,
				"qty": item.qty,
				"rate": item.rate,
				"amount": item.amount
			})
		
		# Sync order
		idempotency_key = f"order_{so.name}_{calculate_hash(order_data)}"
		result = make_api_request("POST", "orders", data=order_data, idempotency_key=idempotency_key)
		return result
	except Exception as e:
		frappe.log_error(f"Failed to sync order {sales_order}: {str(e)}", "Order Sync Error")
		return {"status": "error", "message": str(e)}


def sync_order_cancellation_to_diamondcasa(sales_order):
	"""Sync order cancellation to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get Sales Order
		so = frappe.get_doc("Sales Order", sales_order)
		
		# Prepare cancellation data
		cancellation_data = {
			"sales_order": so.name,
			"order_id": getattr(so, "custom_website_order_id", None) or so.name,
			"status": "Cancelled",
			"cancellation_reason": "Cancelled in ERPNext"
		}
		
		# Sync cancellation
		idempotency_key = f"order_cancel_{so.name}_{calculate_hash(cancellation_data)}"
		result = make_api_request("POST", "orders/cancel", data=cancellation_data, idempotency_key=idempotency_key)
		return result
	except Exception as e:
		frappe.log_error(f"Failed to sync order cancellation {sales_order}: {str(e)}", "Order Cancellation Sync Error")
		return {"status": "error", "message": str(e)}


def sync_invoice_to_diamondcasa(sales_invoice):
	"""Sync invoice to DiamondCasa"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get Sales Invoice
		si = frappe.get_doc("Sales Invoice", sales_invoice)
		
		# Prepare invoice data
		invoice_data = {
			"sales_invoice": si.name,
			"sales_order": si.items[0].sales_order if si.items else None,
			"customer": si.customer,
			"total_amount": si.grand_total,
			"status": si.status,
			"posting_date": str(si.posting_date) if si.posting_date else None
		}
		
		# Sync invoice
		idempotency_key = f"invoice_{si.name}_{calculate_hash(invoice_data)}"
		result = make_api_request("POST", "invoices", data=invoice_data, idempotency_key=idempotency_key)
		return result
	except Exception as e:
		frappe.log_error(f"Failed to sync invoice {sales_invoice}: {str(e)}", "Invoice Sync Error")
		return {"status": "error", "message": str(e)}


# Scheduled sync functions (called by scheduler)

def sync_products_to_diamondcasa():
	"""Scheduled function to sync all products"""
	try:
		config = get_diamondcasa_config()
		if not config.get("sync_enabled"):
			return {"status": "disabled"}
		
		# Get all web-visible and approved SKUs
		skus = frappe.db.get_all("Jewellery SKU",
			filters={"is_web_visible": 1, "is_web_approved": 1, "is_active": 1},
			fields=["name", "item_code", "sync_status", "last_synced"]
		)
		
		# Sync each SKU
		results = []
		for sku in skus:
			try:
				result = sync_product_to_diamondcasa(sku.item_code)
				results.append(result)
			except Exception as e:
				frappe.log_error(f"Failed to sync product {sku.item_code}: {str(e)}", "Product Sync Error")
				results.append({"status": "error", "item_code": sku.item_code, "message": str(e)})
		
		success_count = sum(1 for r in results if r.get("status") == "success")
		return {
			"status": "completed",
			"total": len(skus),
			"success": success_count,
			"failed": len(skus) - success_count
		}
	except Exception as e:
		frappe.log_error(f"Failed in scheduled product sync: {str(e)}", "Product Sync Error")
		return {"status": "error", "message": str(e)}


def sync_inventory_to_diamondcasa_scheduled():
	"""Scheduled function to sync inventory"""
	return sync_inventory_to_diamondcasa()


def sync_prices_to_diamondcasa_scheduled():
	"""Scheduled function to sync prices"""
	return sync_prices_to_diamondcasa()


def sync_media_to_diamondcasa_scheduled():
	"""Scheduled function to sync media"""
	return sync_media_to_diamondcasa()


def cleanup_old_integration_logs():
	"""Cleanup old integration logs (older than 90 days)"""
	try:
		cutoff_date = add_to_date(now(), days=-90)
		frappe.db.sql("""
			DELETE FROM `tabIntegration Log`
			WHERE sync_timestamp < %s
			AND status = 'Success'
		""", (cutoff_date,))
		frappe.db.commit()
	except Exception as e:
		frappe.log_error(f"Failed to cleanup old logs: {str(e)}", "Log Cleanup Error")
