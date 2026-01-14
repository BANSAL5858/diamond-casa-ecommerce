# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document


class JobCardMaterial(Document):
	def validate(self):
		"""Calculate amount"""
		if self.qty and self.rate:
			self.amount = self.qty * self.rate
