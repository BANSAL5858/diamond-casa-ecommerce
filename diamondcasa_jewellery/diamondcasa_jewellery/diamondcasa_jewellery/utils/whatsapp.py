# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import requests
import json
from frappe.utils import get_url, get_request_site_address


def send_whatsapp_message(phone_number, message, template_name=None, template_params=None):
	"""
	Send WhatsApp message using configured API
	
	Args:
		phone_number: Phone number with country code (e.g., +919876543210)
		message: Plain text message (if template_name not provided)
		template_name: Template name (if using template-based messaging)
		template_params: List of parameters for template
	
	Returns:
		dict: Response with status and message_id
	"""
	try:
		config = get_whatsapp_config()
		if not config.get("enabled"):
			return {"status": "error", "message": "WhatsApp integration is disabled"}
		
		api_url = config.get("api_url")
		api_key = config.get("api_key")
		api_secret = config.get("api_secret")
		
		if not api_url or not api_key:
			return {"status": "error", "message": "WhatsApp API credentials not configured"}
		
		# Prepare request
		headers = {
			"Authorization": f"Bearer {api_key}",
			"Content-Type": "application/json"
		}
		
		if template_name:
			# Template-based message
			payload = {
				"to": phone_number,
				"template": template_name,
				"parameters": template_params or []
			}
		else:
			# Plain text message
			payload = {
				"to": phone_number,
				"message": message
			}
		
		# Send request
		response = requests.post(
			api_url,
			headers=headers,
			json=payload,
			timeout=30
		)
		
		if response.status_code == 200:
			result = response.json()
			message_id = result.get("message_id") or result.get("id")
			
			# Log action
			log_whatsapp_action(phone_number, message, "sent", message_id)
			
			return {
				"status": "success",
				"message_id": message_id,
				"message": "WhatsApp message sent successfully"
			}
		else:
			error_msg = response.text or f"HTTP {response.status_code}"
			log_whatsapp_action(phone_number, message, "failed", None, error_msg)
			return {
				"status": "error",
				"message": f"Failed to send WhatsApp message: {error_msg}"
			}
	
	except Exception as e:
		frappe.log_error(f"WhatsApp send error: {str(e)}", "WhatsApp Error")
		log_whatsapp_action(phone_number, message, "error", None, str(e))
		return {
			"status": "error",
			"message": f"Error sending WhatsApp message: {str(e)}"
		}


def send_whatsapp_document(phone_number, document_url, caption=None):
	"""
	Send document via WhatsApp
	
	Args:
		phone_number: Phone number with country code
		document_url: URL of document to send
		caption: Optional caption
	
	Returns:
		dict: Response with status
	"""
	try:
		config = get_whatsapp_config()
		if not config.get("enabled"):
			return {"status": "error", "message": "WhatsApp integration is disabled"}
		
		api_url = config.get("api_url")
		api_key = config.get("api_key")
		
		headers = {
			"Authorization": f"Bearer {api_key}",
			"Content-Type": "application/json"
		}
		
		payload = {
			"to": phone_number,
			"type": "document",
			"document": {
				"url": document_url,
				"caption": caption or ""
			}
		}
		
		response = requests.post(
			api_url,
			headers=headers,
			json=payload,
			timeout=30
		)
		
		if response.status_code == 200:
			return {"status": "success", "message": "Document sent successfully"}
		else:
			return {"status": "error", "message": f"Failed to send document: {response.text}"}
	
	except Exception as e:
		frappe.log_error(f"WhatsApp document send error: {str(e)}", "WhatsApp Error")
		return {"status": "error", "message": str(e)}


def send_whatsapp_image(phone_number, image_url, caption=None):
	"""
	Send image via WhatsApp
	
	Args:
		phone_number: Phone number with country code
		image_url: URL of image to send
		caption: Optional caption
	
	Returns:
		dict: Response with status
	"""
	try:
		config = get_whatsapp_config()
		if not config.get("enabled"):
			return {"status": "error", "message": "WhatsApp integration is disabled"}
		
		api_url = config.get("api_url")
		api_key = config.get("api_key")
		
		headers = {
			"Authorization": f"Bearer {api_key}",
			"Content-Type": "application/json"
		}
		
		payload = {
			"to": phone_number,
			"type": "image",
			"image": {
				"url": image_url,
				"caption": caption or ""
			}
		}
		
		response = requests.post(
			api_url,
			headers=headers,
			json=payload,
			timeout=30
		)
		
		if response.status_code == 200:
			return {"status": "success", "message": "Image sent successfully"}
		else:
			return {"status": "error", "message": f"Failed to send image: {response.text}"}
	
	except Exception as e:
		frappe.log_error(f"WhatsApp image send error: {str(e)}", "WhatsApp Error")
		return {"status": "error", "message": str(e)}


def send_quotation_via_whatsapp(quotation_name, phone_number=None):
	"""
	Send quotation PDF via WhatsApp
	
	Args:
		quotation_name: Quotation document name
		phone_number: Optional phone number (fetches from quotation if not provided)
	
	Returns:
		dict: Response with status
	"""
	try:
		quotation = frappe.get_doc("Quotation", quotation_name)
		
		if not phone_number:
			phone_number = quotation.contact_mobile or quotation.mobile_no
		
		if not phone_number:
			return {"status": "error", "message": "Phone number not found"}
		
		# Generate PDF
		pdf_url = get_url(f"/api/method/frappe.utils.print_format.download_pdf?doctype=Quotation&name={quotation_name}&format=Standard")
		
		# Send via WhatsApp
		message = f"Quotation {quotation.name} for {quotation.customer_name}"
		return send_whatsapp_document(phone_number, pdf_url, message)
	
	except Exception as e:
		frappe.log_error(f"WhatsApp quotation send error: {str(e)}", "WhatsApp Error")
		return {"status": "error", "message": str(e)}


def send_invoice_via_whatsapp(invoice_name, phone_number=None):
	"""
	Send invoice PDF via WhatsApp
	
	Args:
		invoice_name: Sales Invoice document name
		phone_number: Optional phone number (fetches from invoice if not provided)
	
	Returns:
		dict: Response with status
	"""
	try:
		invoice = frappe.get_doc("Sales Invoice", invoice_name)
		
		if not phone_number:
			phone_number = invoice.contact_mobile or invoice.mobile_no
		
		if not phone_number:
			return {"status": "error", "message": "Phone number not found"}
		
		# Generate PDF
		pdf_url = get_url(f"/api/method/frappe.utils.print_format.download_pdf?doctype=Sales Invoice&name={invoice_name}&format=Standard")
		
		# Send via WhatsApp
		message = f"Invoice {invoice.name} for {invoice.customer_name} - Amount: {invoice.grand_total}"
		return send_whatsapp_document(phone_number, pdf_url, message)
	
	except Exception as e:
		frappe.log_error(f"WhatsApp invoice send error: {str(e)}", "WhatsApp Error")
		return {"status": "error", "message": str(e)}


def get_whatsapp_config():
	"""
	Get WhatsApp configuration from settings
	
	Returns:
		dict: Configuration with enabled, api_url, api_key, api_secret
	"""
	try:
		settings = frappe.get_single("DiamondCasa Jewellery Settings")
		return {
			"enabled": settings.get("whatsapp_enabled") or 0,
			"api_url": settings.get("whatsapp_api_url") or "",
			"api_key": settings.get("whatsapp_api_key") or "",
			"api_secret": settings.get("whatsapp_api_secret") or ""
		}
	except:
		return {
			"enabled": 0,
			"api_url": "",
			"api_key": "",
			"api_secret": ""
		}


def log_whatsapp_action(phone_number, message, status, message_id=None, error=None):
	"""
	Log WhatsApp action for audit
	
	Args:
		phone_number: Phone number
		message: Message content
		status: sent, failed, error
		message_id: Optional message ID
		error: Optional error message
	"""
	try:
		from diamondcasa_jewellery.diamondcasa_jewellery.doctype.jewellery_action_log.jewellery_action_log import log_action
		
		details = f"WhatsApp message to {phone_number}: {status}"
		if message_id:
			details += f" (ID: {message_id})"
		if error:
			details += f" - Error: {error}"
		
		log_action(
			doctype="WhatsApp Message",
			docname=phone_number,
			action=status,
			details=details
		)
	except:
		pass  # Don't fail if logging fails
