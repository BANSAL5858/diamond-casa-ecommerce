# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class CADCAMSpec(Document):
	def validate(self):
		"""Validate CAD/CAM spec data"""
		if not self.spec_code:
			frappe.throw("Spec Code is required")
		
		if not self.design:
			frappe.throw("Design is required")
		
		# Calculate estimated total cost
		self.estimated_total_cost = (
			(self.estimated_metal_cost or 0) +
			(self.estimated_making_charge or 0) +
			(self.estimated_stone_cost or 0)
		)
