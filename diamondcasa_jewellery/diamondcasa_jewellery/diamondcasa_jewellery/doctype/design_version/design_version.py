# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import now


class DesignVersion(Document):
	def validate(self):
		"""Validate design version"""
		self.set_version_code()
		self.validate_version_number()
		self.update_parent_version_link()
	
	def set_version_code(self):
		"""Set version code if not set"""
		if not self.version_code:
			design_code = frappe.db.get_value("Jewellery Design", self.design, "design_code") or "DES"
			self.version_code = f"{design_code}-{self.version_number}"
	
	def validate_version_number(self):
		"""Validate version number format"""
		if not self.version_number:
			frappe.throw("Version Number is required")
		
		# Check if version already exists for this design
		existing = frappe.db.get_value(
			"Design Version",
			{"design": self.design, "version_number": self.version_number, "name": ["!=", self.name]},
			"name"
		)
		if existing:
			frappe.throw(f"Version {self.version_number} already exists for this design")
	
	def update_parent_version_link(self):
		"""Update parent version's next_version link"""
		if self.parent_version and not self.is_new():
			old_doc = self.get_doc_before_save()
			if old_doc and old_doc.parent_version != self.parent_version:
				# Clear old parent's next_version
				if old_doc.parent_version:
					frappe.db.set_value("Design Version", old_doc.parent_version, "next_version", None)
				
				# Set new parent's next_version
				frappe.db.set_value("Design Version", self.parent_version, "next_version", self.name)
	
	def on_update(self):
		"""On update - log action"""
		from diamondcasa_jewellery.diamondcasa_jewellery.doctype.jewellery_action_log.jewellery_action_log import log_action
		
		log_action(
			doctype="Design Version",
			docname=self.name,
			action="updated",
			details=f"Design version {self.version_code} updated"
		)
		
		# Update parent version link
		if self.parent_version:
			frappe.db.set_value("Design Version", self.parent_version, "next_version", self.name)
	
	def approve(self):
		"""Approve design version"""
		if self.approval_status == "Approved":
			frappe.throw("Design version is already approved")
		
		self.approval_status = "Approved"
		self.approved_by = frappe.session.user
		self.approved_on = now()
		self.save()
		
		frappe.msgprint(f"Design version {self.version_code} approved")
	
	def reject(self, reason=None):
		"""Reject design version"""
		if self.approval_status == "Rejected":
			frappe.throw("Design version is already rejected")
		
		self.approval_status = "Rejected"
		self.save()
		
		frappe.msgprint(f"Design version {self.version_code} rejected")
	
	def get_version_lineage(self):
		"""Get all parent versions in lineage"""
		lineage = []
		current = self
		while current.parent_version:
			parent = frappe.get_doc("Design Version", current.parent_version)
			lineage.append(parent)
			current = parent
		return lineage
	
	def get_all_children(self):
		"""Get all child versions"""
		children = []
		current = self
		while current.next_version:
			child = frappe.get_doc("Design Version", current.next_version)
			children.append(child)
			current = child
		return children
