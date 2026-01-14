# -*- coding: utf-8 -*-
"""
Pricing utilities for jewellery
Calculates final price based on metal cost, making charge, stone cost, and margin
"""

import frappe
from frappe import _


def calculate_metal_cost(gross_weight, metal_spec_name, current_rate=None):
	"""
	Calculate metal cost based on gross weight and metal spec
	
	Args:
		gross_weight: Gross weight in grams
		metal_spec_name: Name of Metal Spec
		current_rate: Optional current rate (if not provided, uses Metal Spec rate)
	
	Returns:
		dict: {
			"metal_cost": float,
			"fine_gold_equivalent": float,
			"rate_used": float
		}
	"""
	try:
		metal_spec = frappe.get_doc("Metal Spec", metal_spec_name)
		
		# Get current rate
		if current_rate is None:
			current_rate = metal_spec.current_rate_per_gram or 0
		
		# Calculate fine gold equivalent
		purity_percent = metal_spec.purity_percent or 0
		fine_gold_equivalent = (gross_weight * purity_percent) / 100
		
		# Calculate metal cost
		metal_cost = gross_weight * current_rate
		
		return {
			"metal_cost": metal_cost,
			"fine_gold_equivalent": fine_gold_equivalent,
			"rate_used": current_rate,
			"purity_percent": purity_percent
		}
	except Exception as e:
		frappe.log_error(f"Error calculating metal cost: {str(e)}", "Pricing Error")
		return {
			"metal_cost": 0,
			"fine_gold_equivalent": 0,
			"rate_used": 0,
			"purity_percent": 0
		}


def calculate_making_charge(making_charge_type, base_amount, making_charge_amount=None, making_charge_percent=None):
	"""
	Calculate making charge based on type
	
	Args:
		making_charge_type: "Fixed Amount", "Percentage of Metal Cost", or "Per Gram"
		base_amount: Base amount (metal cost for percentage, weight for per gram)
		making_charge_amount: Fixed amount (if type is "Fixed Amount")
		making_charge_percent: Percentage (if type is "Percentage of Metal Cost")
	
	Returns:
		float: Making charge amount
	"""
	if making_charge_type == "Fixed Amount":
		return making_charge_amount or 0
	elif making_charge_type == "Percentage of Metal Cost":
		if making_charge_percent:
			return (base_amount * making_charge_percent) / 100
		return 0
	elif making_charge_type == "Per Gram":
		# base_amount is weight in grams
		return (base_amount * (making_charge_amount or 0))
	else:
		return 0


def calculate_final_price(metal_cost, making_charge, stone_cost, margin_percent, channel_adjustment=0):
	"""
	Calculate final price with margin and channel adjustment
	
	Args:
		metal_cost: Metal cost
		making_charge: Making charge
		stone_cost: Stone cost
		margin_percent: Margin percentage
		channel_adjustment: Channel-specific margin adjustment percentage
	
	Returns:
		float: Final price
	"""
	# Base cost
	base_cost = (metal_cost or 0) + (making_charge or 0) + (stone_cost or 0)
	
	# Apply margin
	if margin_percent:
		final_margin = margin_percent + (channel_adjustment or 0)
		final_price = base_cost * (1 + final_margin / 100)
	else:
		final_price = base_cost
	
	return final_price


def apply_pricing_rule(sku_name, pricing_rule_name=None, channel="web"):
	"""
	Apply pricing rule to SKU and calculate final price
	
	Args:
		sku_name: Name of Jewellery SKU
		pricing_rule_name: Optional pricing rule name (if not provided, uses SKU's pricing rule)
		channel: "web" or "showroom"
	
	Returns:
		dict: Updated pricing information
	"""
	try:
		sku = frappe.get_doc("Jewellery SKU", sku_name)
		
		# Get pricing rule
		if pricing_rule_name:
			pricing_rule = frappe.get_doc("Pricing Rule", pricing_rule_name)
		elif sku.pricing_rule:
			pricing_rule = frappe.get_doc("Pricing Rule", sku.pricing_rule)
		else:
			# Use default pricing
			return {
				"status": "no_rule",
				"message": "No pricing rule assigned"
			}
		
		# Calculate metal cost
		if sku.metal_spec and sku.gross_weight:
			metal_data = calculate_metal_cost(sku.gross_weight, sku.metal_spec)
			metal_cost = metal_data["metal_cost"]
		else:
			metal_cost = sku.metal_cost or 0
		
		# Calculate making charge
		if pricing_rule.making_charge_type:
			making_charge = calculate_making_charge(
				pricing_rule.making_charge_type,
				metal_cost if pricing_rule.making_charge_type == "Percentage of Metal Cost" else sku.gross_weight or 0,
				pricing_rule.making_charge_amount,
				pricing_rule.making_charge_percent
			)
		else:
			making_charge = sku.making_charge or 0
		
		# Stone cost
		stone_cost = sku.stone_cost or 0
		if pricing_rule.stone_markup_percent:
			stone_cost = stone_cost * (1 + pricing_rule.stone_markup_percent / 100)
		
		# Channel adjustment
		channel_adjustment = 0
		if channel == "web" and pricing_rule.channel_web:
			channel_adjustment = pricing_rule.channel_web_margin_adjustment or 0
		elif channel == "showroom" and pricing_rule.channel_showroom:
			channel_adjustment = pricing_rule.channel_showroom_margin_adjustment or 0
		
		# Final margin
		margin_percent = pricing_rule.margin_percent or sku.margin_percent or 0
		
		# Calculate final price
		final_price = calculate_final_price(
			metal_cost,
			making_charge,
			stone_cost,
			margin_percent,
			channel_adjustment
		)
		
		# Update SKU
		sku.metal_cost = metal_cost
		sku.making_charge = making_charge
		sku.stone_cost = stone_cost
		sku.margin_percent = margin_percent
		sku.final_price = final_price
		sku.save(ignore_permissions=True)
		frappe.db.commit()
		
		return {
			"status": "success",
			"metal_cost": metal_cost,
			"making_charge": making_charge,
			"stone_cost": stone_cost,
			"margin_percent": margin_percent,
			"final_price": final_price,
			"channel": channel
		}
	except Exception as e:
		frappe.log_error(f"Error applying pricing rule to {sku_name}: {str(e)}", "Pricing Error")
		return {
			"status": "error",
			"message": str(e)
		}
