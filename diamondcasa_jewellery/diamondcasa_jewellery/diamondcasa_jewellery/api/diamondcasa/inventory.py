# -*- coding: utf-8 -*-
"""
DiamondCasa Inventory API
Endpoints: /api/diamondcasa/inventory
"""

import frappe
from frappe import _
from frappe.utils import now
import json


@frappe.whitelist(allow_guest=False)
def get_inventory(item_code=None, warehouse=None):
	"""
	GET /api/diamondcasa/inventory
	Get inventory levels from ERPNext
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Bin", "read"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Build query
		conditions = ["item.item_group = 'Jewelry'"]
		if item_code:
			conditions.append(f"item.item_code = '{item_code}'")
		if warehouse:
			conditions.append(f"bin.warehouse = '{warehouse}'")
		
		# Get inventory
		inventory = frappe.db.sql("""
			SELECT 
				item.item_code,
				item.item_name,
				bin.warehouse,
				COALESCE(bin.actual_qty, 0) as available_qty,
				COALESCE(bin.reserved_qty, 0) as reserved_qty,
				COALESCE(bin.ordered_qty, 0) as ordered_qty
			FROM `tabItem` item
			LEFT JOIN `tabBin` bin ON bin.item_code = item.name
			WHERE {}
			ORDER BY item.item_code, bin.warehouse
		""".format(" AND ".join(conditions)), as_dict=True)
		
		return {
			"status": "success",
			"data": inventory
		}
	except Exception as e:
		frappe.log_error(f"Error in get_inventory: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to fetch inventory: {0}").format(str(e)))


@frappe.whitelist(allow_guest=False)
def update_inventory(item_code, warehouse, qty, idempotency_key=None):
	"""
	PATCH /api/diamondcasa/inventory
	Update inventory in ERPNext (from DiamondCasa)
	"""
	try:
		# Validate permissions
		if not frappe.has_permission("Stock Entry", "create"):
			frappe.throw(_("Insufficient permissions"), frappe.PermissionError)
		
		# Check idempotency
		if idempotency_key:
			existing = frappe.db.get_value("Integration Log", {"idempotency_key": idempotency_key}, "name")
			if existing:
				return {"status": "duplicate", "message": "Request already processed"}
		
		# Get current stock
		current_qty = frappe.db.get_value("Bin", {
			"item_code": item_code,
			"warehouse": warehouse
		}, "actual_qty") or 0
		
		qty_diff = qty - current_qty
		
		if qty_diff != 0:
			# Create Stock Entry
			stock_entry = frappe.get_doc({
				"doctype": "Stock Entry",
				"stock_entry_type": "Material Receipt" if qty_diff > 0 else "Material Issue",
				"items": [{
					"item_code": item_code,
					"qty": abs(qty_diff),
					"s_warehouse": warehouse if qty_diff < 0 else None,
					"t_warehouse": warehouse if qty_diff > 0 else None
				}]
			})
			stock_entry.insert(ignore_permissions=True)
			stock_entry.submit()
		
		# Log integration
		frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": "Inventory Sync",
			"direction": "DiamondCasa → ERPNext",
			"status": "Success",
			"endpoint": "/api/diamondcasa/inventory",
			"method": "PATCH",
			"idempotency_key": idempotency_key,
			"reference_doctype": "Stock Entry",
			"reference_name": stock_entry.name if qty_diff != 0 else None
		}).insert(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"message": "Inventory updated successfully",
			"current_qty": qty
		}
	except Exception as e:
		frappe.log_error(f"Error in update_inventory: {str(e)}", "DiamondCasa API Error")
		frappe.throw(_("Failed to update inventory: {0}").format(str(e)))
