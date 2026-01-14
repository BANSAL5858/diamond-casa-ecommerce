# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class PricingRule(Document):
	def validate(self):
		"""Validate pricing rule"""
		if not self.pricing_rule_name:
			frappe.throw("Pricing Rule Name is required")
		
		# Validate date range
		if self.valid_from and self.valid_until:
			if self.valid_from > self.valid_until:
				frappe.throw("Valid From date must be before Valid Until date")
