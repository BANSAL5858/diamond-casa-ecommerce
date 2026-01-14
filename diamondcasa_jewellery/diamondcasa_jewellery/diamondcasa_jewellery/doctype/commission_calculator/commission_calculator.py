# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import now, flt


class CommissionCalculator(Document):
	def validate(self):
		"""Validate commission calculation"""
		self.set_calculation_code()
		self.fetch_party_name()
		self.calculate_commission()
	
	def set_calculation_code(self):
		"""Set calculation code if not set"""
		if not self.calculation_code:
			from frappe.utils import now_datetime
			timestamp = now_datetime().strftime("%Y%m%d%H%M%S")
			base_code = f"CC{timestamp}"
			
			counter = 1
			calc_code = base_code
			while frappe.db.exists("Commission Calculator", calc_code):
				calc_code = f"{base_code}{counter:03d}"
				counter += 1
			
			self.calculation_code = calc_code
	
	def fetch_party_name(self):
		"""Fetch party name"""
		if self.party and self.party_type:
			if self.party_type == "Customer":
				self.party_name = frappe.db.get_value("Customer", self.party, "customer_name")
			elif self.party_type == "Supplier":
				self.party_name = frappe.db.get_value("Supplier", self.party, "supplier_name")
			elif self.party_type == "Employee":
				self.party_name = frappe.db.get_value("Employee", self.party, "employee_name")
			else:
				self.party_name = self.party
	
	def calculate_commission(self):
		"""Calculate commission based on type"""
		if not self.base_amount:
			self.total_commission = 0
			self.net_commission = 0
			return
		
		base = flt(self.base_amount)
		commission = 0
		
		if self.commission_type == "Percentage":
			rate = flt(self.commission_rate or 0)
			commission = base * (rate / 100)
		
		elif self.commission_type == "Fixed Amount":
			commission = flt(self.commission_amount or 0)
		
		elif self.commission_type == "Tier Based" and self.tier_based:
			commission = self.calculate_tier_based_commission(base)
		
		# Apply adjustments
		adjustment = flt(self.adjustment_amount or 0)
		self.total_commission = commission + adjustment
		
		# Calculate tax
		if self.tax_applicable:
			tax_rate = flt(self.tax_rate or 0)
			self.tax_amount = self.total_commission * (tax_rate / 100)
		else:
			self.tax_amount = 0
		
		# Net commission
		self.net_commission = self.total_commission - self.tax_amount
	
	def calculate_tier_based_commission(self, base_amount):
		"""Calculate commission based on tiers"""
		if not self.commission_tiers:
			return 0
		
		# Sort tiers by min_amount
		tiers = sorted(self.commission_tiers, key=lambda x: flt(x.min_amount or 0))
		
		commission = 0
		remaining = base_amount
		
		for tier in tiers:
			min_amt = flt(tier.min_amount or 0)
			max_amt = flt(tier.max_amount or 0) if tier.max_amount else float('inf')
			rate = flt(tier.commission_rate or 0)
			
			if remaining <= 0:
				break
			
			if base_amount >= min_amt:
				tier_amount = min(remaining, max_amt - min_amt) if max_amt != float('inf') else remaining
				if tier_amount > 0:
					if tier.commission_type == "Percentage":
						commission += tier_amount * (rate / 100)
					else:
						commission += rate
					remaining -= tier_amount
		
		return commission
	
	def on_update(self):
		"""On update - log action"""
		from diamondcasa_jewellery.diamondcasa_jewellery.doctype.jewellery_action_log.jewellery_action_log import log_action
		
		log_action(
			doctype="Commission Calculator",
			docname=self.name,
			action="updated",
			details=f"Commission calculation {self.calculation_code} updated - Net: {self.net_commission}"
		)
	
	def mark_as_paid(self, paid_amount=None, paid_date=None):
		"""Mark commission as paid"""
		if self.payment_status == "Paid":
			frappe.throw("Commission is already marked as paid")
		
		self.paid_amount = flt(paid_amount) or self.net_commission
		self.paid_date = paid_date or now()
		
		if self.paid_amount >= self.net_commission:
			self.payment_status = "Paid"
		elif self.paid_amount > 0:
			self.payment_status = "Partially Paid"
		else:
			self.payment_status = "Pending"
		
		self.save()
		frappe.msgprint(f"Commission {self.calculation_code} marked as {self.payment_status.lower()}")
