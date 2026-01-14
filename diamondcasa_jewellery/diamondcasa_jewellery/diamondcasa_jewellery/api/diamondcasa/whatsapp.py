# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import validate_email_address
import json


@frappe.whitelist(allow_guest=False)
def send_message():
	"""
	Send WhatsApp message
	
	Request:
		{
			"phone_number": "+919876543210",
			"message": "Hello, this is a test message"
		}
	
	Returns:
		{
			"status": "success",
			"message_id": "msg_123"
		}
	"""
	try:
		data = frappe.local.form_dict
		phone_number = data.get("phone_number")
		message = data.get("message")
		template_name = data.get("template_name")
		template_params = data.get("template_params")
		
		if not phone_number:
			return {"status": "error", "message": "phone_number is required"}
		
		if not message and not template_name:
			return {"status": "error", "message": "message or template_name is required"}
		
		from diamondcasa_jewellery.diamondcasa_jewellery.utils.whatsapp import send_whatsapp_message
		
		result = send_whatsapp_message(
			phone_number=phone_number,
			message=message,
			template_name=template_name,
			template_params=template_params
		)
		
		return result
	
	except Exception as e:
		frappe.log_error(f"WhatsApp API error: {str(e)}", "WhatsApp API Error")
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=False)
def send_quotation():
	"""
	Send quotation via WhatsApp
	
	Request:
		{
			"quotation_name": "QUO-00001",
			"phone_number": "+919876543210" (optional)
		}
	"""
	try:
		data = frappe.local.form_dict
		quotation_name = data.get("quotation_name")
		phone_number = data.get("phone_number")
		
		if not quotation_name:
			return {"status": "error", "message": "quotation_name is required"}
		
		from diamondcasa_jewellery.diamondcasa_jewellery.utils.whatsapp import send_quotation_via_whatsapp
		
		result = send_quotation_via_whatsapp(quotation_name, phone_number)
		return result
	
	except Exception as e:
		frappe.log_error(f"WhatsApp quotation API error: {str(e)}", "WhatsApp API Error")
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=False)
def send_invoice():
	"""
	Send invoice via WhatsApp
	
	Request:
		{
			"invoice_name": "SI-00001",
			"phone_number": "+919876543210" (optional)
		}
	"""
	try:
		data = frappe.local.form_dict
		invoice_name = data.get("invoice_name")
		phone_number = data.get("phone_number")
		
		if not invoice_name:
			return {"status": "error", "message": "invoice_name is required"}
		
		from diamondcasa_jewellery.diamondcasa_jewellery.utils.whatsapp import send_invoice_via_whatsapp
		
		result = send_invoice_via_whatsapp(invoice_name, phone_number)
		return result
	
	except Exception as e:
		frappe.log_error(f"WhatsApp invoice API error: {str(e)}", "WhatsApp API Error")
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=False)
def send_document():
	"""
	Send document via WhatsApp
	
	Request:
		{
			"phone_number": "+919876543210",
			"document_url": "https://example.com/doc.pdf",
			"caption": "Optional caption"
		}
	"""
	try:
		data = frappe.local.form_dict
		phone_number = data.get("phone_number")
		document_url = data.get("document_url")
		caption = data.get("caption")
		
		if not phone_number or not document_url:
			return {"status": "error", "message": "phone_number and document_url are required"}
		
		from diamondcasa_jewellery.diamondcasa_jewellery.utils.whatsapp import send_whatsapp_document
		
		result = send_whatsapp_document(phone_number, document_url, caption)
		return result
	
	except Exception as e:
		frappe.log_error(f"WhatsApp document API error: {str(e)}", "WhatsApp API Error")
		return {"status": "error", "message": str(e)}
