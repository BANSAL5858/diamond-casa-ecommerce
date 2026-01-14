# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class Certification(Document):
	def validate(self):
		"""Validate certification data"""
		if not self.certificate_number:
			frappe.throw("Certificate Number is required")
		
		# Validate certificate type
		if self.certificate_type not in ["GIA", "IGI", "AGS", "HRD", "Other"]:
			frappe.throw("Invalid certificate type")
