# -*- coding: utf-8 -*-
"""
DiamondCasa Products API
Endpoints: /api/diamondcasa/products
"""

import frappe
from frappe import _
from frappe.utils import now
import json


@frappe.whitelist(allow_guest=False)
def get_products(filters=None, limit=100, offset=0):
	"""
	GET /api/diamondcasa/products
	Get products from ERPNext (for DiamondCasa sync)
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Item", "read"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Parse filters
		if isinstance(filters, str):
			filters = json.loads(filters)
		filters = filters or {}
		
		# Build query
		conditions = ["item_group = 'Jewelry'"]
		if filters.get("is_web_visible"):
			conditions.append("EXISTS (SELECT 1 FROM `tabJewellery SKU` WHERE `tabJewellery SKU`.item_code = `tabItem`.name AND `tabJewellery SKU`.is_web_visible = 1)")
		if filters.get("is_active"):
			conditions.append("disabled = 0")
		
		# Get items
		items = frappe.db.sql("""
			SELECT 
				item.name,
				item.item_code,
				item.item_name,
				item.description,
				item.item_group,
				item.disabled,
				sku.sku_code,
				sku.metal_spec,
				sku.metal_purity,
				sku.stone_spec,
				sku.stone_carat,
				sku.final_price,
				sku.is_web_visible,
				sku.is_web_approved,
				sku.last_synced
			FROM `tabItem` item
			LEFT JOIN `tabJewellery SKU` sku ON sku.item_code = item.name
			WHERE {}
			ORDER BY item.modified DESC
			LIMIT %s OFFSET %s
		""".format(" AND ".join(conditions)), (limit, offset), as_dict=True)
		
		# Get total count
		total = frappe.db.sql("""
			SELECT COUNT(*) as total
			FROM `tabItem` item
			WHERE {}
		""".format(" AND ".join(conditions)), as_dict=True)[0].total
		
		return {
			"status": "success",
			"data": items,
			"total": total,
			"limit": limit,
			"offset": offset
		}
	except Exception as e:
		frappe.log_error(f"Error in get_products: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to fetch products: {0}").format(str(e)))


@frappe.whitelist(allow_guest=False)
def create_product(data):
	"""
	POST /api/diamondcasa/products
	Create product in ERPNext (from DiamondCasa)
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Item", "create"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Check idempotency
		idempotency_key = data.get("idempotency_key")
		if idempotency_key:
			existing = frappe.db.get_value("Integration Log", {"idempotency_key": idempotency_key}, "name")
			if existing:
				return {"status": "duplicate", "message": "Request already processed"}
		
		# Create Item
		item = frappe.get_doc({
			"doctype": "Item",
			"item_code": data.get("item_code"),
			"item_name": data.get("item_name"),
			"item_group": data.get("item_group", "Jewelry"),
			"description": data.get("description"),
			"stock_uom": "Nos",
			"is_stock_item": 1
		})
		item.insert(ignore_permissions=True)
		
		# Create Jewellery SKU if provided
		if data.get("sku_code"):
			sku = frappe.get_doc({
				"doctype": "Jewellery SKU",
				"sku_code": data.get("sku_code"),
				"item_code": item.name,
				"design": data.get("design"),
				"metal_spec": data.get("metal_spec"),
				"metal_purity": data.get("metal_purity"),
				"stone_spec": data.get("stone_spec"),
				"stone_carat": data.get("stone_carat"),
				"final_price": data.get("price"),
				"is_web_visible": data.get("is_web_visible", False),
				"is_web_approved": data.get("is_web_approved", False)
			})
			sku.insert(ignore_permissions=True)
		
		# Log integration
		frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": "Product Sync",
			"direction": "DiamondCasa → ERPNext",
			"status": "Success",
			"endpoint": "/api/diamondcasa/products",
			"method": "POST",
			"request_payload": json.dumps(data),
			"idempotency_key": idempotency_key,
			"reference_doctype": "Item",
			"reference_name": item.name
		}).insert(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"item_code": item.name,
			"message": "Product created successfully"
		}
	except Exception as e:
		frappe.log_error(f"Error in create_product: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to create product: {0}").format(str(e)))


@frappe.whitelist(allow_guest=False)
def update_product(item_code, data):
	"""
	PATCH /api/diamondcasa/products/<item_code>
	Update product in ERPNext (from DiamondCasa)
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Item", "write"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Get item
		item = frappe.get_doc("Item", item_code)
		
		# Update item fields
		if "item_name" in data:
			item.item_name = data["item_name"]
		if "description" in data:
			item.description = data["description"]
		if "item_group" in data:
			item.item_group = data["item_group"]
		
		item.save(ignore_permissions=True)
		
		# Update SKU if provided
		if data.get("sku_code"):
			sku = frappe.db.get_value("Jewellery SKU", {"item_code": item_code}, "name")
			if sku:
				sku_doc = frappe.get_doc("Jewellery SKU", sku)
				if "price" in data:
					sku_doc.final_price = data["price"]
				if "is_web_visible" in data:
					sku_doc.is_web_visible = data["is_web_visible"]
				if "is_web_approved" in data:
					sku_doc.is_web_approved = data["is_web_approved"]
				sku_doc.save(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"message": "Product updated successfully"
		}
	except Exception as e:
		frappe.log_error(f"Error in update_product: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to update product: {0}").format(str(e)))
