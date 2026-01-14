# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe
from diamondcasa_jewellery.utils.costing import calculate_fine_gold_recovery


class ScrapRecovery(Document):
	def validate(self):
		"""Validate scrap recovery data"""
		if not self.scrap_recovery_no:
			frappe.throw("Scrap Recovery No is required")
		
		if not self.scrap_weight or self.scrap_weight <= 0:
			frappe.throw("Scrap Weight must be greater than 0")
		
		if not self.purity_percent:
			frappe.throw("Purity % is required")
		
		# Calculate fine gold recovered
		self.fine_gold_recovered = calculate_fine_gold_recovery(
			self.scrap_weight,
			self.purity_percent
		)
		
		# Calculate variance
		if self.expected_recovery and self.actual_recovery:
			self.variance = self.actual_recovery - self.expected_recovery
		
		# Calculate net recovery value
		if self.scrap_value and self.recovery_value:
			self.net_recovery_value = self.recovery_value - self.scrap_value
	
	def on_submit(self):
		"""Validate before submit"""
		if not self.is_approved:
			frappe.throw("Scrap Recovery must be approved before submission")
		
		# Set approved info
		self.approved_by = frappe.session.user
		self.approved_on = frappe.utils.now()
