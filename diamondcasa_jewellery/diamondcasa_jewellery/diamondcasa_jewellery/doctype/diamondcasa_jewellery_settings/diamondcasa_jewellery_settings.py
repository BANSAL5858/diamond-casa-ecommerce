# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class DiamondCasaJewellerySettings(Document):
	def validate(self):
		"""Validate settings"""
		# Sync settings to site config
		if self.diamondcasa_api_url:
			frappe.conf.diamondcasa_api_url = self.diamondcasa_api_url
		if self.diamondcasa_api_key:
			frappe.conf.diamondcasa_api_key = self.diamondcasa_api_key
		if self.diamondcasa_api_secret:
			frappe.conf.diamondcasa_api_secret = self.diamondcasa_api_secret
		if self.diamondcasa_webhook_secret:
			frappe.conf.diamondcasa_webhook_secret = self.diamondcasa_webhook_secret
		if self.diamondcasa_sync_enabled is not None:
			frappe.conf.diamondcasa_sync_enabled = self.diamondcasa_sync_enabled
		if self.diamondcasa_sync_interval:
			frappe.conf.diamondcasa_sync_interval = self.diamondcasa_sync_interval
