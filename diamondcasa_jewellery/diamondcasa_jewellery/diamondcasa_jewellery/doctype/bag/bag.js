// Copyright (c) 2024, Diamond Casa and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bag', {
	refresh: function(frm) {
		// Add custom buttons
		if (frm.doc.sales_order) {
			frm.add_custom_button(__('View Sales Order'), function() {
				frappe.set_route('Form', 'Sales Order', frm.doc.sales_order);
			}, __('Links'));
		}
		
		// Add watchlist button
		frm.add_custom_button(__('Add to Watchlist'), function() {
			frappe.prompt({
				fieldname: 'user',
				label: __('User'),
				fieldtype: 'Link',
				options: 'User',
				reqd: 1
			}, function(data) {
				frm.add_child('watchlist_users', {
					user: data.user
				});
				frm.refresh_field('watchlist_users');
			});
		}, __('Actions'));
	},
	
	status: function(frm) {
		// Update current stage based on status
		if (frm.doc.status) {
			// Map status to stage
			const statusToStage = {
				'Material Requisition': 'Material Stage',
				'Pre-bagged': 'Pre-bagging Stage',
				'In Production': 'Production Stage',
				'QC Pending': 'QC Stage',
				'QC Approved': 'QC Stage',
				'Ready for Delivery': 'Delivery Stage',
				'Delivered': 'Completed'
			};
			frm.set_value('current_stage', statusToStage[frm.doc.status] || frm.doc.status);
		}
	}
});
