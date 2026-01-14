# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class JewellerySKU(Document):
	def validate(self):
		"""Validate SKU data"""
		if not self.sku_code:
			frappe.throw("SKU Code is required")
		
		if not self.item_code:
			frappe.throw("Item Code is required")
		
		# Calculate fine gold equivalent
		if self.gross_weight and self.metal_spec:
			metal_spec = frappe.get_doc("Metal Spec", self.metal_spec)
			if metal_spec.purity_percent:
				self.fine_gold_equivalent = (self.gross_weight * metal_spec.purity_percent) / 100
		
		# Calculate final price
		self.calculate_final_price()
	
	def calculate_final_price(self):
		"""Calculate final price based on metal cost, making charge, stone cost, and margin"""
		base_cost = 0
		
		if self.metal_cost:
			base_cost += self.metal_cost
		if self.making_charge:
			base_cost += self.making_charge
		if self.stone_cost:
			base_cost += self.stone_cost
		
		if self.margin_percent:
			self.final_price = base_cost * (1 + self.margin_percent / 100)
		else:
			self.final_price = base_cost
	
	def on_update(self):
		"""Trigger sync to DiamondCasa if web_visible and approved"""
		if self.is_web_visible and self.is_web_approved:
			frappe.enqueue(
				"diamondcasa_jewellery.utils.sync.sync_sku_to_diamondcasa",
				sku_name=self.name,
				queue="default",
				timeout=300
			)
			self.sync_status = "Pending"
			self.last_synced = frappe.utils.now()
