# -*- coding: utf-8 -*-
"""
Costing utilities for manufacturing/job work
Calculates costs for job cards including material, labor, and wastage
"""

import frappe
from frappe import _


def calculate_job_card_cost(job_card_name):
	"""
	Calculate total cost for a job card
	
	Args:
		job_card_name: Name of Job Card
	
	Returns:
		dict: Cost breakdown
	"""
	try:
		job_card = frappe.get_doc("Job Card", job_card_name)
		
		# Material cost from materials table
		material_cost = 0
		if job_card.materials_table:
			for material in job_card.materials_table:
				material_cost += (material.rate or 0) * (material.qty or 0)
		
		# Labor cost (sum of stage costs if tracked)
		labor_cost = 0
		# Can be calculated from stage-wise labor charges if added
		
		# Wastage cost
		wastage_cost = 0
		# Calculate based on wastage percentages and metal rates
		
		# Total cost
		total_cost = material_cost + labor_cost + wastage_cost
		
		# Update job card
		job_card.material_cost = material_cost
		job_card.labor_cost = labor_cost
		job_card.wastage_cost = wastage_cost
		job_card.total_cost = total_cost
		job_card.save(ignore_permissions=True)
		frappe.db.commit()
		
		return {
			"status": "success",
			"material_cost": material_cost,
			"labor_cost": labor_cost,
			"wastage_cost": wastage_cost,
			"total_cost": total_cost
		}
	except Exception as e:
		frappe.log_error(f"Error calculating job card cost: {str(e)}", "Costing Error")
		return {
			"status": "error",
			"message": str(e)
		}


def calculate_wastage(gross_weight, wastage_percent, metal_rate_per_gram):
	"""
	Calculate wastage cost
	
	Args:
		gross_weight: Gross weight in grams
		wastage_percent: Wastage percentage
		metal_rate_per_gram: Metal rate per gram
	
	Returns:
		float: Wastage cost
	"""
	wastage_weight = (gross_weight * wastage_percent) / 100
	wastage_cost = wastage_weight * metal_rate_per_gram
	return wastage_cost


def calculate_fine_gold_recovery(scrap_weight, purity_percent):
	"""
	Calculate fine gold recovery from scrap
	
	Args:
		scrap_weight: Scrap weight in grams
		purity_percent: Purity percentage
	
	Returns:
		float: Fine gold equivalent recovered
	"""
	fine_gold_recovered = (scrap_weight * purity_percent) / 100
	return fine_gold_recovered
