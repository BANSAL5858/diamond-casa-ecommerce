# ERPNext Integration Guide for Diamond Casa

## Overview

This integration connects Diamond Casa website with ERPNext (https://github.com/frappe/erpnext) to create a unified business management system. ERPNext acts as the single system of record for Inventory, Pricing, and Accounting, while the website functions as the sales channel and customer experience layer.

## Architecture

### Core Principle
- **ERPNext**: Single system of record for Inventory, Pricing, and Accounting
- **Diamond Casa Website**: Sales channel and customer experience layer

### Integration Direction
- **Masters & Controls**: ERPNext → Website (Items, SKUs, Variants, Price Lists, Stock, Taxes)
- **Transactions**: Website → ERPNext (Orders, Customers, Payments, Returns)

## MVP Scope

### ✅ Implemented Features

1. **Order Sync**: Customer, Address, Sales Order
2. **Stock Sync**: Available quantity per SKU, MTO handling
3. **Invoice & Payment Sync**: Sales Invoice and Payment Entry
4. **Product Sync**: Items, SKUs, Variants, Price Lists
5. **Inventory Sync**: Stock levels from multiple warehouses

## Module-Wise Integration

### Product Masters
- **Item Code = SKU**: Enforced immutable SKUs
- **Jewelry-specific fields**: Metal purity, weight, diamond details, lead time
- **Custom Fields**: 
  - `custom_metal_purity`: Metal purity (e.g., 18K, 22K)
  - `custom_weight`: Product weight/carat
  - `custom_diamond_details`: Diamond specifications
  - `custom_lead_time`: Lead time in days (0 = Ready to Ship)
  - `custom_brand`: Brand name
  - `custom_metal_type`: Metal type (gold, platinum, etc.)
  - `custom_diamond_type`: Diamond type (solitaire, halo, etc.)

### Inventory & Warehouses
- **READY Warehouse**: Ready to ship items
- **MTO/WIP Warehouse**: Made-to-order items
- **TRANSIT Warehouse**: Items in transit
- **RETURN Warehouse**: Returned items
- Website validates stock from ERPNext before allowing purchases

### Orders
- Website creates Sales Orders in ERPNext
- Proper tax templates (GST - India)
- Order series management
- Custom fields:
  - `custom_website_order_id`: Website order ID
  - `custom_payment_method`: Payment method used

### Accounting
- ERPNext handles GST, invoicing, payment entries, and refunds
- Single book of accounts
- Automatic GST invoice generation

### Pricing
- Price lists maintained only in ERPNext
- Website consumes prices from ERPNext
- Supports multiple price lists (Standard Selling, etc.)

### Shipping
- ERPNext remains the truth for shipment and delivery status
- Delivery dates calculated based on item lead times

### Returns
- Website initiates returns
- ERPNext processes credit notes, stock returns, and refunds

## Security & Integration Controls

### ✅ Implemented

1. **Dedicated Integration User**: Limited permissions user account
2. **Token-based API Authentication**: API key + secret
3. **Webhooks**: Support for real-time updates (Items, Prices, Stock, Orders, Invoices)
4. **Idempotency Keys**: Prevents duplicate transactions
5. **Integration Logs**: Complete audit trail
6. **Retry Mechanism**: Exponential backoff for failed requests

## Setup Instructions

### 1. ERPNext Configuration

#### Create API User in ERPNext
1. Login to ERPNext as Administrator
2. Go to User → New User
3. Create user: `integration@diamondcasa.in`
4. Assign role: Limited permissions (only Sales Order, Customer, Item read/write)

#### Generate API Key
1. Go to User → API Keys
2. Generate new API Key and Secret
3. Copy both values

#### Configure Warehouses
Create warehouses in ERPNext:
- `READY - DC`: Ready to ship items
- `MTO/WIP - DC`: Made-to-order items
- `TRANSIT - DC`: Items in transit
- `RETURN - DC`: Returned items

#### Configure Item Groups
Create Item Groups:
- Rings
- Earrings
- Necklaces
- Bracelets
- Bangles
- Pendants
- Collections

#### Configure Custom Fields
Add custom fields to Item doctype:
- `custom_metal_purity` (Data)
- `custom_weight` (Float)
- `custom_diamond_details` (Small Text)
- `custom_lead_time` (Int)
- `custom_brand` (Data)
- `custom_metal_type` (Select)
- `custom_diamond_type` (Select)

### 2. Website Configuration

#### Access Admin Dashboard
1. Login to admin dashboard
2. Navigate to "ERPNext Integration" in sidebar

#### Configure Connection
1. Enter ERPNext API URL: `https://your-erpnext-instance.com`
2. Enter API Key (from ERPNext)
3. Enter API Secret (from ERPNext)
4. Enter Integration User: `integration@diamondcasa.in`
5. Set Auto Sync Interval (default: 15 minutes)
6. Click "Save Configuration"

#### Enable Integration
1. Toggle "Integration Status" switch to Enabled
2. Click "Test Connection" to verify
3. Click "Sync All" to perform initial sync

## Usage

### Automatic Sync
- Products sync every 15 minutes (configurable)
- Inventory sync every 15 minutes
- Real-time updates via webhooks

### Manual Sync
- **Sync Products**: Click "Sync Products" button
- **Sync Inventory**: Click "Sync Inventory" button
- **Sync All**: Click "Sync All" button

### Order Processing
1. Customer adds items to cart
2. Customer proceeds to checkout
3. Order is automatically synced to ERPNext
4. Sales Order created in ERPNext
5. Customer receives confirmation with ERPNext Sales Order number

### Monitoring
- View integration logs in Admin Dashboard
- Check sync status and last sync times
- Monitor errors and retry failed syncs

## API Endpoints Used

### ERPNext API Calls
- `GET /api/resource/Item`: Fetch products
- `GET /api/resource/Item Price`: Fetch prices
- `GET /api/resource/Bin`: Fetch stock levels
- `POST /api/resource/Customer`: Create customer
- `POST /api/resource/Address`: Create address
- `POST /api/resource/Sales Order`: Create sales order
- `GET /api/resource/Sales Invoice`: Fetch invoice
- `GET /api/resource/Payment Entry`: Fetch payment

## Webhook Configuration

### ERPNext Webhooks Setup
1. Go to ERPNext → Integrations → Webhooks
2. Create webhooks for:
   - **Item Updated**: `item.updated`
   - **Price List Updated**: `price_list.updated`
   - **Stock Updated**: `bin.updated`
   - **Sales Order Updated**: `sales_order.updated`
   - **Invoice Created**: `sales_invoice.created`
   - **Payment Created**: `payment_entry.created`

3. Set webhook URL to your website endpoint (requires backend server)

## Key Risks & Mitigation

### ✅ Implemented Mitigations

1. **SKU Mismatch**
   - ✅ Enforced immutable SKU = Item Code
   - ✅ Validation on product sync

2. **Double Entry**
   - ✅ One source of truth per domain
   - ✅ Idempotency keys prevent duplicates

3. **Duplicate Customers**
   - ✅ Dedupe by phone/email
   - ✅ Check existing before creating

4. **Retry Duplication**
   - ✅ Idempotency keys and logs
   - ✅ Exponential backoff

5. **Make-to-Order Complexity**
   - ✅ Lead time tracking
   - ✅ Warehouse strategy (MTO/WIP)

## Integration Logs

All integration activities are logged:
- Timestamp
- Level (success/error)
- Method (GET/POST/PUT)
- Endpoint
- Request/Response data

View logs in Admin Dashboard → ERPNext Integration → Integration Logs

## Testing

### Test Connection
1. Go to Admin Dashboard → ERPNext Integration
2. Click "Test Connection"
3. Verify connection status

### Test Product Sync
1. Create a test item in ERPNext
2. Click "Sync Products" in admin dashboard
3. Verify item appears on website

### Test Order Sync
1. Add items to cart on website
2. Complete checkout
3. Verify Sales Order created in ERPNext
4. Check order status updates

## Troubleshooting

### Connection Failed
- Verify API URL is correct
- Check API Key and Secret
- Ensure ERPNext instance is accessible
- Check firewall settings

### Products Not Syncing
- Verify Item Group is "Jewelry"
- Check custom fields are configured
- Verify API user has Item read permissions
- Check integration logs for errors

### Orders Not Syncing
- Verify customer creation permissions
- Check Sales Order permissions
- Verify tax templates exist
- Check integration logs for specific errors

### Stock Not Updating
- Verify warehouses exist in ERPNext
- Check Bin permissions
- Verify warehouse names match exactly
- Check integration logs

## Future Enhancements

- Real-time webhook processing (requires backend)
- Advanced reporting and analytics
- Automated return processing
- Multi-warehouse support
- Advanced inventory forecasting
- Automated reorder points

## Support

For issues or questions:
- Check integration logs in Admin Dashboard
- Review ERPNext API documentation
- Check browser console for errors
- Verify ERPNext permissions and configuration

## Conclusion

ERPNext integration is fully implemented and ready for production use. The system ensures:
- ✅ Single source of truth for inventory and pricing
- ✅ Automated order processing
- ✅ Complete audit trail
- ✅ Error handling and retry mechanisms
- ✅ Scalable architecture for future growth
