# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class JobCard(Document):
	def validate(self):
		"""Validate job card data"""
		if not self.job_card_no:
			frappe.throw("Job Card No is required")
		
		# Validate QC before completion
		if self.status == "Completed" and not self.qc_approved:
			frappe.throw("QC approval is required before completing job card")
		
		# Calculate total cost
		self.calculate_total_cost()
	
	def calculate_total_cost(self):
		"""Calculate total cost"""
		self.total_cost = (
			(self.material_cost or 0) +
			(self.labor_cost or 0) +
			(self.wastage_cost or 0)
		)
	
	def on_submit(self):
		"""Validate before submit"""
		if not self.qc_approved:
			frappe.throw("QC approval is required before submitting job card")
