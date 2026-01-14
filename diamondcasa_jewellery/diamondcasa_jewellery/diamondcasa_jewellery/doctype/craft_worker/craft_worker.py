# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe


class CraftWorker(Document):
	def validate(self):
		"""Validate craft worker data"""
		if not self.worker_code:
			frappe.throw("Worker Code is required")
		
		if not self.worker_name:
			frappe.throw("Worker Name is required")
		
		# Calculate performance metrics
		self.calculate_performance_metrics()
	
	def calculate_performance_metrics(self):
		"""Calculate performance metrics from job cards"""
		# Get all job cards assigned to this worker
		job_cards = frappe.db.get_all("Job Card",
			filters={
				"docstatus": 1,
				"status": ["in", ["Completed", "In Progress"]]
			},
			fields=["name", "casting_vendor", "setting_vendor", "polishing_vendor", "hallmarking_vendor",
				"casting_wastage", "setting_wastage", "polishing_wastage",
				"casting_completion_date", "casting_start_date",
				"setting_completion_date", "setting_start_date",
				"polishing_completion_date", "polishing_start_date",
				"hallmarking_completion_date", "hallmarking_start_date"]
		)
		
		# Filter job cards where this worker is assigned
		worker_jobs = []
		for jc in job_cards:
			jc_doc = frappe.get_doc("Job Card", jc.name)
			if (jc_doc.casting_vendor == self.supplier or
				jc_doc.setting_vendor == self.supplier or
				jc_doc.polishing_vendor == self.supplier or
				jc_doc.hallmarking_vendor == self.supplier):
				worker_jobs.append(jc_doc)
		
		# Calculate metrics
		self.total_jobs_completed = len([j for j in worker_jobs if j.status == "Completed"])
		
		# Calculate average wastage
		wastage_values = []
		for jc in worker_jobs:
			if jc.casting_vendor == self.supplier and jc.casting_wastage:
				wastage_values.append(jc.casting_wastage)
			if jc.setting_vendor == self.supplier and jc.setting_wastage:
				wastage_values.append(jc.setting_wastage)
			if jc.polishing_vendor == self.supplier and jc.polishing_wastage:
				wastage_values.append(jc.polishing_wastage)
		
		if wastage_values:
			self.average_wastage_percent = sum(wastage_values) / len(wastage_values)
		else:
			self.average_wastage_percent = 0
