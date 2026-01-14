# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe
from diamondcasa_jewellery.utils.barcode import generate_piece_tag, generate_sku_barcode


class JewelleryPiece(Document):
	def validate(self):
		"""Validate piece data"""
		if not self.piece_id:
			frappe.throw("Piece ID is required")
		
		if not self.sku:
			frappe.throw("SKU is required")
		
		# Get SKU details
		sku_doc = frappe.get_doc("Jewellery SKU", self.sku)
		self.item_code = sku_doc.item_code
		
		# Calculate fine gold equivalent
		if self.gross_weight and sku_doc.metal_spec:
			metal_spec = frappe.get_doc("Metal Spec", sku_doc.metal_spec)
			if metal_spec.purity_percent:
				self.fine_gold_equivalent = (self.gross_weight * metal_spec.purity_percent) / 100
		
		# Generate barcode/QR if not exists
		if not self.barcode:
			self.generate_barcode()
		if not self.qr_code:
			self.generate_qr_code()
	
	def generate_barcode(self):
		"""Generate barcode for piece"""
		try:
			result = generate_sku_barcode(self.piece_id)
			if result.get("status") == "success":
				# Save barcode image (implementation depends on file storage)
				# For now, store the data URL or file path
				pass
		except Exception as e:
			frappe.log_error(f"Error generating barcode for piece {self.piece_id}: {str(e)}", "Barcode Generation Error")
	
	def generate_qr_code(self):
		"""Generate QR code for piece"""
		try:
			result = generate_piece_tag(self.piece_id, self.sku, {
				"gross_weight": self.gross_weight,
				"manufacturing_date": str(self.manufacturing_date) if self.manufacturing_date else None
			})
			if result.get("status") == "success":
				# Save QR code image (implementation depends on file storage)
				pass
		except Exception as e:
			frappe.log_error(f"Error generating QR code for piece {self.piece_id}: {str(e)}", "QR Code Generation Error")
