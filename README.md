# Diamond Casa - Luxury Jewelry E-Commerce Platform

A comprehensive e-commerce platform for luxury jewelry, featuring full ERPNext integration, admin dashboard, and advanced product management.

## 🌟 Features

### Customer-Facing Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse rings, earrings, necklaces, bracelets, bangles, pendants, and collections
- **Advanced Search & Filtering**: Search products, filter by price range, carat, metal type, diamond type, gender
- **Shopping Cart**: Add to cart, update quantities, remove items
- **User Authentication**: Login/Register functionality with session management
- **Wishlist**: Save favorite products
- **Product Comparison**: Compare up to 3 products side-by-side
- **Product Details**: Detailed product modals with image galleries (up to 5 images) and videos
- **Ready to Ship**: Filter products by availability
- **Customer Portal**: My Account section with order history, tracking, returns, and profile management
- **Order Tracking**: Track orders by Order ID or tracking number
- **Returns Management**: Request returns and track return status

### Admin Dashboard
- **Dashboard Analytics**: Sales statistics, revenue charts, order summaries
- **Product Management**: Add, edit, delete products with full details
- **Order Management**: View and manage all customer orders
- **Customer Management**: View customer database and details
- **Inventory Management**: Track stock levels, reorder alerts, stock transfers
- **Purchase Orders**: Manage purchase orders and suppliers
- **Returns & Refunds**: Process return requests and refunds
- **Analytics & Reports**: Sales analytics, inventory valuation, performance metrics
- **Content Management**: Manage website content and promotions
- **User Management**: Admin user accounts and permissions
- **Settings**: Store configuration, payment methods, shipping, GST settings

### ERPNext Integration
- **Bidirectional Sync**: Real-time synchronization between website and ERPNext
- **Product Sync**: Automatic product sync from ERPNext with images and videos
- **Inventory Sync**: Real-time stock level updates
- **Order Sync**: Automatic order creation in ERPNext
- **Customer Sync**: Customer data synchronization
- **Bulk Product Import**: Import products from ERPNext with media files
- **Excel Upload**: Upload products directly from Excel files to ERPNext
- **Returns Management**: Process returns and create credit notes in ERPNext
- **Purchase Orders**: Manage suppliers and purchase orders
- **Analytics**: Sales analytics and inventory valuation from ERPNext

## 📁 File Structure

```
DEMOAPP/
├── index.html                          # Main website HTML
├── styles.css                          # Website styling
├── script.js                           # Website JavaScript
├── admin.html                          # Admin dashboard HTML
├── admin-styles.css                    # Admin dashboard styling
├── admin-script.js                     # Admin dashboard JavaScript
├── erpnext-integration.js            # ERPNext integration module
├── package.json                        # Node.js dependencies
├── README.md                           # This file
├── ADMIN_LOGIN_INSTRUCTIONS.md         # Admin login guide
├── ERPNext_INTEGRATION_GUIDE.md         # ERPNext setup guide
├── ERPNext_ECOMMERCE_INTEGRATION.md   # E-commerce features guide
├── BULK_PRODUCT_IMPORT_GUIDE.md       # Bulk import guide
├── EXCEL_TO_ERPNEXT_UPLOAD_GUIDE.md   # Excel upload guide
├── EXCEL_COLUMN_MAPPING_REFERENCE.md  # Excel column mapping
└── erpnext/                            # ERPNext reference code
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) Local web server for best experience
- (Optional) ERPNext instance for full integration

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd DEMOAPP
   ```

2. **Open the website**
   - Simply open `index.html` in your browser, OR
   - Use a local server (see below)

### Running with Local Server

#### Using Python:
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

#### Using Node.js:
```bash
npm install -g http-server
http-server -p 8000
# Then open http://localhost:8000
```

#### Using VS Code:
Install "Live Server" extension and click "Go Live"

## 🔐 Admin Dashboard Access

1. Open `admin.html` in your browser
2. Login with:
   - **Email**: `admin@diamondcasa.com`
   - **Password**: `admin123`

See `ADMIN_LOGIN_INSTRUCTIONS.md` for detailed instructions.

## 🔗 ERPNext Integration Setup

1. **Configure ERPNext**:
   - Set up ERPNext instance
   - Create API user and generate API keys
   - Configure warehouses and item groups
   - Add custom fields to Item doctype

2. **Configure Website**:
   - Go to Admin Dashboard → ERPNext Integration
   - Enter ERPNext API URL, Key, and Secret
   - Enable integration
   - Test connection

See `ERPNext_INTEGRATION_GUIDE.md` for complete setup instructions.

## 📤 Uploading Products

### From Excel to ERPNext

1. Prepare Excel file with product data (see `EXCEL_COLUMN_MAPPING_REFERENCE.md`)
2. Go to Admin Dashboard → ERPNext Integration
3. Scroll to "Upload Products from Excel to ERPNext"
4. Select your Excel file
5. Configure settings and click "Upload to ERPNext"

### Bulk Import from ERPNext

1. Go to Admin Dashboard → ERPNext Integration
2. Scroll to "Bulk Product Import"
3. Select Item Group and configure options
4. Click "Start Bulk Import"

See `EXCEL_TO_ERPNEXT_UPLOAD_GUIDE.md` and `BULK_PRODUCT_IMPORT_GUIDE.md` for details.

## 🛠️ Customization

### Website Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #d4af37;
    --text-color: #333;
}
```

### Store Information
Update store details in:
- `index.html` - Contact information, addresses
- `admin.html` - Store settings
- `script.js` - Default values
- `admin-script.js` - Admin defaults

### Indian Market Customization
The platform is customized for the Indian market with:
- INR currency (₹)
- Indian addresses and phone numbers
- GST compliance settings
- Indian payment methods
- Indian festivals and cultural content

## 📊 Key Features

### E-Commerce
- ✅ Shopping cart with LocalStorage persistence
- ✅ User authentication and sessions
- ✅ Product search and filtering
- ✅ Wishlist and product comparison
- ✅ Order management and tracking
- ✅ Returns and refunds processing

### Admin Features
- ✅ Complete admin dashboard
- ✅ Product, order, customer management
- ✅ Inventory and stock management
- ✅ Analytics and reporting
- ✅ Purchase orders and suppliers
- ✅ Returns management

### ERPNext Integration
- ✅ Real-time product sync
- ✅ Inventory synchronization
- ✅ Order creation and tracking
- ✅ Customer data sync
- ✅ Returns and credit notes
- ✅ Purchase order management
- ✅ Excel bulk upload
- ✅ Bulk product import with media

## 📚 Documentation

- `ADMIN_LOGIN_INSTRUCTIONS.md` - How to access admin dashboard
- `ERPNext_INTEGRATION_GUIDE.md` - ERPNext setup and configuration
- `ERPNext_ECOMMERCE_INTEGRATION.md` - E-commerce features guide
- `BULK_PRODUCT_IMPORT_GUIDE.md` - Bulk import from ERPNext
- `EXCEL_TO_ERPNEXT_UPLOAD_GUIDE.md` - Excel upload instructions
- `EXCEL_COLUMN_MAPPING_REFERENCE.md` - Complete column mapping reference

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- All data is stored in browser LocalStorage (for demo purposes)
- In production, integrate with a backend API
- ERPNext integration requires ERPNext instance setup
- Excel upload requires ERPNext API access
- Images and videos should be hosted or use full URLs

## 🔒 Security

- Admin dashboard requires authentication
- API keys should be kept secure
- Use HTTPS in production
- Implement proper backend authentication for production use

## 📄 License

This project is created for demonstration purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your needs.

## 📞 Support

For issues or questions, refer to the documentation files or check the integration logs in the admin dashboard.

---

**Version**: 2.0  
**Last Updated**: 2024  
**Platform**: Diamond Casa E-Commerce with ERPNext Integration
