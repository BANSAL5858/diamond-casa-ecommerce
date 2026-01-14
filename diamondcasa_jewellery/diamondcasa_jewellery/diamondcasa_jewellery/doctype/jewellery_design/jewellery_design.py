# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class JewelleryDesign(Document):
	def validate(self):
		"""Validate design data"""
		if not self.design_code:
			frappe.throw("Design Code is required")
		
		# Set created/modified info
		if self.is_new():
			self.created_by = frappe.session.user
			self.created_on = frappe.utils.now()
		else:
			self.modified_by = frappe.session.user
			self.modified_on = frappe.utils.now()
	
	def on_update(self):
		"""Trigger sync to DiamondCasa if web_visible"""
		if self.is_web_visible:
			frappe.enqueue(
				"diamondcasa_jewellery.utils.sync.sync_design_to_diamondcasa",
				design_name=self.name,
				queue="default",
				timeout=300
			)
