# -*- coding: utf-8 -*-
# Copyright (c) 2024, Diamond Casa and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import os
from frappe.utils import now, get_datetime


class MediaAsset(Document):
	def validate(self):
		"""Validate media asset"""
		self.set_file_metadata()
		self.validate_approval_status()
		self.set_web_approval()
	
	def before_save(self):
		"""Before save operations"""
		if not self.asset_code:
			self.asset_code = self.generate_asset_code()
	
	def set_file_metadata(self):
		"""Set file metadata from attachment"""
		if self.file_attachment:
			file_doc = frappe.get_doc("File", {"file_url": self.file_attachment})
			if file_doc:
				self.file_url = file_doc.file_url
				self.file_type = file_doc.file_type or self.get_file_type_from_name(file_doc.file_name)
				self.file_size = file_doc.file_size or 0
				
				# Auto-set asset type based on file type
				if not self.asset_type or self.asset_type == "Image":
					self.asset_type = self.infer_asset_type(file_doc.file_name)
	
	def get_file_type_from_name(self, filename):
		"""Get file type from filename extension"""
		if not filename:
			return ""
		ext = os.path.splitext(filename)[1].lower()
		return ext[1:] if ext else ""
	
	def infer_asset_type(self, filename):
		"""Infer asset type from filename"""
		if not filename:
			return "Image"
		
		ext = os.path.splitext(filename)[1].lower()
		image_exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
		video_exts = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
		model_exts = ['.stl', '.obj', '.fbx', '.dae', '.3ds']
		doc_exts = ['.pdf', '.doc', '.docx', '.txt']
		
		if ext in image_exts:
			return "Image"
		elif ext in video_exts:
			return "Video"
		elif ext in model_exts:
			return "3D Model"
		elif ext in doc_exts:
			return "Document"
		else:
			return "Image"  # Default
	
	def validate_approval_status(self):
		"""Validate approval status changes"""
		if self.is_new():
			return
		
		old_doc = self.get_doc_before_save()
		if old_doc and old_doc.approval_status != self.approval_status:
			if self.approval_status == "Approved":
				self.approved_by = frappe.session.user
				self.approved_on = now()
				self.is_web_approved = 1
			elif self.approval_status == "Rejected":
				self.is_web_approved = 0
			else:
				self.is_web_approved = 0
	
	def set_web_approval(self):
		"""Set web approval based on approval status"""
		if self.approval_status == "Approved" and self.is_web_visible:
			self.is_web_approved = 1
		else:
			self.is_web_approved = 0
	
	def generate_asset_code(self):
		"""Generate unique asset code"""
		from frappe.utils import now_datetime
		timestamp = now_datetime().strftime("%Y%m%d%H%M%S")
		base_code = f"MA{timestamp}"
		
		# Ensure uniqueness
		counter = 1
		asset_code = base_code
		while frappe.db.exists("Media Asset", asset_code):
			asset_code = f"{base_code}{counter:03d}"
			counter += 1
		
		return asset_code
	
	def on_update(self):
		"""On update - log action and sync if web approved"""
		from diamondcasa_jewellery.diamondcasa_jewellery.doctype.jewellery_action_log.jewellery_action_log import log_action
		
		log_action(
			doctype="Media Asset",
			docname=self.name,
			action="updated",
			details=f"Media asset {self.asset_code} updated"
		)
		
		# Sync to DiamondCasa if web approved
		if self.is_web_approved and self.is_web_visible:
			frappe.enqueue(
				"diamondcasa_jewellery.diamondcasa_jewellery.utils.sync.sync_media_to_diamondcasa",
				queue="default",
				timeout=300
			)
	
	def approve(self):
		"""Approve media asset"""
		if self.approval_status == "Approved":
			frappe.throw("Media asset is already approved")
		
		self.approval_status = "Approved"
		self.approved_by = frappe.session.user
		self.approved_on = now()
		self.is_web_approved = 1 if self.is_web_visible else 0
		self.save()
		
		frappe.msgprint(f"Media asset {self.asset_code} approved")
	
	def reject(self, reason=None):
		"""Reject media asset"""
		if self.approval_status == "Rejected":
			frappe.throw("Media asset is already rejected")
		
		self.approval_status = "Rejected"
		self.rejection_reason = reason or "Not specified"
		self.is_web_approved = 0
		self.save()
		
		frappe.msgprint(f"Media asset {self.asset_code} rejected")
