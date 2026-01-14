# -*- coding: utf-8 -*-
"""
DiamondCasa Webhooks API
Endpoints: /api/diamondcasa/webhooks/*
"""

import frappe
from frappe import _
from frappe.utils import now
import json
import hmac
import hashlib


@frappe.whitelist(allow_guest=True)
def order_created(data):
	"""
	POST /api/diamondcasa/webhooks/order_created
	Webhook receiver for order_created event from DiamondCasa
	"""
	try:
		# Verify webhook signature
		if not verify_webhook_signature(data):
			frappe.throw(_("Invalid webhook signature"), frappe.AuthenticationError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Process order creation
		from diamondcasa_jewellery.api.diamondcasa.orders import create_order
		result = create_order(data)
		
		return {
			"status": "success",
			"message": "Webhook processed successfully",
			"result": result
		}
	except Exception as e:
		frappe.log_error(f"Error in order_created webhook: {str(e)}", "DiamondCasa Webhook Error")
		frappe.throw(_("Failed to process webhook: {0}").format(str(e)))


@frappe.whitelist(allow_guest=True)
def payment_captured(data):
	"""
	POST /api/diamondcasa/webhooks/payment_captured
	Webhook receiver for payment_captured event from DiamondCasa
	"""
	try:
		# Verify webhook signature
		if not verify_webhook_signature(data):
			frappe.throw(_("Invalid webhook signature"), frappe.AuthenticationError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Create Payment Entry
		payment_entry = frappe.get_doc({
			"doctype": "Payment Entry",
			"payment_type": "Receive",
			"party_type": "Customer",
			"party": data.get("customer"),
			"paid_amount": data.get("amount"),
			"received_amount": data.get("amount"),
			"reference_no": data.get("transaction_id"),
			"reference_date": now().date()
		})
		payment_entry.insert(ignore_permissions=True)
		payment_entry.submit()
		
		# Log integration
		frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": "Payment Sync",
			"direction": "DiamondCasa → ERPNext",
			"status": "Success",
			"endpoint": "/api/diamondcasa/webhooks/payment_captured",
			"method": "POST",
			"request_payload": json.dumps(data),
			"reference_doctype": "Payment Entry",
			"reference_name": payment_entry.name
		}).insert(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"message": "Payment processed successfully"
		}
	except Exception as e:
		frappe.log_error(f"Error in payment_captured webhook: {str(e)}", "DiamondCasa Webhook Error")
		frappe.throw(_("Failed to process webhook: {0}").format(str(e)))


@frappe.whitelist(allow_guest=True)
def order_cancelled(data):
	"""
	POST /api/diamondcasa/webhooks/order_cancelled
	Webhook receiver for order_cancelled event from DiamondCasa
	"""
	try:
		# Verify webhook signature
		if not verify_webhook_signature(data):
			frappe.throw(_("Invalid webhook signature"), frappe.AuthenticationError)
		
		# Parse data
		if isinstance(data, str):
			data = json.loads(data)
		
		# Get Sales Order
		sales_order = data.get("sales_order")
		if not sales_order:
			frappe.throw(_("Sales Order not provided"))
		
		# Cancel Sales Order
		so = frappe.get_doc("Sales Order", sales_order)
		so.cancel()
		
		# Log integration
		frappe.get_doc({
			"doctype": "Integration Log",
			"integration_type": "Order Sync",
			"direction": "DiamondCasa → ERPNext",
			"status": "Success",
			"endpoint": "/api/diamondcasa/webhooks/order_cancelled",
			"method": "POST",
			"request_payload": json.dumps(data),
			"reference_doctype": "Sales Order",
			"reference_name": sales_order
		}).insert(ignore_permissions=True)
		
		frappe.db.commit()
		
		return {
			"status": "success",
			"message": "Order cancelled successfully"
		}
	except Exception as e:
		frappe.log_error(f"Error in order_cancelled webhook: {str(e)}", "DiamondCasa Webhook Error")
		frappe.throw(_("Failed to process webhook: {0}").format(str(e)))


def verify_webhook_signature(data):
	"""Verify webhook signature"""
	try:
		# Get webhook secret from config
		webhook_secret = frappe.conf.get("diamondcasa_webhook_secret")
		if not webhook_secret:
			# For development, allow unsigned webhooks
			return True
		
		# Get signature from headers
		if not hasattr(frappe, 'request') or not frappe.request:
			# If request object not available, skip verification (for testing)
			return True
		
		signature = frappe.request.headers.get("X-DiamondCasa-Signature")
		if not signature:
			return False
		
		# Calculate expected signature
		if isinstance(data, str):
			payload = data
		else:
			payload = json.dumps(data, sort_keys=True)
		
		expected_signature = hmac.new(
			webhook_secret.encode(),
			payload.encode(),
			hashlib.sha256
		).hexdigest()
		
		# Compare signatures
		return hmac.compare_digest(signature, expected_signature)
	except Exception as e:
		frappe.log_error(f"Error verifying webhook signature: {str(e)}", "Webhook Signature Error")
		# Fail secure - reject if verification fails
		return False
