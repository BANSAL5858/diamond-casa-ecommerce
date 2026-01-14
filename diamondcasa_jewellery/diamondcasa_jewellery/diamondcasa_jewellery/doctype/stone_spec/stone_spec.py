# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class StoneSpec(Document):
	def validate(self):
		"""Validate stone specification"""
		if not self.stone_code:
			frappe.throw("Stone Code is required")
		
		# Validate carat range
		if self.carat_range_min and self.carat_range_max:
			if self.carat_range_min > self.carat_range_max:
				frappe.throw("Min carat must be less than or equal to max carat")
			if self.carat_range_min < 0:
				frappe.throw("Carat range cannot be negative")
