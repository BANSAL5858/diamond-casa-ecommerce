# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class JewelleryActionLog(Document):
	pass


def log_action(action_type, action_description, reference_doctype=None, reference_name=None, 
			   old_value=None, new_value=None, is_critical=False, requires_approval=False):
	"""
	Utility function to log actions
	
	Args:
		action_type: Type of action (Create, Update, Delete, etc.)
		action_description: Description of action
		reference_doctype: Reference DocType
		reference_name: Reference document name
		old_value: Old value (JSON string)
		new_value: New value (JSON string)
		is_critical: Whether this is a critical action
		requires_approval: Whether approval is required
	"""
	try:
		import json
		import frappe.request
		
		# Get IP and user agent if available
		ip_address = None
		user_agent = None
		if hasattr(frappe, 'request') and frappe.request:
			ip_address = frappe.request.environ.get('REMOTE_ADDR')
			user_agent = frappe.request.headers.get('User-Agent')
		
		log_doc = frappe.get_doc({
			"doctype": "Jewellery Action Log",
			"action_type": action_type,
			"action_description": action_description,
			"user": frappe.session.user,
			"action_timestamp": frappe.utils.now(),
			"reference_doctype": reference_doctype,
			"reference_name": reference_name,
			"old_value": json.dumps(old_value) if old_value else None,
			"new_value": json.dumps(new_value) if new_value else None,
			"action_status": "Success",
			"ip_address": ip_address,
			"user_agent": user_agent,
			"is_critical_action": is_critical,
			"requires_approval": requires_approval
		})
		log_doc.insert(ignore_permissions=True)
		frappe.db.commit()
		return log_doc.name
	except Exception as e:
		frappe.log_error(f"Failed to create action log: {str(e)}", "Action Log Error")
		return None
