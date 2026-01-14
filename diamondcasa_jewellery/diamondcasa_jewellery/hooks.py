# -*- coding: utf-8 -*-
from . import __version__ as app_version

app_name = "diamondcasa_jewellery"
app_title = "Diamond Casa Jewellery"
app_publisher = "Diamond Casa"
app_description = "Custom Frappe app for Diamond Casa Jewellery ERP with DiamondCasa.com integration"
app_icon = "octicon octicon-gem"
app_color = "gold"
app_email = "dev@diamondcasa.in"
app_license = "Proprietary"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/diamondcasa_jewellery/css/diamondcasa_jewellery.css"
# app_include_js = "/assets/diamondcasa_jewellery/js/diamondcasa_jewellery.js"

# include js, css files in header of web template
# web_include_css = "/assets/diamondcasa_jewellery/css/diamondcasa_jewellery.css"
# web_include_js = "/assets/diamondcasa_jewellery/js/diamondcasa_jewellery.js"

# include custom scss in every website page (only if app is installed)
# website_route_rules = [
# 	{"from_route": "/custom", "to_route": "custom"},
# ]

# Jinja2 functions
# ----------------

# jinja = {
# 	"methods": "diamondcasa_jewellery.utils.jinja",
# 	"filters": "diamondcasa_jewellery.utils.jinja"
# }

# Installation
# ------------

# before_install = "diamondcasa_jewellery.install.before_install"
# after_install = "diamondcasa_jewellery.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "diamondcasa_jewellery.uninstall.before_uninstall"
# after_uninstall = "diamondcasa_jewellery.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "diamondcasa_jewellery.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Item": {
		"on_update": "diamondcasa_jewellery.utils.sync.on_item_update",
		"validate": "diamondcasa_jewellery.utils.sync.validate_item",
	},
	"Sales Order": {
		"on_submit": "diamondcasa_jewellery.utils.sync.on_sales_order_submit",
		"on_cancel": "diamondcasa_jewellery.utils.sync.on_sales_order_cancel",
	},
	"Stock Entry": {
		"on_submit": "diamondcasa_jewellery.utils.sync.on_stock_entry_submit",
	},
	"Sales Invoice": {
		"on_submit": "diamondcasa_jewellery.utils.sync.on_sales_invoice_submit",
	},
	"Material Request": {
		"on_submit": "diamondcasa_jewellery.utils.prebagging.on_material_request_submit",
		"on_update": "diamondcasa_jewellery.utils.prebagging.on_material_request_update",
	},
}

# Scheduled Tasks
# ---------------

scheduler_events = {
	"cron": {
		"*/15 * * * *": [
			"diamondcasa_jewellery.utils.sync.sync_products_to_diamondcasa",
			"diamondcasa_jewellery.utils.sync.sync_inventory_to_diamondcasa_scheduled",
			"diamondcasa_jewellery.utils.sync.sync_prices_to_diamondcasa_scheduled",
		]
	},
	"hourly": [
		"diamondcasa_jewellery.utils.sync.sync_media_to_diamondcasa_scheduled",
	],
	"daily": [
		"diamondcasa_jewellery.utils.sync.cleanup_old_integration_logs",
	],
}

# Testing
# -------

# before_tests = "diamondcasa_jewellery.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "diamondcasa_jewellery.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "diamondcasa_jewellery.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["diamondcasa_jewellery.utils.before_request"]
# after_request = ["diamondcasa_jewellery.utils.after_request"]

# Job Events
# ----------
# before_job = ["diamondcasa_jewellery.utils.before_job"]
# after_job = ["diamondcasa_jewellery.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"diamondcasa_jewellery.auth.validate"
# ]
