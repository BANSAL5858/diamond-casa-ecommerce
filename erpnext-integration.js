/**
 * ERPNext Integration Module for Diamond Casa
 * 
 * Core Principle: ERPNext acts as single system of record for Inventory, Pricing and Accounting
 * Integration Direction:
 * - Masters & Controls: ERPNext → Website (Items, SKUs, Variants, Price Lists, Stock, Taxes)
 * - Transactions: Website → ERPNext (Orders, Customers, Payments, Returns)
 */

class ERPNextIntegration {
    constructor() {
        this.config = {
            apiUrl: localStorage.getItem('erpnext_api_url') || 'https://erpnext.diamondcasa.in',
            apiKey: localStorage.getItem('erpnext_api_key') || '',
            apiSecret: localStorage.getItem('erpnext_api_secret') || '',
            integrationUser: localStorage.getItem('erpnext_user') || 'integration@diamondcasa.in',
            enabled: localStorage.getItem('erpnext_enabled') === 'true',
            retryAttempts: 3,
            retryDelay: 2000
        };
        
        this.syncStatus = {
            lastProductSync: null,
            lastInventorySync: null,
            lastOrderSync: null,
            syncInProgress: false,
            errors: []
        };
        
        this.integrationLogs = JSON.parse(localStorage.getItem('erpnext_logs')) || [];
        this.idempotencyKeys = new Set(JSON.parse(localStorage.getItem('erpnext_idempotency')) || []);
        
        this.init();
    }

    init() {
        this.setupWebhooks();
        this.loadSyncStatus();
    }

    /**
     * ERPNext API Client
     */
    async apiRequest(method, endpoint, data = null, idempotencyKey = null) {
        const url = `${this.config.apiUrl}/api/resource/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `token ${this.config.apiKey}:${this.config.apiSecret}`,
            'Accept': 'application/json'
        };

        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }

        const options = {
            method: method,
            headers: headers
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `API Error: ${response.status}`);
            }

            this.logIntegration('success', method, endpoint, data, result);
            return result;
        } catch (error) {
            this.logIntegration('error', method, endpoint, data, { error: error.message });
            throw error;
        }
    }

    /**
     * Product Sync: ERPNext → Website
     * Syncs Items, SKUs, Variants, Price Lists
     */
    async syncProducts() {
        if (!this.config.enabled) {
            console.log('ERPNext integration is disabled');
            return;
        }

        this.syncStatus.syncInProgress = true;
        this.syncStatus.lastProductSync = new Date().toISOString();

        try {
            // Fetch Items from ERPNext
            const items = await this.apiRequest('GET', 'Item?filters=[["item_group","=","Jewelry"]]&fields=["name","item_name","item_code","item_group","stock_uom","description","image","custom_metal_purity","custom_weight","custom_diamond_details","custom_lead_time","has_variants"]');
            
            // Fetch Price Lists
            const priceLists = await this.apiRequest('GET', 'Price List?filters=[["selling","=",1]]');
            
            // Fetch Item Prices
            const itemPrices = await this.apiRequest('GET', 'Item Price?filters=[["price_list","=","Standard Selling"]]&fields=["item_code","price_list_rate","currency"]');

            // Fetch attachments (images and videos) for all items
            const itemsWithMedia = await this.fetchItemsWithMedia(items.data);

            // Transform ERPNext Items to Website Products
            const products = await this.transformERPNextItems(itemsWithMedia, itemPrices.data);

            // Update local products
            this.updateLocalProducts(products);

            this.logIntegration('success', 'SYNC', 'products', { count: products.length });
            this.saveSyncStatus();
            
            return products;
        } catch (error) {
            this.syncStatus.errors.push({
                type: 'product_sync',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.logIntegration('error', 'SYNC', 'products', null, { error: error.message });
            throw error;
        } finally {
            this.syncStatus.syncInProgress = false;
        }
    }

    /**
     * Fetch Items with Media (Images and Videos) from ERPNext
     * ERPNext stores attachments via File doctype linked to Item
     */
    async fetchItemsWithMedia(items) {
        const itemsWithMedia = [];
        
        for (const item of items) {
            try {
                // Fetch File attachments for this item
                // In ERPNext, attachments are linked via File doctype with attached_to_doctype='Item' and attached_to_name=item.name
                const attachments = await this.apiRequest('GET', `File?filters=[["attached_to_doctype","=","Item"],["attached_to_name","=","${item.name}"]]&fields=["file_name","file_url","is_private","file_type"]`);
                
                // Separate images and videos
                const images = [];
                const videos = [];
                
                if (attachments.data && attachments.data.length > 0) {
                    attachments.data.forEach(file => {
                        const fileUrl = file.file_url || file.file_name;
                        const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${this.config.apiUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
                        
                        // Check if it's an image or video based on file extension or file_type
                        const fileExtension = (file.file_name || '').toLowerCase().split('.').pop();
                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                        const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(fileExtension);
                        
                        if (isImage) {
                            images.push(fullUrl);
                        } else if (isVideo) {
                            videos.push(fullUrl);
                        }
                    });
                }
                
                // Limit to 5 images and 1 video
                itemsWithMedia.push({
                    ...item,
                    images: images.slice(0, 5), // Maximum 5 images
                    video: videos.length > 0 ? videos[0] : null // First video found
                });
            } catch (error) {
                // If attachment fetch fails, continue with item without media
                console.warn(`Failed to fetch media for item ${item.name}:`, error);
                itemsWithMedia.push({
                    ...item,
                    images: [],
                    video: null
                });
            }
        }
        
        return itemsWithMedia;
    }

    /**
     * Transform ERPNext Items to Website Product Format
     */
    async transformERPNextItems(items, itemPrices) {
        const priceMap = {};
        itemPrices.forEach(ip => {
            priceMap[ip.item_code] = ip.price_list_rate;
        });

        return items.map(item => {
            const price = priceMap[item.item_code] || 0;
            const priceRange = {
                min: Math.round(price * 0.9),
                max: Math.round(price * 1.1)
            };

            // Get images array (up to 5) and video
            const images = item.images || [];
            const video = item.video || null;
            
            // Ensure we have at least the main image if available
            const mainImage = item.image || (images.length > 0 ? images[0] : '');

            return {
                id: this.generateProductId(item.item_code),
                erpnextItemCode: item.item_code, // Immutable SKU = Item Code
                name: item.item_name,
                brand: item.custom_brand || 'Diamond Casa',
                category: this.mapItemGroupToCategory(item.item_group),
                metal: item.custom_metal_type || 'gold',
                diamond: item.custom_diamond_type || 'solitaire',
                price: Math.round(price),
                priceRange: priceRange,
                carat: item.custom_weight || 0,
                readyToShip: item.custom_lead_time === 0 || item.custom_lead_time === null,
                description: item.description || '',
                metalPurity: item.custom_metal_purity || '',
                diamondDetails: item.custom_diamond_details || '',
                leadTime: item.custom_lead_time || 0,
                hasVariants: item.has_variants || false,
                image: mainImage, // Main/primary image for backward compatibility
                images: images, // Array of up to 5 images
                video: video, // Video URL
                status: 'active',
                syncedAt: new Date().toISOString()
            };
        });
    }

    /**
     * Map ERPNext Item Group to Website Category
     */
    mapItemGroupToCategory(itemGroup) {
        const mapping = {
            'Rings': 'rings',
            'Earrings': 'earrings',
            'Necklaces': 'necklaces',
            'Bracelets': 'bracelets',
            'Bangles': 'bangles',
            'Pendants': 'pendants',
            'Collections': 'collections'
        };
        return mapping[itemGroup] || 'rings';
    }

    /**
     * Generate Product ID from Item Code
     */
    generateProductId(itemCode) {
        // Use hash of item code for consistent ID
        let hash = 0;
        for (let i = 0; i < itemCode.length; i++) {
            const char = itemCode.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Update Local Products from ERPNext
     */
    updateLocalProducts(erpnextProducts) {
        // Merge with existing products, prioritizing ERPNext data
        const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
        const erpnextMap = new Map(erpnextProducts.map(p => [p.erpnextItemCode, p]));

        // Update existing products that match ERPNext items
        existingProducts.forEach(product => {
            if (product.erpnextItemCode && erpnextMap.has(product.erpnextItemCode)) {
                const erpnextProduct = erpnextMap.get(product.erpnextItemCode);
                Object.assign(product, erpnextProduct);
                erpnextMap.delete(product.erpnextItemCode);
            }
        });

        // Add new products from ERPNext
        erpnextMap.forEach(product => {
            existingProducts.push(product);
        });

        localStorage.setItem('products', JSON.stringify(existingProducts));
        
        // Trigger product update event
        window.dispatchEvent(new CustomEvent('productsUpdated', { detail: existingProducts }));
    }

    /**
     * Inventory Sync: ERPNext → Website
     * Syncs Stock levels from READY, MTO/WIP, TRANSIT warehouses
     */
    async syncInventory() {
        if (!this.config.enabled) return;

        this.syncStatus.lastInventorySync = new Date().toISOString();

        try {
            // Fetch stock from READY warehouse
            const readyStock = await this.apiRequest('GET', `Bin?filters=[["warehouse","=","READY - DC"],["actual_qty",">",0]]&fields=["item_code","actual_qty","warehouse"]`);
            
            // Fetch stock from MTO/WIP warehouse
            const mtoStock = await this.apiRequest('GET', `Bin?filters=[["warehouse","=","MTO/WIP - DC"],["actual_qty",">",0]]&fields=["item_code","actual_qty","warehouse"]`);
            
            // Fetch stock from TRANSIT warehouse
            const transitStock = await this.apiRequest('GET', `Bin?filters=[["warehouse","=","TRANSIT - DC"],["actual_qty",">",0]]&fields=["item_code","actual_qty","warehouse"]`);

            // Update product stock levels
            this.updateProductStock(readyStock.data, mtoStock.data, transitStock.data);

            this.logIntegration('success', 'SYNC', 'inventory', { 
                ready: readyStock.data.length,
                mto: mtoStock.data.length,
                transit: transitStock.data.length
            });
            this.saveSyncStatus();

            return {
                ready: readyStock.data,
                mto: mtoStock.data,
                transit: transitStock.data
            };
        } catch (error) {
            this.syncStatus.errors.push({
                type: 'inventory_sync',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.logIntegration('error', 'SYNC', 'inventory', null, { error: error.message });
            throw error;
        }
    }

    /**
     * Update Product Stock Levels
     */
    updateProductStock(readyStock, mtoStock, transitStock) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const stockMap = new Map();

        // Combine all stock
        [...readyStock, ...mtoStock, ...transitStock].forEach(bin => {
            const itemCode = bin.item_code;
            if (!stockMap.has(itemCode)) {
                stockMap.set(itemCode, 0);
            }
            stockMap.set(itemCode, stockMap.get(itemCode) + bin.actual_qty);
        });

        // Update products
        products.forEach(product => {
            if (product.erpnextItemCode && stockMap.has(product.erpnextItemCode)) {
                product.stock = Math.floor(stockMap.get(product.erpnextItemCode));
                product.readyToShip = readyStock.some(b => b.item_code === product.erpnextItemCode && b.actual_qty > 0);
            }
        });

        localStorage.setItem('products', JSON.stringify(products));
        window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: products }));
    }

    /**
     * Order Sync: Website → ERPNext
     * Creates Sales Order in ERPNext with Customer, Address, Tax
     */
    async syncOrderToERPNext(orderData) {
        if (!this.config.enabled) {
            console.log('ERPNext integration disabled, order not synced');
            return null;
        }

        const idempotencyKey = `order_${orderData.id}_${Date.now()}`;
        
        // Check idempotency
        if (this.idempotencyKeys.has(idempotencyKey)) {
            console.log('Order already synced (idempotency check)');
            return null;
        }

        try {
            // 1. Create/Update Customer
            const customer = await this.createOrUpdateCustomer(orderData.customer);
            
            // 2. Create Customer Address
            const address = await this.createCustomerAddress(customer.name, orderData.shippingAddress);
            
            // 3. Create Sales Order
            const salesOrder = await this.createSalesOrder(orderData, customer.name, address.name);

            // Mark as synced
            this.idempotencyKeys.add(idempotencyKey);
            this.saveIdempotencyKeys();

            this.logIntegration('success', 'CREATE', 'sales_order', { 
                orderId: orderData.id,
                salesOrder: salesOrder.data.name 
            });

            return salesOrder;
        } catch (error) {
            // Retry logic
            return await this.retrySyncOrder(orderData, idempotencyKey, error);
        }
    }

    /**
     * Create or Update Customer in ERPNext
     */
    async createOrUpdateCustomer(customerData) {
        const idempotencyKey = `customer_${customerData.email || customerData.phone}_${Date.now()}`;
        
        try {
            // Check if customer exists
            const existingCustomers = await this.apiRequest('GET', `Customer?filters=[["email_id","=","${customerData.email}"]]`);
            
            if (existingCustomers.data && existingCustomers.data.length > 0) {
                // Update existing customer
                const customer = existingCustomers.data[0];
                const updateData = {
                    customer_name: customerData.name,
                    mobile_no: customerData.phone,
                    email_id: customerData.email
                };
                return await this.apiRequest('PUT', `Customer/${customer.name}`, updateData, idempotencyKey);
            } else {
                // Create new customer
                const newCustomer = {
                    customer_name: customerData.name,
                    customer_type: 'Individual',
                    customer_group: 'Individual',
                    territory: 'India',
                    mobile_no: customerData.phone,
                    email_id: customerData.email,
                    custom_gender: customerData.gender || 'Not Specified'
                };
                return await this.apiRequest('POST', 'Customer', { data: newCustomer }, idempotencyKey);
            }
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'customer', customerData, { error: error.message });
            throw error;
        }
    }

    /**
     * Create Customer Address in ERPNext
     */
    async createCustomerAddress(customerName, addressData) {
        const address = {
            address_title: addressData.name || 'Default',
            address_type: 'Shipping',
            address_line1: addressData.addressLine1,
            address_line2: addressData.addressLine2 || '',
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            country: 'India',
            phone: addressData.phone,
            links: [{
                link_doctype: 'Customer',
                link_name: customerName
            }]
        };

        return await this.apiRequest('POST', 'Address', { data: address });
    }

    /**
     * Create Sales Order in ERPNext
     */
    async createSalesOrder(orderData, customerName, addressName) {
        const items = orderData.items.map(item => ({
            item_code: item.erpnextItemCode || item.sku,
            qty: item.quantity,
            rate: item.price,
            uom: 'Nos'
        }));

        const salesOrder = {
            customer: customerName,
            transaction_date: new Date().toISOString().split('T')[0],
            delivery_date: this.calculateDeliveryDate(orderData.items),
            items: items,
            shipping_address_name: addressName,
            tax_category: 'GST - India',
            taxes_and_charges: 'GST - India',
            order_type: 'Sales',
            company: 'Diamond Casa',
            currency: 'INR',
            custom_website_order_id: orderData.id.toString(),
            custom_payment_method: orderData.paymentMethod || 'Online'
        };

        return await this.apiRequest('POST', 'Sales Order', { data: salesOrder });
    }

    /**
     * Calculate Delivery Date based on items (MTO vs Ready to Ship)
     */
    calculateDeliveryDate(items) {
        const maxLeadTime = Math.max(...items.map(item => item.leadTime || 0));
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + maxLeadTime + 2); // Add 2 days for processing
        return deliveryDate.toISOString().split('T')[0];
    }

    /**
     * Retry Order Sync with Exponential Backoff
     */
    async retrySyncOrder(orderData, idempotencyKey, originalError, attempt = 1) {
        if (attempt > this.config.retryAttempts) {
            this.logIntegration('error', 'RETRY_FAILED', 'sales_order', orderData, { 
                error: originalError.message,
                attempts: attempt 
            });
            throw originalError;
        }

        await this.delay(this.config.retryDelay * attempt);
        
        try {
            return await this.syncOrderToERPNext(orderData);
        } catch (error) {
            return await this.retrySyncOrder(orderData, idempotencyKey, error, attempt + 1);
        }
    }

    /**
     * Invoice & Payment Sync: ERPNext → Website
     */
    async syncInvoice(invoiceName) {
        try {
            const invoice = await this.apiRequest('GET', `Sales Invoice/${invoiceName}`);
            
            // Update order status based on invoice
            this.updateOrderStatus(invoice.data);
            
            this.logIntegration('success', 'SYNC', 'invoice', { invoiceName });
            return invoice;
        } catch (error) {
            this.logIntegration('error', 'SYNC', 'invoice', { invoiceName }, { error: error.message });
            throw error;
        }
    }

    /**
     * Payment Entry Sync: ERPNext → Website
     */
    async syncPayment(paymentEntryName) {
        try {
            const payment = await this.apiRequest('GET', `Payment Entry/${paymentEntryName}`);
            
            // Update order payment status
            this.updatePaymentStatus(payment.data);
            
            this.logIntegration('success', 'SYNC', 'payment', { paymentEntryName });
            return payment;
        } catch (error) {
            this.logIntegration('error', 'SYNC', 'payment', { paymentEntryName }, { error: error.message });
            throw error;
        }
    }

    /**
     * Update Order Status from ERPNext Invoice
     */
    updateOrderStatus(invoiceData) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.erpnextInvoice === invoiceData.name);
        
        if (order) {
            order.status = invoiceData.status === 'Paid' ? 'paid' : 'pending';
            order.invoiceNumber = invoiceData.name;
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }

    /**
     * Update Payment Status from ERPNext Payment Entry
     */
    updatePaymentStatus(paymentData) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.erpnextPayment === paymentData.name);
        
        if (order) {
            order.paymentStatus = paymentData.paid ? 'paid' : 'pending';
            order.paymentReference = paymentData.name;
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }

    /**
     * Webhook Handlers for Real-time Updates
     */
    setupWebhooks() {
        // Listen for ERPNext webhook events (simulated)
        window.addEventListener('erpnextWebhook', (event) => {
            const { type, data } = event.detail;
            
            switch (type) {
                case 'item.updated':
                case 'item.created':
                    this.handleItemWebhook(data);
                    break;
                case 'price_list.updated':
                    this.handlePriceListWebhook(data);
                    break;
                case 'bin.updated':
                    this.handleStockWebhook(data);
                    break;
                case 'sales_order.updated':
                    this.handleSalesOrderWebhook(data);
                    break;
                case 'sales_invoice.created':
                    this.handleInvoiceWebhook(data);
                    break;
                case 'payment_entry.created':
                    this.handlePaymentWebhook(data);
                    break;
            }
        });
    }

    /**
     * Handle Item Webhook
     */
    handleItemWebhook(itemData) {
        this.syncProducts().catch(error => {
            console.error('Error syncing products from webhook:', error);
        });
    }

    /**
     * Handle Price List Webhook
     */
    handlePriceListWebhook(priceListData) {
        this.syncProducts().catch(error => {
            console.error('Error syncing prices from webhook:', error);
        });
    }

    /**
     * Handle Stock Webhook
     */
    handleStockWebhook(binData) {
        this.syncInventory().catch(error => {
            console.error('Error syncing inventory from webhook:', error);
        });
    }

    /**
     * Handle Sales Order Webhook
     */
    handleSalesOrderWebhook(salesOrderData) {
        // Update order status on website
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.erpnextSalesOrder === salesOrderData.name);
        
        if (order) {
            order.erpnextStatus = salesOrderData.status;
            order.deliveryDate = salesOrderData.delivery_date;
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }

    /**
     * Handle Invoice Webhook
     */
    handleInvoiceWebhook(invoiceData) {
        this.syncInvoice(invoiceData.name).catch(error => {
            console.error('Error syncing invoice from webhook:', error);
        });
    }

    /**
     * Handle Payment Webhook
     */
    handlePaymentWebhook(paymentData) {
        this.syncPayment(paymentData.name).catch(error => {
            console.error('Error syncing payment from webhook:', error);
        });
    }

    /**
     * Integration Logging
     */
    logIntegration(level, method, endpoint, requestData, responseData) {
        const log = {
            timestamp: new Date().toISOString(),
            level: level,
            method: method,
            endpoint: endpoint,
            request: requestData,
            response: responseData
        };

        this.integrationLogs.unshift(log);
        
        // Keep only last 1000 logs
        if (this.integrationLogs.length > 1000) {
            this.integrationLogs = this.integrationLogs.slice(0, 1000);
        }

        localStorage.setItem('erpnext_logs', JSON.stringify(this.integrationLogs));
    }

    /**
     * Save Sync Status
     */
    saveSyncStatus() {
        localStorage.setItem('erpnext_sync_status', JSON.stringify(this.syncStatus));
    }

    /**
     * Load Sync Status
     */
    loadSyncStatus() {
        const saved = localStorage.getItem('erpnext_sync_status');
        if (saved) {
            this.syncStatus = { ...this.syncStatus, ...JSON.parse(saved) };
        }
    }

    /**
     * Save Idempotency Keys
     */
    saveIdempotencyKeys() {
        localStorage.setItem('erpnext_idempotency', JSON.stringify(Array.from(this.idempotencyKeys)));
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Test ERPNext Connection
     */
    async testConnection() {
        try {
            const response = await this.apiRequest('GET', 'User?limit_page_length=1');
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Get Integration Status
     */
    getStatus() {
        return {
            enabled: this.config.enabled,
            lastProductSync: this.syncStatus.lastProductSync,
            lastInventorySync: this.syncStatus.lastInventorySync,
            lastOrderSync: this.syncStatus.lastOrderSync,
            syncInProgress: this.syncStatus.syncInProgress,
            recentErrors: this.syncStatus.errors.slice(-5),
            totalLogs: this.integrationLogs.length
        };
    }

    /**
     * Update Configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('erpnext_api_url', this.config.apiUrl);
        localStorage.setItem('erpnext_api_key', this.config.apiKey);
        localStorage.setItem('erpnext_api_secret', this.config.apiSecret);
        localStorage.setItem('erpnext_user', this.config.integrationUser);
        localStorage.setItem('erpnext_enabled', this.config.enabled.toString());
    }

    /**
     * Returns & Refunds Management
     * Create Return Request and Credit Note in ERPNext
     */
    async createReturnRequest(returnData) {
        if (!this.config.enabled) return null;

        const idempotencyKey = `return_${returnData.orderId}_${Date.now()}`;
        
        if (this.idempotencyKeys.has(idempotencyKey)) {
            console.log('Return already processed');
            return null;
        }

        try {
            // 1. Create Return Order in ERPNext
            const returnOrder = await this.createReturnOrder(returnData);
            
            // 2. Create Credit Note
            const creditNote = await this.createCreditNote(returnData, returnOrder.data.name);
            
            // 3. Update stock in RETURN warehouse
            await this.updateReturnStock(returnData.items);

            this.idempotencyKeys.add(idempotencyKey);
            this.saveIdempotencyKeys();

            this.logIntegration('success', 'CREATE', 'return_request', returnData, {
                returnOrder: returnOrder.data.name,
                creditNote: creditNote.data.name
            });

            return { returnOrder, creditNote };
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'return_request', returnData, { error: error.message });
            throw error;
        }
    }

    /**
     * Create Return Order in ERPNext
     */
    async createReturnOrder(returnData) {
        const items = returnData.items.map(item => ({
            item_code: item.erpnextItemCode || item.sku,
            qty: item.quantity,
            rate: item.price,
            uom: 'Nos'
        }));

        const returnOrder = {
            customer: returnData.customerName,
            return_against: returnData.salesOrderName,
            items: items,
            return_reason: returnData.reason || 'Customer Return',
            company: 'Diamond Casa',
            currency: 'INR',
            custom_website_return_id: returnData.returnId.toString()
        };

        return await this.apiRequest('POST', 'Sales Return', { data: returnOrder });
    }

    /**
     * Create Credit Note for Return
     */
    async createCreditNote(returnData, returnOrderName) {
        const creditNote = {
            customer: returnData.customerName,
            return_against: returnOrderName,
            company: 'Diamond Casa',
            currency: 'INR',
            posting_date: new Date().toISOString().split('T')[0],
            items: returnData.items.map(item => ({
                item_code: item.erpnextItemCode || item.sku,
                qty: item.quantity,
                rate: item.price
            }))
        };

        return await this.apiRequest('POST', 'Sales Invoice', { 
            data: { ...creditNote, is_return: 1 } 
        });
    }

    /**
     * Update Stock in RETURN Warehouse
     */
    async updateReturnStock(items) {
        // Stock will be automatically updated when Return Order is submitted in ERPNext
        // This is a placeholder for manual stock update if needed
        for (const item of items) {
            try {
                await this.apiRequest('POST', 'Stock Entry', {
                    data: {
                        stock_entry_type: 'Material Receipt',
                        to_warehouse: 'RETURN - DC',
                        items: [{
                            item_code: item.erpnextItemCode || item.sku,
                            qty: item.quantity,
                            t_warehouse: 'RETURN - DC'
                        }]
                    }
                });
            } catch (error) {
                console.error(`Error updating return stock for ${item.sku}:`, error);
            }
        }
    }

    /**
     * Order Tracking: Get Order Status from ERPNext
     */
    async getOrderStatus(salesOrderName) {
        try {
            const salesOrder = await this.apiRequest('GET', `Sales Order/${salesOrderName}`);
            
            // Get Delivery Note if exists
            let deliveryNote = null;
            if (salesOrder.data.delivery_note) {
                try {
                    deliveryNote = await this.apiRequest('GET', `Delivery Note/${salesOrder.data.delivery_note}`);
                } catch (e) {
                    console.log('Delivery note not found');
                }
            }

            // Get Shipment if exists
            let shipment = null;
            if (deliveryNote?.data?.lr_no) {
                shipment = {
                    trackingNumber: deliveryNote.data.lr_no,
                    carrier: deliveryNote.data.carrier || 'Standard Shipping'
                };
            }

            return {
                salesOrder: salesOrder.data,
                status: salesOrder.data.status,
                deliveryDate: salesOrder.data.delivery_date,
                deliveryNote: deliveryNote?.data,
                shipment: shipment,
                invoice: salesOrder.data.advance_paid > 0 ? 'Partially Paid' : 'Unpaid'
            };
        } catch (error) {
            this.logIntegration('error', 'GET', 'order_status', { salesOrderName }, { error: error.message });
            throw error;
        }
    }

    /**
     * Get Customer Order History
     */
    async getCustomerOrders(customerEmail) {
        try {
            // Find customer by email
            const customers = await this.apiRequest('GET', `Customer?filters=[["email_id","=","${customerEmail}"]]`);
            
            if (!customers.data || customers.data.length === 0) {
                return [];
            }

            const customerName = customers.data[0].name;
            
            // Get all Sales Orders for customer
            const salesOrders = await this.apiRequest('GET', `Sales Order?filters=[["customer","=","${customerName}"]]&fields=["name","transaction_date","grand_total","status","delivery_date","per_delivered"]`);

            return salesOrders.data || [];
        } catch (error) {
            this.logIntegration('error', 'GET', 'customer_orders', { customerEmail }, { error: error.message });
            throw error;
        }
    }

    /**
     * Create Quotation in ERPNext
     */
    async createQuotation(quotationData) {
        if (!this.config.enabled) return null;

        const idempotencyKey = `quotation_${quotationData.id}_${Date.now()}`;
        
        if (this.idempotencyKeys.has(idempotencyKey)) {
            return null;
        }

        try {
            // Get or create customer
            const customer = await this.createOrUpdateCustomer(quotationData.customer);

            const items = quotationData.items.map(item => ({
                item_code: item.erpnextItemCode || item.sku,
                qty: item.quantity,
                rate: item.price,
                uom: 'Nos'
            }));

            const quotation = {
                party_name: customer.name,
                quotation_to: 'Customer',
                items: items,
                valid_till: this.calculateValidTillDate(30), // 30 days validity
                company: 'Diamond Casa',
                currency: 'INR',
                custom_website_quotation_id: quotationData.id.toString()
            };

            const result = await this.apiRequest('POST', 'Quotation', { data: quotation }, idempotencyKey);
            
            this.idempotencyKeys.add(idempotencyKey);
            this.saveIdempotencyKeys();

            this.logIntegration('success', 'CREATE', 'quotation', quotationData, result);
            return result;
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'quotation', quotationData, { error: error.message });
            throw error;
        }
    }

    /**
     * Convert Quotation to Sales Order
     */
    async convertQuotationToOrder(quotationName) {
        try {
            // In ERPNext, this is typically done via a button, but we can create SO from Quotation
            const quotation = await this.apiRequest('GET', `Quotation/${quotationName}`);
            
            const salesOrder = {
                customer: quotation.data.party_name,
                transaction_date: new Date().toISOString().split('T')[0],
                items: quotation.data.items.map(item => ({
                    item_code: item.item_code,
                    qty: item.qty,
                    rate: item.rate
                })),
                company: 'Diamond Casa',
                currency: 'INR',
                quotation_no: quotationName
            };

            return await this.apiRequest('POST', 'Sales Order', { data: salesOrder });
        } catch (error) {
            this.logIntegration('error', 'CONVERT', 'quotation_to_order', { quotationName }, { error: error.message });
            throw error;
        }
    }

    /**
     * Purchase Order Management
     */
    async createPurchaseOrder(purchaseData) {
        if (!this.config.enabled) return null;

        try {
            const items = purchaseData.items.map(item => ({
                item_code: item.itemCode,
                qty: item.quantity,
                rate: item.rate,
                uom: 'Nos'
            }));

            const purchaseOrder = {
                supplier: purchaseData.supplier,
                transaction_date: new Date().toISOString().split('T')[0],
                schedule_date: purchaseData.scheduleDate || new Date().toISOString().split('T')[0],
                items: items,
                company: 'Diamond Casa',
                currency: 'INR'
            };

            return await this.apiRequest('POST', 'Purchase Order', { data: purchaseOrder });
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'purchase_order', purchaseData, { error: error.message });
            throw error;
        }
    }

    /**
     * Get Purchase Orders
     */
    async getPurchaseOrders(filters = {}) {
        try {
            let filterString = '[';
            if (filters.supplier) {
                filterString += `["supplier","=","${filters.supplier}"]`;
            }
            if (filters.status) {
                filterString += filterString.length > 1 ? ',' : '';
                filterString += `["status","=","${filters.status}"]`;
            }
            filterString += ']';

            const purchaseOrders = await this.apiRequest('GET', `Purchase Order?filters=${filterString}`);
            return purchaseOrders.data || [];
        } catch (error) {
            this.logIntegration('error', 'GET', 'purchase_orders', filters, { error: error.message });
            throw error;
        }
    }

    /**
     * Supplier Management
     */
    async getSuppliers() {
        try {
            const suppliers = await this.apiRequest('GET', 'Supplier?fields=["name","supplier_name","supplier_type","email_id","mobile_no"]');
            return suppliers.data || [];
        } catch (error) {
            this.logIntegration('error', 'GET', 'suppliers', null, { error: error.message });
            throw error;
        }
    }

    /**
     * Advanced Inventory: Stock Transfer
     */
    async transferStock(transferData) {
        if (!this.config.enabled) return null;

        try {
            const stockEntry = {
                stock_entry_type: 'Material Transfer',
                from_warehouse: transferData.fromWarehouse,
                to_warehouse: transferData.toWarehouse,
                items: transferData.items.map(item => ({
                    item_code: item.itemCode,
                    qty: item.quantity,
                    s_warehouse: transferData.fromWarehouse,
                    t_warehouse: transferData.toWarehouse
                })),
                company: 'Diamond Casa'
            };

            return await this.apiRequest('POST', 'Stock Entry', { data: stockEntry });
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'stock_transfer', transferData, { error: error.message });
            throw error;
        }
    }

    /**
     * Get Reorder Level Alerts
     */
    async getReorderAlerts() {
        try {
            // Get items with stock below reorder level
            const items = await this.apiRequest('GET', 'Item?filters=[["reorder_level",">",0]]&fields=["name","item_name","reorder_level","item_group"]');
            
            const alerts = [];
            for (const item of items.data) {
                const bins = await this.apiRequest('GET', `Bin?filters=[["item_code","=","${item.name}"]]&fields=["actual_qty","warehouse"]`);
                const totalStock = bins.data.reduce((sum, bin) => sum + bin.actual_qty, 0);
                
                if (totalStock <= item.reorder_level) {
                    alerts.push({
                        item: item.item_name,
                        itemCode: item.name,
                        currentStock: totalStock,
                        reorderLevel: item.reorder_level,
                        warehouse: bins.data[0]?.warehouse
                    });
                }
            }

            return alerts;
        } catch (error) {
            this.logIntegration('error', 'GET', 'reorder_alerts', null, { error: error.message });
            return [];
        }
    }

    /**
     * Delivery Note & Shipment Tracking
     */
    async getDeliveryNote(deliveryNoteName) {
        try {
            const deliveryNote = await this.apiRequest('GET', `Delivery Note/${deliveryNoteName}`);
            
            return {
                name: deliveryNote.data.name,
                customer: deliveryNote.data.customer,
                postingDate: deliveryNote.data.posting_date,
                items: deliveryNote.data.items,
                trackingNumber: deliveryNote.data.lr_no,
                carrier: deliveryNote.data.carrier,
                status: deliveryNote.data.status,
                grandTotal: deliveryNote.data.grand_total
            };
        } catch (error) {
            this.logIntegration('error', 'GET', 'delivery_note', { deliveryNoteName }, { error: error.message });
            throw error;
        }
    }

    /**
     * Get Shipment Tracking
     */
    async getShipmentTracking(trackingNumber) {
        try {
            // Search for delivery note by tracking number
            const deliveryNotes = await this.apiRequest('GET', `Delivery Note?filters=[["lr_no","=","${trackingNumber}"]]`);
            
            if (deliveryNotes.data && deliveryNotes.data.length > 0) {
                return await this.getDeliveryNote(deliveryNotes.data[0].name);
            }
            
            return null;
        } catch (error) {
            this.logIntegration('error', 'GET', 'shipment_tracking', { trackingNumber }, { error: error.message });
            return null;
        }
    }

    /**
     * Product Reviews & Ratings
     */
    async syncProductReview(reviewData) {
        if (!this.config.enabled) return null;

        try {
            // Store review in ERPNext custom field or separate doctype
            // This would require a custom ERPNext app for reviews
            // For now, we'll store in local storage and sync when custom app is available
            
            const reviews = JSON.parse(localStorage.getItem('product_reviews')) || [];
            reviews.push({
                ...reviewData,
                timestamp: new Date().toISOString(),
                synced: false
            });
            localStorage.setItem('product_reviews', JSON.stringify(reviews));

            // If custom review doctype exists in ERPNext
            try {
                await this.apiRequest('POST', 'Product Review', {
                    data: {
                        item_code: reviewData.itemCode,
                        customer: reviewData.customerEmail,
                        rating: reviewData.rating,
                        review_text: reviewData.review,
                        status: 'Approved'
                    }
                });
                
                // Mark as synced
                const updatedReviews = JSON.parse(localStorage.getItem('product_reviews'));
                const reviewIndex = updatedReviews.findIndex(r => r.id === reviewData.id);
                if (reviewIndex > -1) {
                    updatedReviews[reviewIndex].synced = true;
                    localStorage.setItem('product_reviews', JSON.stringify(updatedReviews));
                }
            } catch (e) {
                // Custom doctype not available, will sync later
                console.log('Product Review doctype not available in ERPNext');
            }

            return { success: true };
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'product_review', reviewData, { error: error.message });
            throw error;
        }
    }

    /**
     * Get Product Reviews
     */
    async getProductReviews(itemCode) {
        try {
            // Try to get from ERPNext custom doctype
            try {
                const reviews = await this.apiRequest('GET', `Product Review?filters=[["item_code","=","${itemCode}"],["status","=","Approved"]]`);
                return reviews.data || [];
            } catch (e) {
                // Fallback to local storage
                const allReviews = JSON.parse(localStorage.getItem('product_reviews')) || [];
                return allReviews.filter(r => r.itemCode === itemCode && r.status === 'Approved');
            }
        } catch (error) {
            return [];
        }
    }

    /**
     * Calculate Valid Till Date
     */
    calculateValidTillDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get Sales Analytics
     */
    async getSalesAnalytics(period = 'month') {
        try {
            const endDate = new Date().toISOString().split('T')[0];
            let startDate = new Date();
            
            switch (period) {
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
            }
            startDate = startDate.toISOString().split('T')[0];

            const salesOrders = await this.apiRequest('GET', `Sales Order?filters=[["transaction_date",">=","${startDate}"],["transaction_date","<=","${endDate}"],["status","!=","Cancelled"]]&fields=["grand_total","transaction_date","status"]`);

            const analytics = {
                totalRevenue: 0,
                totalOrders: salesOrders.data?.length || 0,
                averageOrderValue: 0,
                byStatus: {},
                byDate: {}
            };

            if (salesOrders.data) {
                salesOrders.data.forEach(order => {
                    analytics.totalRevenue += order.grand_total || 0;
                    analytics.byStatus[order.status] = (analytics.byStatus[order.status] || 0) + 1;
                    const date = order.transaction_date;
                    analytics.byDate[date] = (analytics.byDate[date] || 0) + (order.grand_total || 0);
                });

                analytics.averageOrderValue = analytics.totalOrders > 0 
                    ? analytics.totalRevenue / analytics.totalOrders 
                    : 0;
            }

            return analytics;
        } catch (error) {
            this.logIntegration('error', 'GET', 'sales_analytics', { period }, { error: error.message });
            return null;
        }
    }

    /**
     * Get Inventory Valuation
     */
    async getInventoryValuation() {
        try {
            const items = await this.apiRequest('GET', 'Item?filters=[["is_stock_item","=",1]]&fields=["name","item_name","valuation_rate"]');
            
            const valuation = {
                totalItems: items.data?.length || 0,
                totalValue: 0,
                byWarehouse: {}
            };

            for (const item of items.data || []) {
                const bins = await this.apiRequest('GET', `Bin?filters=[["item_code","=","${item.name}"]]&fields=["actual_qty","warehouse","valuation_rate"]`);
                
                bins.data.forEach(bin => {
                    const value = (bin.valuation_rate || item.valuation_rate || 0) * bin.actual_qty;
                    valuation.totalValue += value;
                    valuation.byWarehouse[bin.warehouse] = (valuation.byWarehouse[bin.warehouse] || 0) + value;
                });
            }

            return valuation;
        } catch (error) {
            this.logIntegration('error', 'GET', 'inventory_valuation', null, { error: error.message });
            return null;
        }
    }

    /**
     * Bulk Import Products from ERPNext
     * Imports all products with their images and videos
     */
    async bulkImportProducts(options = {}) {
        if (!this.config.enabled) {
            throw new Error('ERPNext integration is disabled');
        }

        const {
            itemGroup = 'Jewelry',
            limit = null,
            updateExisting = true,
            onProgress = null
        } = options;

        try {
            // Build filter
            let filter = `[["item_group","=","${itemGroup}"]]`;
            if (limit) {
                filter += `&limit_page_length=${limit}`;
            }

            // Fetch all items
            const itemsResponse = await this.apiRequest('GET', `Item?filters=${filter}&fields=["name","item_name","item_code","item_group","stock_uom","description","image","custom_metal_purity","custom_weight","custom_diamond_details","custom_lead_time","has_variants","custom_brand","custom_metal_type","custom_diamond_type"]`);
            
            const items = itemsResponse.data || [];
            const totalItems = items.length;
            
            if (onProgress) {
                onProgress({ current: 0, total: totalItems, status: 'Fetching items...' });
            }

            // Fetch prices
            const itemPrices = await this.apiRequest('GET', 'Item Price?filters=[["price_list","=","Standard Selling"]]&fields=["item_code","price_list_rate","currency"]');

            if (onProgress) {
                onProgress({ current: totalItems * 0.3, total: totalItems, status: 'Fetching media files...' });
            }

            // Fetch media for all items (with progress updates)
            const itemsWithMedia = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                try {
                    const attachments = await this.apiRequest('GET', `File?filters=[["attached_to_doctype","=","Item"],["attached_to_name","=","${item.name}"]]&fields=["file_name","file_url","is_private","file_type"]`);
                    
                    const images = [];
                    const videos = [];
                    
                    if (attachments.data && attachments.data.length > 0) {
                        attachments.data.forEach(file => {
                            const fileUrl = file.file_url || file.file_name;
                            const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${this.config.apiUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
                            
                            const fileExtension = (file.file_name || '').toLowerCase().split('.').pop();
                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                            const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(fileExtension);
                            
                            if (isImage) {
                                images.push(fullUrl);
                            } else if (isVideo) {
                                videos.push(fullUrl);
                            }
                        });
                    }
                    
                    itemsWithMedia.push({
                        ...item,
                        images: images.slice(0, 5),
                        video: videos.length > 0 ? videos[0] : null
                    });

                    if (onProgress) {
                        onProgress({ 
                            current: Math.floor(totalItems * 0.3 + (i / items.length) * totalItems * 0.5), 
                            total: totalItems, 
                            status: `Processing item ${i + 1} of ${totalItems}...` 
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to fetch media for item ${item.name}:`, error);
                    itemsWithMedia.push({
                        ...item,
                        images: [],
                        video: null
                    });
                }
            }

            if (onProgress) {
                onProgress({ current: Math.floor(totalItems * 0.8), total: totalItems, status: 'Transforming products...' });
            }

            // Transform to website format
            const products = await this.transformERPNextItems(itemsWithMedia, itemPrices.data);

            if (onProgress) {
                onProgress({ current: Math.floor(totalItems * 0.9), total: totalItems, status: 'Saving products...' });
            }

            // Update local products
            if (updateExisting) {
                this.updateLocalProducts(products);
            } else {
                // Add only new products
                const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
                const existingCodes = new Set(existingProducts.map(p => p.erpnextItemCode));
                const newProducts = products.filter(p => !existingCodes.has(p.erpnextItemCode));
                existingProducts.push(...newProducts);
                localStorage.setItem('products', JSON.stringify(existingProducts));
                window.dispatchEvent(new CustomEvent('productsUpdated', { detail: existingProducts }));
            }

            if (onProgress) {
                onProgress({ current: totalItems, total: totalItems, status: 'Import complete!' });
            }

            this.logIntegration('success', 'BULK_IMPORT', 'products', { 
                count: products.length,
                withImages: products.filter(p => p.images && p.images.length > 0).length,
                withVideos: products.filter(p => p.video).length
            });

            return {
                success: true,
                imported: products.length,
                withImages: products.filter(p => p.images && p.images.length > 0).length,
                withVideos: products.filter(p => p.video).length,
                products: products
            };
        } catch (error) {
            this.logIntegration('error', 'BULK_IMPORT', 'products', options, { error: error.message });
            throw error;
        }
    }

    /**
     * Create Item in ERPNext from Excel Data
     */
    async createItemInERPNext(itemData) {
        if (!this.config.enabled) {
            throw new Error('ERPNext integration is disabled');
        }

        try {
            // Check if item already exists
            let existingItem = null;
            try {
                existingItem = await this.apiRequest('GET', `Item/${itemData.item_code}`);
            } catch (e) {
                // Item doesn't exist, will create new
            }

            const itemPayload = {
                item_code: itemData.item_code,
                item_name: itemData.item_name || itemData.item_code,
                item_group: itemData.item_group || 'Jewelry',
                stock_uom: itemData.stock_uom || 'Nos',
                description: itemData.description || '',
                is_stock_item: itemData.is_stock_item !== false,
                is_sales_item: itemData.is_sales_item !== false,
                is_purchase_item: itemData.is_purchase_item !== false,
                // Custom fields
                custom_metal_purity: itemData.custom_metal_purity || '',
                custom_weight: itemData.custom_weight || 0,
                custom_diamond_details: itemData.custom_diamond_details || '',
                custom_lead_time: itemData.custom_lead_time || 0,
                custom_brand: itemData.custom_brand || '',
                custom_metal_type: itemData.custom_metal_type || '',
                custom_diamond_type: itemData.custom_diamond_type || '',
                custom_subcategory: itemData.custom_subcategory || '',
                custom_collection: itemData.custom_collection || '',
                custom_folder_name: itemData.custom_folder_name || '',
                custom_quantity: itemData.custom_quantity || 1,
                custom_size: itemData.custom_size || '',
                image: itemData.image || ''
            };

            let result;
            if (existingItem) {
                // Update existing item
                result = await this.apiRequest('PUT', `Item/${itemData.item_code}`, { data: itemPayload });
            } else {
                // Create new item
                result = await this.apiRequest('POST', 'Item', { data: itemPayload });
            }

            // Create Item Price if price is provided
            if (itemData.price && itemData.price > 0) {
                try {
                    await this.createItemPrice(itemData.item_code, itemData.price);
                } catch (priceError) {
                    console.warn(`Failed to create price for ${itemData.item_code}:`, priceError);
                }
            }

            return result;
        } catch (error) {
            this.logIntegration('error', 'CREATE', 'item', itemData, { error: error.message });
            throw error;
        }
    }

    /**
     * Create Item Price in ERPNext
     */
    async createItemPrice(itemCode, price) {
        try {
            const priceList = 'Standard Selling';
            const currency = 'INR';

            // Check if price already exists
            try {
                const existingPrices = await this.apiRequest('GET', `Item Price?filters=[["item_code","=","${itemCode}"],["price_list","=","${priceList}"]]`);
                if (existingPrices.data && existingPrices.data.length > 0) {
                    // Update existing price
                    const existingPrice = existingPrices.data[0];
                    return await this.apiRequest('PUT', `Item Price/${existingPrice.name}`, {
                        data: {
                            price_list_rate: price,
                            currency: currency
                        }
                    });
                }
            } catch (e) {
                // No existing price, create new
            }

            // Create new price
            return await this.apiRequest('POST', 'Item Price', {
                data: {
                    item_code: itemCode,
                    price_list: priceList,
                    price_list_rate: price,
                    currency: currency
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Bulk Upload Items from Excel Data
     */
    async bulkUploadItemsFromExcel(excelData, options = {}) {
        if (!this.config.enabled) {
            throw new Error('ERPNext integration is disabled');
        }

        const {
            updateExisting = true,
            createPriceList = true,
            defaultItemGroup = 'Jewelry',
            onProgress = null
        } = options;

        const results = {
            total: excelData.length,
            created: 0,
            updated: 0,
            failed: 0,
            errors: []
        };

        for (let i = 0; i < excelData.length; i++) {
            const row = excelData[i];
            
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: excelData.length,
                    status: `Processing ${row.item_code || row.item_name || `Row ${i + 1}`}...`
                });
            }

            try {
                // Map Excel columns to ERPNext Item fields
                const itemData = this.mapExcelRowToItem(row, defaultItemGroup);
                
                if (!itemData.item_code) {
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        error: 'Item Code is required'
                    });
                    continue;
                }

                // Check if item exists
                let itemExists = false;
                try {
                    await this.apiRequest('GET', `Item/${itemData.item_code}`);
                    itemExists = true;
                } catch (e) {
                    // Item doesn't exist
                }

                if (itemExists && !updateExisting) {
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        item_code: itemData.item_code,
                        error: 'Item already exists and update is disabled'
                    });
                    continue;
                }

                // Create or update item
                await this.createItemInERPNext(itemData);

                // Upload media files from URLs if provided
                // Images and video URLs are extracted from Excel columns
                if (itemData.images && itemData.images.length > 0 || itemData.video) {
                    try {
                        const imageUrls = itemData.images || [];
                        const videoUrl = itemData.video || null;
                        
                        // Upload images and video from URLs
                        const mediaResult = await this.uploadMediaFilesToERPNext(
                            itemData.item_code,
                            imageUrls, // Array of URLs
                            videoUrl   // Single URL or null
                        );
                        
                        // Update itemData with uploaded file URLs
                        itemData.images = mediaResult.images;
                        itemData.video = mediaResult.video;
                        
                        if (mediaResult.errors.length > 0) {
                            console.warn(`Media upload errors for ${itemData.item_code}:`, mediaResult.errors);
                            // Log errors but don't fail the item creation
                        }
                    } catch (mediaError) {
                        console.warn(`Failed to upload media for ${itemData.item_code}:`, mediaError);
                        // Continue even if media upload fails - item is still created
                    }
                }

                if (itemExists) {
                    results.updated++;
                } else {
                    results.created++;
                }

            } catch (error) {
                results.failed++;
                results.errors.push({
                    row: i + 1,
                    item_code: row.item_code || row.item_name,
                    error: error.message
                });
            }
        }

        this.logIntegration('success', 'BULK_UPLOAD', 'items_from_excel', {
            total: results.total,
            created: results.created,
            updated: results.updated,
            failed: results.failed
        });

        return results;
    }

    /**
     * Download file from URL and convert to File object
     */
    async downloadFileFromURL(url, fileName) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to download ${url}: ${response.statusText}`);
            }
            const blob = await response.blob();
            return new File([blob], fileName || url.split('/').pop() || 'file', { type: blob.type });
        } catch (error) {
            console.warn(`Failed to download file from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Upload File to ERPNext
     * Uploads a file (File object or URL) and attaches it to an Item
     */
    async uploadFileToERPNext(fileOrUrl, itemCode, fileType = 'image') {
        if (!this.config.enabled) {
            throw new Error('ERPNext integration is disabled');
        }

        try {
            let file;
            let fileName;

            // Handle URL or File object
            if (typeof fileOrUrl === 'string') {
                // It's a URL - download it first
                fileName = fileOrUrl.split('/').pop() || `image_${Date.now()}.jpg`;
                file = await this.downloadFileFromURL(fileOrUrl, fileName);
            } else {
                // It's a File object
                file = fileOrUrl;
                fileName = file.name;
            }

            // Convert file to base64
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Create file in ERPNext
            const fileData = {
                file_name: fileName,
                file_url: `/files/${fileName}`,
                is_private: 0,
                content: base64
            };

            // Upload file
            const fileResult = await this.apiRequest('POST', 'File', { data: fileData });

            // Attach file to Item
            if (fileResult.data && fileResult.data.name) {
                await this.apiRequest('POST', 'File', {
                    data: {
                        attached_to_doctype: 'Item',
                        attached_to_name: itemCode,
                        file_name: fileName,
                        file_url: fileResult.data.file_url || `/files/${fileName}`,
                        is_private: 0
                    }
                });
            }

            return fileResult;
        } catch (error) {
            console.warn(`Failed to upload file:`, error);
            throw error;
        }
    }

    /**
     * Upload Multiple Files to ERPNext Item
     * Uploads up to 5 images and 1 video
     * Supports both File objects and URLs (strings)
     */
    async uploadMediaFilesToERPNext(itemCode, imageFilesOrUrls = [], videoFileOrUrl = null) {
        const results = {
            images: [],
            video: null,
            errors: []
        };

        // Upload images (max 5)
        for (let i = 0; i < Math.min(imageFilesOrUrls.length, 5); i++) {
            try {
                const image = imageFilesOrUrls[i];
                const result = await this.uploadFileToERPNext(image, itemCode, 'image');
                const fileUrl = result.data?.file_url || result.data?.name || (typeof image === 'string' ? image : image.name);
                results.images.push(fileUrl);
            } catch (error) {
                const fileName = typeof imageFilesOrUrls[i] === 'string' ? imageFilesOrUrls[i] : imageFilesOrUrls[i].name;
                results.errors.push({ file: fileName, error: error.message });
            }
        }

        // Upload video (max 1)
        if (videoFileOrUrl) {
            try {
                const result = await this.uploadFileToERPNext(videoFileOrUrl, itemCode, 'video');
                results.video = result.data?.file_url || result.data?.name || (typeof videoFileOrUrl === 'string' ? videoFileOrUrl : videoFileOrUrl.name);
            } catch (error) {
                const fileName = typeof videoFileOrUrl === 'string' ? videoFileOrUrl : videoFileOrUrl.name;
                results.errors.push({ file: fileName, error: error.message });
            }
        }

        return results;
    }

    /**
     * Map Excel Row to ERPNext Item Format
     * Supports flexible column mapping including jewelry-specific fields
     * Handles the "final data all in one.xlsx" format with all columns
     */
    mapExcelRowToItem(row, defaultItemGroup) {
        // Flexible column name mapping (case-insensitive, handles spaces/underscores)
        const getValue = (keys) => {
            for (const key of keys) {
                const lowerKey = key.toLowerCase().replace(/[\s_]/g, '').replace(/[^\w]/g, '');
                for (const rowKey in row) {
                    const lowerRowKey = rowKey.toLowerCase().replace(/[\s_]/g, '').replace(/[^\w]/g, '');
                    if (lowerRowKey === lowerKey) {
                        const val = row[rowKey];
                        return val !== null && val !== undefined && val !== '' ? val : null;
                    }
                }
            }
            return null;
        };

        // Extract image URLs from Rendering, Photograph, or Recommended Products columns
        // Supports up to 5 images per product
        const getImages = () => {
            const images = [];
            
            // Priority 1: Rendering column (main product image)
            const rendering = getValue(['Rendering', 'rendering']);
            if (rendering && rendering.trim() && rendering !== 'na' && rendering !== 'NA') {
                images.push(rendering.trim());
            }
            
            // Priority 2: Photograph column
            const photograph = getValue(['Photograph', 'photograph']);
            if (photograph && photograph.trim() && photograph !== 'na' && photograph !== 'NA') {
                const photoUrl = photograph.trim();
                if (!images.includes(photoUrl)) images.push(photoUrl);
            }
            
            // Priority 3: Recommended Products columns (1, 2, 3)
            for (let i = 1; i <= 3; i++) {
                const rec = getValue([
                    `Recommended Products ${i}`, `recommendedproducts${i}`,
                    `${i}`, `Recommended${i}`, `recommended${i}`
                ]);
                if (rec && rec.trim() && rec !== 'na' && rec !== 'NA') {
                    const recUrl = rec.trim();
                    if (!images.includes(recUrl)) images.push(recUrl);
                }
            }
            
            // Priority 4: Image1-5 columns (fallback)
            for (let i = 1; i <= 5; i++) {
                const img = getValue([
                    `Image${i}`, `image${i}`, 
                    `Photo${i}`, `photo${i}`,
                    `Img${i}`, `img${i}`
                ]);
                if (img && img.trim() && img !== 'na' && img !== 'NA') {
                    const imgUrl = img.trim();
                    if (!images.includes(imgUrl) && images.length < 5) images.push(imgUrl);
                }
            }
            
            return images.slice(0, 5); // Limit to 5 images
        };

        // Extract video URL
        const getVideo = () => {
            return getValue(['Video', 'video', 'VideoURL', 'video_url']) || null;
        };

        // Get SKU/Item Code (try multiple variations)
        const itemCode = getValue(['SKU', 'sku', 'Item Code', 'itemcode', 'Siddh Item Code', 'siddhitemcode', 'Manufacturers Item Code', 'manufacturersitemcode']) || '';
        
        // Get Product Title/Name
        const itemName = getValue(['Product Title', 'producttitle', 'Item Name', 'itemname', 'Name', 'name', 'Product Name', 'productname', 'Title', 'title']) || itemCode;
        
        // Get Primary Category (maps to Item Group)
        const primaryCategory = getValue(['Primary Category', 'primarycategory', 'Item Group', 'itemgroup', 'Category', 'category']) || defaultItemGroup;
        
        // Get SubCategory
        const subCategory = getValue(['SubCategory', 'subcategory', 'Sub Category']) || '';
        
        // Get Description
        const description = getValue(['Description', 'description', 'Desc', 'desc']) || '';
        
        // Calculate price from Solitaire/Diamond/Color Stone Price columns
        // Handles the complex structure with separate sections
        const calculatePrice = () => {
            let maxPrice = 0;
            
            // Try Solitaire Price in K (look for "Solitaire" section with "Price in K")
            // The Excel has: Solitaire section with columns: Stone, Color/Clarity, No. of Pcs, Wt in Ct, Price in K
            const solitairePriceK = parseFloat(getValue([
                'Solitaire Price in K', 'solitairepriceink', 
                'Price in K', 'priceink'
            ]) || 0);
            if (solitairePriceK > 0) {
                const price = solitairePriceK * 1000; // Convert K to actual price
                if (price > maxPrice) maxPrice = price;
            }
            
            // Try Diamond Price in K (Diamond section)
            const diamondPriceK = parseFloat(getValue([
                'Diamond Price in K', 'diamondpriceink',
                'Price in K', 'priceink'
            ]) || 0);
            if (diamondPriceK > 0) {
                const price = diamondPriceK * 1000;
                if (price > maxPrice) maxPrice = price;
            }
            
            // Try Color Stone Price (direct price, not in K)
            const colorStonePrice = parseFloat(getValue([
                'Color Stone Price', 'colorstoneprice',
                'Price', 'price'
            ]) || 0);
            if (colorStonePrice > maxPrice) maxPrice = colorStonePrice;
            
            return Math.round(maxPrice);
        };
        
        // Get weight (prefer Net Wt 18Kt, fallback to others)
        // Handles: Gross Wt in Grams (14Kt, 18Kt, 9Kt) and Net Wt in Grams (14Kt, 18Kt, 9Kt)
        const getWeight = () => {
            // Priority 1: Net Wt in Grams - 18Kt (most common)
            const netWt18K = parseFloat(getValue([
                'Net Wt in Grams (18Kt)', 'netwtingrams18kt', 'netwtingrams18',
                '18Kt', '18kt'
            ]) || 0);
            if (netWt18K > 0) return netWt18K;
            
            // Priority 2: Net Wt in Grams - 14Kt
            const netWt14K = parseFloat(getValue([
                'Net Wt in Grams (14Kt)', 'netwtingrams14kt', 'netwtingrams14',
                '14Kt', '14kt'
            ]) || 0);
            if (netWt14K > 0) return netWt14K;
            
            // Priority 3: Net Wt in Grams - 9Kt
            const netWt9K = parseFloat(getValue([
                'Net Wt in Grams (9Kt)', 'netwtingrams9kt', 'netwtingrams9',
                '9Kt', '9kt'
            ]) || 0);
            if (netWt9K > 0) return netWt9K;
            
            // Priority 4: Gross Wt in Grams - 18Kt
            const grossWt18K = parseFloat(getValue([
                'Gross Wt in Grams (18Kt)', 'grosswtingrams18kt', 'grosswtingrams18'
            ]) || 0);
            if (grossWt18K > 0) return grossWt18K;
            
            // Priority 5: Gross Wt in Grams - 14Kt
            const grossWt14K = parseFloat(getValue([
                'Gross Wt in Grams (14Kt)', 'grosswtingrams14kt', 'grosswtingrams14'
            ]) || 0);
            if (grossWt14K > 0) return grossWt14K;
            
            // Priority 6: Gross Wt in Grams - 9Kt
            const grossWt9K = parseFloat(getValue([
                'Gross Wt in Grams (9Kt)', 'grosswtingrams9kt', 'grosswtingrams9'
            ]) || 0);
            
            return grossWt9K || 0;
        };
        
        // Get metal purity from Kt column or infer from weight columns
        const getMetalPurity = () => {
            const kt = getValue(['Kt', 'kt', 'Karat', 'karat']);
            if (kt) {
                const ktNum = parseInt(kt);
                return `${ktNum}K`;
            }
            
            // Infer from which weight column has data
            if (getValue(['18Kt', '18kt']) && parseFloat(getValue(['18Kt', '18kt']) || 0) > 0) return '18K';
            if (getValue(['14Kt', '14kt']) && parseFloat(getValue(['14Kt', '14kt']) || 0) > 0) return '14K';
            if (getValue(['9Kt', '9kt']) && parseFloat(getValue(['9Kt', '9kt']) || 0) > 0) return '9K';
            
            return '';
        };
        
        // Get metal color (YW, RW, White, etc.)
        const getMetalColor = () => {
            const color = getValue(['Color', 'color']);
            if (!color) return 'Gold';
            
            const colorStr = color.toString().toUpperCase();
            if (colorStr.includes('YW') || colorStr.includes('YELLOW')) return 'Yellow Gold';
            if (colorStr.includes('RW') || colorStr.includes('ROSE')) return 'Rose Gold';
            if (colorStr.includes('WHITE') || colorStr === 'W') return 'White Gold';
            if (colorStr.includes('R-Y-W') || colorStr.includes('TWO-TONE')) return 'Two-Tone Gold';
            
            return colorStr;
        };
        
        // Get diamond/solitaire details
        // Handles complex structure: Solitaire, Diamond, and Color Stone sections with multiple sub-columns
        const getDiamondDetails = () => {
            const parts = [];
            
            // Solitaire section - columns: Stone, Color/Clarity, No. of Pcs, Wt in Ct, Price in K
            const solitaireStone = getValue(['Solitaire', 'solitaire', 'Stone', 'stone']);
            if (solitaireStone) {
                const solColorClarity = getValue([
                    'Solitaire Color/Clarity', 'solitairecolorclarity',
                    'Color/Clarity', 'colorclarity'
                ]);
                const solNoOfPcs = getValue([
                    'Solitaire No. of Pcs', 'solitairenoofpcs',
                    'No. of Pcs', 'noofpcs'
                ]);
                const solWtInCt = getValue([
                    'Solitaire Wt in Ct', 'solitairewtinct',
                    'Wt in Ct', 'wtinct'
                ]);
                const solPriceK = getValue([
                    'Solitaire Price in K', 'solitairepriceink',
                    'Price in K', 'priceink'
                ]);
                
                let solDetails = `Solitaire: ${solitaireStone}`;
                if (solColorClarity) solDetails += `, Color/Clarity: ${solColorClarity}`;
                if (solNoOfPcs) solDetails += `, Pcs: ${solNoOfPcs}`;
                if (solWtInCt) solDetails += `, Weight: ${solWtInCt} Ct`;
                if (solPriceK) solDetails += `, Price: ${solPriceK}K`;
                parts.push(solDetails);
            }
            
            // Diamond section - columns: Color/Clarity, No. of Pcs, Wt in Ct, Price in K
            const diamondColorClarity = getValue([
                'Diamond Color/Clarity', 'diamondcolorclarity',
                'Color/Clarity', 'colorclarity'
            ]);
            if (diamondColorClarity) {
                const diaNoOfPcs = getValue([
                    'Diamond No. of Pcs', 'diamondnoofpcs',
                    'No. of Pcs', 'noofpcs'
                ]);
                const diaWtInCt = getValue([
                    'Diamond Wt in Ct', 'diamondwtinct',
                    'Wt in Ct', 'wtinct'
                ]);
                const diaPriceK = getValue([
                    'Diamond Price in K', 'diamondpriceink',
                    'Price in K', 'priceink'
                ]);
                
                let diaDetails = `Diamond: Color/Clarity: ${diamondColorClarity}`;
                if (diaNoOfPcs) diaDetails += `, Pcs: ${diaNoOfPcs}`;
                if (diaWtInCt) diaDetails += `, Weight: ${diaWtInCt} Ct`;
                if (diaPriceK) diaDetails += `, Price: ${diaPriceK}K`;
                parts.push(diaDetails);
            }
            
            // Color Stone section - columns: Color/Description, No. of Pcs, Wt in Ct, Price
            const colorStoneColorDesc = getValue([
                'Color Stone Color/Description', 'colorstonecolordescription',
                'Color/Description', 'colordescription',
                'Color Stone', 'colorstone'
            ]);
            if (colorStoneColorDesc) {
                const csNoOfPcs = getValue([
                    'Color Stone No. of Pcs', 'colorstonenofpcs',
                    'No. of Pcs', 'noofpcs'
                ]);
                const csWtInCt = getValue([
                    'Color Stone Wt in Ct', 'colorstonewtinct',
                    'Wt in Ct', 'wtinct'
                ]);
                const csPrice = getValue([
                    'Color Stone Price', 'colorstoneprice',
                    'Price', 'price'
                ]);
                
                let csDetails = `Color Stone: ${colorStoneColorDesc}`;
                if (csNoOfPcs) csDetails += `, Pcs: ${csNoOfPcs}`;
                if (csWtInCt) csDetails += `, Weight: ${csWtInCt} Ct`;
                if (csPrice) csDetails += `, Price: ${csPrice}`;
                parts.push(csDetails);
            }
            
            // Diamond Shape
            const diamondShape = getValue(['Diamond Shape', 'diamondshape']);
            if (diamondShape) {
                parts.push(`Shape: ${diamondShape}`);
            }
            
            return parts.join(' | ');
        };
        
        // Get lead time (0 if Ready to Ship, otherwise calculate from Make to Order)
        const getLeadTime = () => {
            const readyToShip = getValue(['Ready to Ship', 'readytoship']);
            if (readyToShip && (readyToShip.toString().toLowerCase() === 'yes' || readyToShip === true || readyToShip === 'Yes')) {
                return 0;
            }
            // If Make to Order, default to 15 days
            const makeToOrder = getValue(['Make to Order', 'maketoorder']);
            if (makeToOrder && (makeToOrder.toString().toLowerCase() === 'yes' || makeToOrder === true || makeToOrder === 'Yes')) {
                return 15; // Default MTO lead time
            }
            return 0;
        };
        
        // Get collection
        const collection = getValue(['Collection', 'collection']) || '';
        
        // Get folder name (for image organization)
        const folderName = getValue(['Folder Name', 'foldername']) || '';
        
        // Get quantity
        const quantity = parseInt(getValue(['Quantity', 'quantity']) || 1);
        
        // Get size
        const size = getValue(['Size', 'size']) || '';
        
        // Get diamond shape
        const diamondShape = getValue(['Diamond Shape', 'diamondshape']) || '';

        return {
            item_code: itemCode,
            item_name: itemName,
            item_group: primaryCategory,
            description: description || itemName,
            stock_uom: 'Nos',
            price: calculatePrice(),
            // Custom fields
            custom_brand: getValue(['Brand', 'brand', 'Brand Name', 'brandname']) || 'Diamond Casa',
            custom_metal_type: getMetalColor(),
            custom_metal_purity: getMetalPurity(),
            custom_diamond_type: diamondShape || getValue(['Solitaire', 'solitaire']) || getValue(['Diamond', 'diamond']) || '',
            custom_weight: getWeight(),
            custom_diamond_details: getDiamondDetails(),
            custom_lead_time: getLeadTime(),
            // Additional custom fields for jewelry
            custom_subcategory: subCategory,
            custom_collection: collection,
            custom_folder_name: folderName,
            custom_quantity: quantity,
            custom_size: size,
            custom_ready_to_ship: getValue(['Ready to Ship', 'readytoship']) === 'Yes' || 
                                 getValue(['Ready to Ship', 'readytoship']) === true ||
                                 getValue(['Ready to Ship', 'readytoship'])?.toString().toLowerCase() === 'yes',
            // Images and video
            images: getImages(),
            video: getVideo(),
            image: getImages()[0] || '', // Main image
            // Flags
            is_stock_item: true,
            is_sales_item: true,
            is_purchase_item: false
        };
    }
}

// Initialize ERPNext Integration
const erpnextIntegration = new ERPNextIntegration();

// Export for use in other scripts
window.ERPNextIntegration = erpnextIntegration;
