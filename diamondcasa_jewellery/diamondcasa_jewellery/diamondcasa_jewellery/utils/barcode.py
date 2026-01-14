# -*- coding: utf-8 -*-
"""
Barcode and QR code generation utilities
"""

import frappe
import qrcode
from io import BytesIO
import base64


def generate_barcode(data, barcode_type="CODE128"):
	"""
	Generate barcode image
	
	Args:
		data: Data to encode in barcode
		barcode_type: Type of barcode (CODE128, EAN13, etc.)
	
	Returns:
		dict: {
			"barcode_image": base64_encoded_image,
			"barcode_data": data
		}
	"""
	try:
		# For now, use QR code as barcode (can be enhanced with barcode library)
		# In production, use python-barcode library
		qr = qrcode.QRCode(version=1, box_size=10, border=5)
		qr.add_data(data)
		qr.make(fit=True)
		
		img = qr.make_image(fill_color="black", back_color="white")
		
		# Convert to base64
		buffer = BytesIO()
		img.save(buffer, format="PNG")
		img_str = base64.b64encode(buffer.getvalue()).decode()
		
		return {
			"status": "success",
			"barcode_image": f"data:image/png;base64,{img_str}",
			"barcode_data": data,
			"barcode_type": barcode_type
		}
	except Exception as e:
		frappe.log_error(f"Error generating barcode: {str(e)}", "Barcode Generation Error")
		return {
			"status": "error",
			"message": str(e)
		}


def generate_qr_code(data, size=10):
	"""
	Generate QR code image
	
	Args:
		data: Data to encode in QR code
		size: QR code size (box_size)
	
	Returns:
		dict: {
			"qr_image": base64_encoded_image,
			"qr_data": data
		}
	"""
	try:
		qr = qrcode.QRCode(version=1, box_size=size, border=5)
		qr.add_data(data)
		qr.make(fit=True)
		
		img = qr.make_image(fill_color="black", back_color="white")
		
		# Convert to base64
		buffer = BytesIO()
		img.save(buffer, format="PNG")
		img_str = base64.b64encode(buffer.getvalue()).decode()
		
		return {
			"status": "success",
			"qr_image": f"data:image/png;base64,{img_str}",
			"qr_data": data
		}
	except Exception as e:
		frappe.log_error(f"Error generating QR code: {str(e)}", "QR Code Generation Error")
		return {
			"status": "error",
			"message": str(e)
		}


def generate_sku_barcode(sku_code):
	"""
	Generate barcode for SKU
	
	Args:
		sku_code: SKU code
	
	Returns:
		dict: Barcode data with image
	"""
	return generate_barcode(sku_code, "CODE128")


def generate_piece_tag(piece_id, sku_code, additional_data=None):
	"""
	Generate QR code for piece-level tracking
	
	Args:
		piece_id: Unique piece ID
		sku_code: SKU code
		additional_data: Additional data to encode
	
	Returns:
		dict: QR code data with image
	"""
	# Prepare data for QR code
	data = {
		"piece_id": piece_id,
		"sku_code": sku_code
	}
	if additional_data:
		data.update(additional_data)
	
	# Convert to JSON string
	import json
	qr_data = json.dumps(data)
	
	return generate_qr_code(qr_data)


@frappe.whitelist()
def get_barcode_for_sku(sku_code):
	"""
	API endpoint to get barcode for SKU
	
	Args:
		sku_code: SKU code
	
	Returns:
		dict: Barcode image and data
	"""
	return generate_sku_barcode(sku_code)


@frappe.whitelist()
def get_qr_code_for_piece(piece_id, sku_code):
	"""
	API endpoint to get QR code for piece
	
	Args:
		piece_id: Piece ID
		sku_code: SKU code
	
	Returns:
		dict: QR code image and data
	"""
	return generate_piece_tag(piece_id, sku_code)
