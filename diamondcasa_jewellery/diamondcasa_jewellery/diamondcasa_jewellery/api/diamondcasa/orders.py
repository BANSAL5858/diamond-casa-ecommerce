# -*- coding: utf-8 -*-
"""
DiamondCasa Orders API
Endpoints: /api/diamondcasa/orders
"""

import frappe
from frappe import _
from frappe.utils import now
import json


@frappe.whitelist(allow_guest=False)
def create_order(data):
	"""
	POST /api/diamondcasa/orders
	Create Sales Order in ERPNext (from DiamondCasa)
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Sales Order", "create"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Check idempotency
		idempotency_key = data.get("idempotency_key")
		if idempotency_key:
			existing = frappe.db.get_value("Integration Log", {"idempotency_key": idempotency_key}, "name")
			if existing:
				# Return existing order
				existing_order = frappe.db.get_value("Integration Log", {"idempotency_key": idempotency_key}, "reference_name")
				if existing_order:
					return {
						"status": "duplicate",
						"sales_order": existing_order,
						"message": "Order already exists"
					}
		
		# Get or create customer
		customer = get_or_create_customer(data.get("customer"))
		
		# Create Sales Order
		sales_order = frappe.get_doc({
			"doctype": "Sales Order",
			"customer": customer,
			"transaction_date": now().date(),
			"delivery_date": data.get("delivery_date"),
			"items": []
		})
		
		# Add items
		for item_data in data.get("items", []):
			sales_order.append("items", {
				"item_code": item_data.get("item_code"),
				"qty": item_data.get("qty", 1),
				"rate": item_data.get("rate")
			})
		
		# Add custom fields
		if hasattr(sales_order, "custom_website_order_id"):
			sales_order.custom_website_order_id = data.get("order_id")
		if hasattr(sales_order, "custom_payment_method"):
			sales_order.custom_payment_method = data.get("payment_method")
		
		sales_order.insert(ignore_permissions=True)
		sales_order.submit()
		
		# Log integration
		frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": "Order Sync",
			"direction": "DiamondCasa → ERPNext",
			"status": "Success",
			"endpoint": "/api/diamondcasa/orders",
			"method": "POST",
			"request_payload": json.dumps(data),
			"idempotency_key": idempotency_key,
			"reference_doctype": "Sales Order",
			"reference_name": sales_order.name
		}).insert(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"sales_order": sales_order.name,
			"message": "Order created successfully"
		}
	except Exception as e:
		frappe.log_error(f"Error in create_order: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to create order: {0}").format(str(e)))


@frappe.whitelist(allow_guest=False)
def get_order_status(sales_order):
	"""
	GET /api/diamondcasa/orders/<sales_order>
	Get order status from ERPNext
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Sales Order", "read"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Get Sales Order
		so = frappe.get_doc("Sales Order", sales_order)
		
		# Get delivery note
		delivery_note = frappe.db.get_value("Delivery Note Item", {
			"against_sales_order": sales_order
		}, "parent")
		
		# Get invoice
		sales_invoice = frappe.db.get_value("Sales Invoice Item", {
			"sales_order": sales_order
		}, "parent")
		
		return {
			"status": "success",
			"data": {
				"sales_order": so.name,
				"status": so.status,
				"delivery_note": delivery_note,
				"sales_invoice": sales_invoice,
				"delivery_date": str(so.delivery_date) if so.delivery_date else None
			}
		}
	except Exception as e:
		frappe.log_error(f"Error in get_order_status: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to fetch order status: {0}").format(str(e)))


def get_or_create_customer(customer_data):
	"""Get or create customer from customer data"""
	if isinstance(customer_data, str):
		# Assume it's customer ID
		if frappe.db.exists("Customer", customer_data):
			return customer_data
		else:
			# Try to find by customer name
			customer_name = frappe.db.get_value("Customer", {"customer_name": customer_data}, "name")
			if customer_name:
				return customer_name
			# Create new customer if not found
			customer = frappe.get_doc({
				"doctype": "Customer",
				"customer_name": customer_data,
				"customer_type": "Individual",
				"customer_group": "Individual"
			})
			customer.insert(ignore_permissions=True)
			return customer.name
	
	# Create new customer from dict
	customer_name = customer_data.get("name") or customer_data.get("customer_name")
	if not customer_name:
		frappe.throw(_("Customer name is required"))
	
	# Check if customer already exists
	existing = frappe.db.get_value("Customer", {"customer_name": customer_name}, "name")
	if existing:
		return existing
	
	# Create new customer
	customer = frappe.get_doc({
		"doctype": "Customer",
		"customer_name": customer_name,
		"customer_type": customer_data.get("customer_type", "Individual"),
		"customer_group": customer_data.get("customer_group", "Individual")
	})
	customer.insert(ignore_permissions=True)
	return customer.name
