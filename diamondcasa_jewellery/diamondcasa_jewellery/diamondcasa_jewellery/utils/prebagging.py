# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import now, flt


def create_bag_from_material_request(material_request):
	"""
	Create Bag from Material Request for pre-bagging workflow
	
	Args:
		material_request: Material Request document
	
	Returns:
		Bag document name
	"""
	try:
		# Check if bag already exists
		existing_bag = frappe.db.get_value(
			"Bag",
			{"material_request": material_request.name},
			"name"
		)
		if existing_bag:
			return existing_bag
		
		# Get settings
		settings = frappe.get_single("DiamondCasa Jewellery Settings")
		enable_prebagging = settings.get("enable_prebagging") or 0
		
		if not enable_prebagging:
			return None
		
		# Create bag
		bag = frappe.new_doc("Bag")
		bag.bag_number = generate_bag_number(material_request)
		bag.bag_type = "Production Bag"
		bag.material_request = material_request.name
		bag.status = "Pre-Bagged"
		bag.current_stage = "Material Requested"
		
		# Link to sales order if exists
		if material_request.get("sales_order"):
			bag.sales_order = material_request.sales_order
			bag.customer = frappe.db.get_value("Sales Order", material_request.sales_order, "customer")
		
		# Add items from material request
		for item in material_request.items:
			bag.append("items_table", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"qty": item.qty,
				"uom": item.uom,
				"warehouse": item.warehouse,
				"description": item.description
			})
		
		# Add status to timeline
		bag.append("status_timeline", {
			"status": "Pre-Bagged",
			"changed_by": frappe.session.user,
			"changed_on": now(),
			"notes": f"Created from Material Request {material_request.name}"
		})
		
		bag.insert()
		bag.save()
		
		# Log action
		from diamondcasa_jewellery.diamondcasa_jewellery.doctype.jewellery_action_log.jewellery_action_log import log_action
		log_action(
			doctype="Bag",
			docname=bag.name,
			action="created",
			details=f"Bag {bag.bag_number} created from Material Request {material_request.name}"
		)
		
		frappe.msgprint(f"Bag {bag.bag_number} created for Material Request {material_request.name}")
		return bag.name
		
	except Exception as e:
		frappe.log_error(f"Pre-bagging error: {str(e)}", "Pre-bagging Error")
		frappe.throw(f"Failed to create bag: {str(e)}")


def generate_bag_number(material_request):
	"""Generate unique bag number"""
	from frappe.utils import now_datetime
	timestamp = now_datetime().strftime("%Y%m%d%H%M%S")
	base_code = f"BAG{timestamp}"
	
	counter = 1
	bag_number = base_code
	while frappe.db.exists("Bag", {"bag_number": bag_number}):
		bag_number = f"{base_code}{counter:03d}"
		counter += 1
	
	return bag_number


def update_bag_from_material_request(material_request):
	"""
	Update Bag when Material Request is updated
	
	Args:
		material_request: Material Request document
	"""
	try:
		bag_name = frappe.db.get_value(
			"Bag",
			{"material_request": material_request.name},
			"name"
		)
		
		if not bag_name:
			return
		
		bag = frappe.get_doc("Bag", bag_name)
		
		# Update items
		bag.items_table = []
		for item in material_request.items:
			bag.append("items_table", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"qty": item.qty,
				"uom": item.uom,
				"warehouse": item.warehouse,
				"description": item.description
			})
		
		bag.save()
		
	except Exception as e:
		frappe.log_error(f"Update bag error: {str(e)}", "Pre-bagging Error")


def on_material_request_submit(doc, method):
	"""Hook: When Material Request is submitted"""
	try:
		settings = frappe.get_single("DiamondCasa Jewellery Settings")
		enable_prebagging = settings.get("enable_prebagging") or 0
		
		if not enable_prebagging:
			return
		
		# Create bag if not exists
		create_bag_from_material_request(doc)
		
	except Exception as e:
		frappe.log_error(f"Material Request submit hook error: {str(e)}", "Pre-bagging Error")


def on_material_request_update(doc, method):
	"""Hook: When Material Request is updated"""
	try:
		settings = frappe.get_single("DiamondCasa Jewellery Settings")
		enable_prebagging = settings.get("enable_prebagging") or 0
		
		if not enable_prebagging:
			return
		
		# Update bag if exists
		update_bag_from_material_request(doc)
		
	except Exception as e:
		frappe.log_error(f"Material Request update hook error: {str(e)}", "Pre-bagging Error")
