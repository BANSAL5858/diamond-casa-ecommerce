// Copyright (c) 2024, Diamond Casa and contributors
// For license information, please see license.txt

frappe.ui.form.on('Jewellery Design', {
	refresh: function(frm) {
		// Add custom buttons
		if (frm.doc.design_code) {
			frm.add_custom_button(__('Create SKU'), function() {
				frappe.model.open_mapped_doc({
					method: "diamondcasa_jewellery.utils.sku.create_sku_from_design",
					frm: frm
				});
			}, __('Actions'));
		}
	},
	
	design_code: function(frm) {
		// Auto-generate design code if not provided
		if (!frm.doc.design_code && frm.doc.design_name) {
			// Generate code from name
			let code = frm.doc.design_name.toUpperCase().replace(/\s+/g, '-').substring(0, 20);
			frm.set_value('design_code', code);
		}
	}
});
