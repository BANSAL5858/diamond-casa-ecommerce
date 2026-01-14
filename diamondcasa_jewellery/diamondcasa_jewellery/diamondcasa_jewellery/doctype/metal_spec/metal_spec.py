# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class MetalSpec(Document):
	def validate(self):
		"""Validate metal specification"""
		if not self.metal_code:
			frappe.throw("Metal Code is required")
		
		# Validate purity percent
		if self.purity_percent and (self.purity_percent < 0 or self.purity_percent > 100):
			frappe.throw("Purity % must be between 0 and 100")
		
		# Validate wastage percent
		if self.wastage_percent and (self.wastage_percent < 0 or self.wastage_percent > 100):
			frappe.throw("Wastage % must be between 0 and 100")
	
	def on_update(self):
		"""Update rate last updated timestamp"""
		if self.current_rate_per_gram:
			self.rate_last_updated = frappe.utils.now()
