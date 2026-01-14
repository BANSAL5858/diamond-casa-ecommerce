# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class Bag(Document):
	def validate(self):
		"""Validate bag data"""
		if not self.bag_number:
			frappe.throw("Bag Number is required")
		
		# Update timeline on status change
		if not self.is_new() and self.has_value_changed("status"):
			self.add_status_to_timeline()
		
		# Update last updated info
		self.last_updated_by = frappe.session.user
		self.last_updated_on = frappe.utils.now()
	
	def add_status_to_timeline(self):
		"""Add current status to timeline"""
		if not self.status_timeline:
			self.status_timeline = []
		
		self.append("status_timeline", {
			"status": self.status,
			"changed_by": frappe.session.user,
			"changed_on": frappe.utils.now(),
			"notes": f"Status changed to {self.status}"
		})
	
	def on_update(self):
		"""Notify watchlist users on status change"""
		if self.has_value_changed("status") and self.watchlist_users:
			self.notify_watchlist_users()
	
	def notify_watchlist_users(self):
		"""Notify users in watchlist about status change"""
		# Implementation for notifications
		# Can use frappe.sendmail or create notification
		pass
