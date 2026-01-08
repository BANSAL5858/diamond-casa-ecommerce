# ERPNext E-Commerce Integration Guide

## Overview

The Diamond Casa website is now fully integrated with ERPNext (Jewelry Edition) from https://github.com/BANSAL5858/ERPNext. This integration provides comprehensive e-commerce management functionality, connecting the customer-facing website with the backend ERP system.

## Integration Architecture

### Core Principle
- **ERPNext**: Single system of record for Inventory, Pricing, Accounting, and Operations
- **Website**: Sales channel and customer experience layer
- **Bidirectional Sync**: Real-time synchronization between systems

### Integration Direction
- **Masters & Controls**: ERPNext → Website (Items, SKUs, Variants, Price Lists, Stock, Taxes)
- **Transactions**: Website → ERPNext (Orders, Customers, Payments, Returns, Reviews)

## Implemented Features

### 1. Returns & Refunds Management ✅
- **Return Request Creation**: Customers can request returns through the website
- **ERPNext Integration**: Automatically creates Return Orders and Credit Notes in ERPNext
- **Stock Management**: Returns are tracked in RETURN warehouse
- **Refund Processing**: Credit notes generated for approved returns
- **Status Tracking**: Pending → Approved/Rejected → Completed workflow

**Usage:**
- Customer Portal → Returns Tab → Request Return
- Admin Dashboard → Returns & Refunds → Manage return requests

### 2. Order Tracking System ✅
- **Real-time Status**: Track orders from placement to delivery
- **ERPNext Sync**: Fetches order status from ERPNext Sales Orders
- **Delivery Notes**: Integration with ERPNext Delivery Notes
- **Shipment Tracking**: Track shipments using LR numbers and carriers
- **Customer Portal**: Customers can track their orders using order ID or tracking number

**Usage:**
- Customer Portal → Track Order Tab → Enter Order ID/Tracking Number
- Real-time status updates from ERPNext

### 3. Customer Order History ✅
- **Order List**: Complete order history for logged-in customers
- **ERPNext Sync**: Fetches orders from ERPNext Sales Orders
- **Order Details**: View order items, status, delivery dates
- **Return Actions**: Quick return request for delivered orders
- **My Account Portal**: Centralized customer account management

**Usage:**
- Customer Portal → My Orders Tab
- Automatic sync with ERPNext when integration is enabled

### 4. Product Reviews & Ratings ✅
- **Review Submission**: Customers can submit product reviews
- **ERPNext Sync**: Reviews synced to ERPNext (requires custom Product Review doctype)
- **Local Storage**: Fallback storage when ERPNext custom doctype not available
- **Approval Workflow**: Reviews can be approved/rejected in ERPNext

**API:**
```javascript
await window.ERPNextIntegration.syncProductReview({
    itemCode: 'ITEM-001',
    customerEmail: 'customer@example.com',
    rating: 5,
    review: 'Excellent product!'
});
```

### 5. Purchase Orders & Supplier Management ✅
- **Purchase Order Creation**: Create POs from admin dashboard
- **Supplier Management**: Manage supplier information
- **ERPNext Sync**: Full integration with ERPNext Purchase Orders
- **Supplier List**: View all suppliers with contact information
- **PO Tracking**: Track purchase order status and fulfillment

**Admin Features:**
- Purchase Orders page: View and manage all POs
- Suppliers page: Manage supplier database
- ERPNext sync for supplier and PO data

### 6. Advanced Inventory Management ✅
- **Stock Transfers**: Transfer stock between warehouses
- **Reorder Alerts**: Automatic alerts when stock falls below reorder level
- **Multi-Warehouse**: Support for READY, MTO/WIP, TRANSIT, RETURN warehouses
- **Inventory Valuation**: Calculate total inventory value by warehouse
- **Stock Entry**: Create stock entries for transfers and adjustments

**Features:**
- Stock Transfers page in admin dashboard
- Reorder level monitoring
- Warehouse-wise inventory tracking

### 7. Customer Portal ✅
- **My Account**: Centralized customer account management
- **Order Management**: View orders, track shipments, request returns
- **Profile Management**: Update customer information
- **Order History**: Complete order history with ERPNext sync
- **Return Requests**: Submit and track return requests

**Portal Sections:**
- My Orders: View all orders
- Track Order: Track by order ID or tracking number
- Returns: View and submit return requests
- Profile: Update personal information

### 8. Delivery Note & Shipment Tracking ✅
- **Delivery Notes**: Integration with ERPNext Delivery Notes
- **Shipment Tracking**: Track shipments using tracking numbers
- **Carrier Information**: Display carrier and tracking details
- **Status Updates**: Real-time delivery status from ERPNext

**API:**
```javascript
// Get delivery note
const deliveryNote = await window.ERPNextIntegration.getDeliveryNote('DN-001');

// Track shipment
const shipment = await window.ERPNextIntegration.getShipmentTracking('TRACK123');
```

### 9. Quotation & Proforma Invoice Support ✅
- **Quotation Creation**: Create quotations from website
- **ERPNext Sync**: Quotations synced to ERPNext
- **Quotation to Order**: Convert quotations to sales orders
- **Validity Management**: Automatic validity date calculation

**API:**
```javascript
await window.ERPNextIntegration.createQuotation({
    id: 'QUO-001',
    customer: { email: 'customer@example.com', name: 'Customer Name' },
    items: [{ erpnextItemCode: 'ITEM-001', quantity: 1, price: 50000 }]
});
```

### 10. Advanced Reporting & Analytics ✅
- **Sales Analytics**: Revenue, order count, average order value
- **Period-based Reports**: Week, month, quarter, year
- **Status Breakdown**: Orders by status
- **Date-wise Analysis**: Revenue trends by date
- **Inventory Valuation**: Total inventory value by warehouse

**API:**
```javascript
// Get sales analytics
const analytics = await window.ERPNextIntegration.getSalesAnalytics('month');

// Get inventory valuation
const valuation = await window.ERPNextIntegration.getInventoryValuation();
```

## Admin Dashboard Features

### New Admin Pages

1. **Purchase Orders**
   - View all purchase orders
   - Create new purchase orders
   - Track PO status
   - ERPNext integration

2. **Suppliers**
   - Manage supplier database
   - View supplier details
   - Edit supplier information
   - ERPNext sync

3. **Returns & Refunds**
   - View all return requests
   - Approve/reject returns
   - Process refunds
   - Status filtering

4. **Stock Transfers**
   - Create stock transfers
   - View transfer history
   - Track transfer status
   - Warehouse management

## Customer-Facing Features

### My Account Portal
- **My Orders**: Complete order history
- **Track Order**: Real-time order tracking
- **Returns**: Return request management
- **Profile**: Customer information management

### Order Tracking
- Track by Order ID
- Track by Tracking Number
- Real-time status updates
- Delivery date information
- Shipment details

### Returns Management
- Easy return request submission
- Item selection for returns
- Return reason selection
- Status tracking
- Automatic ERPNext sync

## ERPNext Configuration

### Required Setup in ERPNext

1. **Warehouses**
   - `READY - DC`: Ready to ship items
   - `MTO/WIP - DC`: Made-to-order items
   - `TRANSIT - DC`: Items in transit
   - `RETURN - DC`: Returned items

2. **Item Groups**
   - Rings, Earrings, Necklaces, Bracelets, Bangles, Pendants, Collections

3. **Custom Fields** (Item doctype)
   - `custom_metal_purity`: Metal purity (18K, 22K)
   - `custom_weight`: Product weight/carat
   - `custom_diamond_details`: Diamond specifications
   - `custom_lead_time`: Lead time in days
   - `custom_brand`: Brand name
   - `custom_metal_type`: Metal type
   - `custom_diamond_type`: Diamond type

4. **API User**
   - Create user: `integration@diamondcasa.in`
   - Generate API Key and Secret
   - Assign appropriate permissions

5. **Optional Custom Doctypes**
   - `Product Review`: For product reviews (optional)

## API Reference

### Returns & Refunds
```javascript
// Create return request
await window.ERPNextIntegration.createReturnRequest({
    returnId: 123,
    orderId: 456,
    customerName: 'Customer Name',
    customerEmail: 'customer@example.com',
    salesOrderName: 'SO-001',
    reason: 'Defective',
    items: [{ erpnextItemCode: 'ITEM-001', quantity: 1, price: 50000 }]
});
```

### Order Tracking
```javascript
// Get order status
const status = await window.ERPNextIntegration.getOrderStatus('SO-001');

// Get customer orders
const orders = await window.ERPNextIntegration.getCustomerOrders('customer@example.com');
```

### Purchase Orders
```javascript
// Create purchase order
await window.ERPNextIntegration.createPurchaseOrder({
    supplier: 'SUP-001',
    items: [{ itemCode: 'ITEM-001', quantity: 10, rate: 5000 }],
    scheduleDate: '2024-02-01'
});

// Get purchase orders
const pos = await window.ERPNextIntegration.getPurchaseOrders({ status: 'To Receive' });
```

### Suppliers
```javascript
// Get all suppliers
const suppliers = await window.ERPNextIntegration.getSuppliers();
```

### Stock Transfers
```javascript
// Transfer stock
await window.ERPNextIntegration.transferStock({
    fromWarehouse: 'READY - DC',
    toWarehouse: 'TRANSIT - DC',
    items: [{ itemCode: 'ITEM-001', quantity: 5 }]
});
```

### Inventory Management
```javascript
// Get reorder alerts
const alerts = await window.ERPNextIntegration.getReorderAlerts();

// Get inventory valuation
const valuation = await window.ERPNextIntegration.getInventoryValuation();
```

### Analytics
```javascript
// Get sales analytics
const analytics = await window.ERPNextIntegration.getSalesAnalytics('month');
// Returns: { totalRevenue, totalOrders, averageOrderValue, byStatus, byDate }
```

## Usage Instructions

### For Customers

1. **Access My Account**
   - Click on user icon in header
   - Login if not already logged in
   - Access "My Account" portal

2. **View Orders**
   - Go to "My Orders" tab
   - View complete order history
   - Click "View Details" for order information

3. **Track Order**
   - Go to "Track Order" tab
   - Enter Order ID or Tracking Number
   - View real-time status

4. **Request Return**
   - Go to "Returns" tab
   - Click "Request Return"
   - Select order and items
   - Submit return request

### For Administrators

1. **Configure ERPNext**
   - Go to Admin Dashboard → ERPNext Integration
   - Enter API URL, Key, and Secret
   - Enable integration
   - Test connection

2. **Manage Purchase Orders**
   - Go to Purchase Orders page
   - Create new POs
   - View and track existing POs

3. **Manage Suppliers**
   - Go to Suppliers page
   - Add/edit suppliers
   - View supplier information

4. **Process Returns**
   - Go to Returns & Refunds page
   - Review return requests
   - Approve/reject returns
   - Process refunds

5. **Stock Transfers**
   - Go to Stock Transfers page
   - Create new transfers
   - Track transfer status

## Integration Status

All e-commerce management functions are now integrated with ERPNext:

✅ Returns & Refunds  
✅ Order Tracking  
✅ Customer Order History  
✅ Product Reviews  
✅ Purchase Orders  
✅ Supplier Management  
✅ Stock Transfers  
✅ Inventory Management  
✅ Delivery Notes  
✅ Quotations  
✅ Analytics & Reporting  

## Next Steps

1. **Configure ERPNext Instance**
   - Set up warehouses
   - Create item groups
   - Add custom fields
   - Create API user

2. **Test Integration**
   - Test order creation
   - Test return requests
   - Test inventory sync
   - Verify all features

3. **Customize as Needed**
   - Add custom fields
   - Modify workflows
   - Adjust sync frequency
   - Configure webhooks

## Support

For issues or questions:
- Check ERPNext logs in Admin Dashboard
- Review integration logs
- Verify ERPNext configuration
- Test API connection

---

**Integration Version**: 1.0  
**Last Updated**: 2024  
**ERPNext Version**: Compatible with ERPNext Jewelry Edition
