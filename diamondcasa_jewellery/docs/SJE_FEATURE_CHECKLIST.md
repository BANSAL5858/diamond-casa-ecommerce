# SJE Plus Feature Checklist - UAT Guide

**Version:** 1.0.0  
**Date:** 2024-12-19

Use this checklist for User Acceptance Testing (UAT) to verify all SJE Plus features are working correctly.

---

## Group 1: Core ERP

### Manufacturing Orders / Production Management
- [ ] Create Work Order from Sales Order
- [ ] Create BOM for jewellery item
- [ ] Track production stages
- [ ] Update job card status
- [ ] Material issue/receive
- [ ] Cost calculation

### Sales Management
- [ ] Create Quotation
- [ ] Convert Quotation to Sales Order
- [ ] Create Sales Invoice from Sales Order
- [ ] Apply discounts (with approval if needed)
- [ ] Track order status
- [ ] Generate delivery note

### Stock / Inventory Management
- [ ] Stock Entry (Material Receipt/Issue/Transfer)
- [ ] Stock reconciliation
- [ ] Warehouse-wise stock levels
- [ ] Stock valuation
- [ ] Reorder alerts

### Accounting Management
- [ ] Chart of accounts configured
- [ ] Journal entries
- [ ] Payment entries
- [ ] Multi-currency support
- [ ] GST compliance
- [ ] Financial reports

### Online Account Monitoring Dashboards
- [ ] Sales dashboard
- [ ] Inventory dashboard
- [ ] Production dashboard
- [ ] Financial dashboard
- [ ] Custom reports

### Role-based Limited Rights; Multi-user; Responsive UI
- [ ] Create roles (Jewellery Manager, Jewellery User, etc.)
- [ ] Assign permissions
- [ ] Test user access restrictions
- [ ] Verify responsive UI on mobile/tablet

---

## Group 2: Live Website Publishing

### Live Connect (Upload Clients Module)
- [ ] API endpoint accessible: `/api/diamondcasa/products`
- [ ] API endpoint accessible: `/api/diamondcasa/inventory`
- [ ] API endpoint accessible: `/api/diamondcasa/orders`
- [ ] Authentication working
- [ ] Error handling working

### Live Jewelry Showcase (Website/App Live Inventory)
- [ ] Product sync to DiamondCasa working
- [ ] Inventory sync working
- [ ] Real-time updates
- [ ] Sync status visible in Integration Log

### Online Catalogue (Upload Stock/Styles to E-commerce)
- [ ] Product sync with images
- [ ] Product sync with videos
- [ ] Media approval workflow
- [ ] Publish flags working

### Digital Showcase (Orders/Quotations for Selected Designs)
- [ ] Create quotation with design selection
- [ ] Design selection UI working
- [ ] Order creation from quotation

### Digital Hub (Digital Asset Management)
- [ ] Upload media files
- [ ] Media approval workflow
- [ ] Media publish flags
- [ ] Media linked to SKU/Design

---

## Group 3: Editions / Workflows

### MART: Barcode Labelling + SMS + In-store Workflows
- [ ] Generate barcode for SKU
- [ ] Generate QR code for SKU
- [ ] Print barcode labels
- [ ] SMS notifications working
- [ ] In-store order workflow

### TRADE: Production + Inventory + Inward/Outward
- [ ] Production workflow
- [ ] Inventory management
- [ ] Material inward
- [ ] Material outward

### CRAFTER: Manage Individual Crafters + Wastage Terms
- [ ] Create Craft Worker/Karigar profile
- [ ] Assign karigar to job card
- [ ] Track wastage by karigar
- [ ] Karigar performance reports

### PREMIUM: Multi-department Production + Tolerance/Loss/Recoveries
- [ ] Multi-stage production tracking
- [ ] Wastage tracking
- [ ] Scrap & Recovery DocType
- [ ] Fine gold recovery calculation
- [ ] Wastage variance reports

### SUPERIOR: In-house or Outsourced Manufacturing
- [ ] Job card with vendor assignment
- [ ] Subcontractor workflow
- [ ] Material issue to vendor
- [ ] Material receive from vendor

### ULTIMATE: Offshore/IMEX Processing + Multi-currency
- [ ] Multi-currency documents
- [ ] Currency conversion
- [ ] IMEX document tracking

---

## Group 4: Add-on Modules

### Notification (SMS/Email)
- [ ] Email notifications on transactions
- [ ] SMS notifications on transactions
- [ ] Email templates configured
- [ ] SMS templates configured

### CRM (Customer Feedback + Exec Feedback Analysis)
- [ ] Customer feedback capture
- [ ] Feedback analysis
- [ ] CRM workflows

### Scheduler (Scheduled Email Reports + Auto Backups)
- [ ] Scheduled email reports working
- [ ] Auto backup configured
- [ ] Scheduler jobs running

### SJE Click (Capture Mobile Photos into ERP)
- [ ] Mobile photo upload API
- [ ] Photo linked to item/SKU
- [ ] Image processing working

### SJE Genie (Voice/Chat Mobile Reporting)
- [ ] Voice command API
- [ ] Chat command API
- [ ] Command processing working

### Branches + SAML Model (Single Accounting Multiple Location)
- [ ] Multi-location setup
- [ ] Cost center per location
- [ ] Warehouse per location
- [ ] Centralized accounting

### Product Development (CAD/CAM Details + Estimated Breakup)
- [ ] CAD/CAM Spec DocType
- [ ] CAD file upload
- [ ] CAM file upload
- [ ] Estimated cost breakup

### Idea Evolution (Prototype + Version Logs)
- [ ] Design Version DocType
- [ ] Version history
- [ ] Prototype management

### Logistics (Parcel Tracking + Courier Reports)
- [ ] Delivery Note creation
- [ ] Tracking number entry
- [ ] Courier integration
- [ ] Tracking reports

### Tools Inventory (Consumables/Tools/Stationery)
- [ ] Tools item group
- [ ] Stock tracking for tools
- [ ] Tools issue/receive

### Tracking via RFID/Barcode
- [ ] Barcode generation
- [ ] QR code generation
- [ ] Barcode scanning
- [ ] RFID support (if applicable)

### IMEX Docs (Multi-currency)
- [ ] Multi-currency documents
- [ ] Currency conversion
- [ ] Exchange rate management

### Customize Integration (API Integration with Website/Mobile)
- [ ] REST API endpoints working
- [ ] Webhook receivers working
- [ ] Authentication working
- [ ] Error handling working

### Corporate Business Define (Protocol Integration with 3rd-party)
- [ ] Protocol-specific endpoints
- [ ] 3rd-party integration working

### Craft Tracker (Worker Work Lifecycle Management)
- [ ] Craft Worker profile
- [ ] Work assignment
- [ ] Work completion tracking
- [ ] Performance reports

### iJewelSlide Online/Offline (Order-taking via Digital Catalogue)
- [ ] Digital catalogue access
- [ ] Order creation from catalogue
- [ ] Tag scanning for order
- [ ] Offline mode support

---

## Group 5: Operational Features

### Multi-currency + Client-wise Rates
- [ ] Multi-currency enabled
- [ ] Client-wise pricing
- [ ] Currency conversion working

### Custom Print Formats
- [ ] Packing list format
- [ ] Bag label format
- [ ] Barcode tag format
- [ ] Certificate format
- [ ] Invoice designer

### Order Tracking System
- [ ] Order status tracking
- [ ] Delivery tracking
- [ ] Customer portal access

### Multiple Image Entry + STL Viewer
- [ ] Multiple image upload
- [ ] STL file upload
- [ ] STL viewer working
- [ ] 3D model preview

### Watchlist to Observe a Bag in Process
- [ ] Create watchlist
- [ ] Bag status monitoring
- [ ] Notifications on status change

### Bag Status at Each Transaction Level
- [ ] Bag DocType created
- [ ] Status timeline working
- [ ] Transaction-level status updates

### Role-based Security Across Floors/Departments
- [ ] Role creation
- [ ] Permission assignment
- [ ] Department-wise access
- [ ] Floor-wise access (if applicable)

### Custom Report Builder
- [ ] Report builder access
- [ ] Custom report creation
- [ ] Report export

### Transaction Logs/Audit per Action
- [ ] Integration Log working
- [ ] Action logs visible
- [ ] Audit trail complete

### Sales on EMI (Post-dated Cheque Tracking)
- [ ] EMI option in sales
- [ ] Post-dated cheque entry
- [ ] Cheque tracking
- [ ] Payment schedule

### Data Importer (Standard Formats)
- [ ] Excel import working
- [ ] CSV import working
- [ ] Data validation
- [ ] Import logs

### SMS/Email Notifications on Each Transaction
- [ ] Email on Sales Order
- [ ] Email on Invoice
- [ ] SMS on delivery
- [ ] Notification templates

### Materials Requisition + Pre-bagging for Order Processing
- [ ] Material Request creation
- [ ] Pre-bagging workflow
- [ ] Bag creation from Material Request
- [ ] Status tracking

### Dynamic Slideshow of Design Bank and Stock
- [ ] Design bank slideshow
- [ ] Stock slideshow
- [ ] Dynamic updates

### Approval Process
- [ ] Workflow creation
- [ ] Approval routing
- [ ] Approval notifications

### Detail Stock Valuation
- [ ] Stock valuation report
- [ ] Warehouse-wise valuation
- [ ] Item-wise valuation

### Auto Brokerage/Commission Calculator
- [ ] Commission calculation
- [ ] Broker management
- [ ] Commission reports
- [ ] Auto-calculation on invoice

### Digital Storage of Hand-written Documents
- [ ] Document upload
- [ ] Document storage
- [ ] Document retrieval

### WhatsApp API Integration
- [ ] WhatsApp message sending
- [ ] Quote sending via WhatsApp
- [ ] Invoice sending via WhatsApp
- [ ] Message templates

### Courier Integrations/Inward Courier Management
- [ ] Courier integration
- [ ] Inward courier tracking
- [ ] Courier reports

---

## Testing Instructions

### For Each Feature:
1. **Functional Test:** Verify feature works as expected
2. **Permission Test:** Verify role-based access
3. **Error Test:** Verify error handling
4. **Integration Test:** Verify integration with other features
5. **Performance Test:** Verify performance (if applicable)

### Test Data Requirements:
- Test items/SKUs
- Test customers
- Test suppliers/karigars
- Test warehouses
- Test orders

---

## Sign-off

**Tester Name:** _________________  
**Date:** _________________  
**Status:** ☐ Pass  ☐ Fail  ☐ Partial  
**Notes:** _________________

---

**End of Feature Checklist**
