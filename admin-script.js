// Admin Dashboard JavaScript

// Sample Data
let adminData = {
    products: JSON.parse(localStorage.getItem('adminProducts')) || [],
    orders: JSON.parse(localStorage.getItem('adminOrders')) || [],
    customers: JSON.parse(localStorage.getItem('adminCustomers')) || [],
    categories: JSON.parse(localStorage.getItem('adminCategories')) || [
        { id: 1, name: 'Rings', count: 148, status: 'active' },
        { id: 2, name: 'Earrings', count: 47, status: 'active' },
        { id: 3, name: 'Necklaces', count: 48, status: 'active' },
        { id: 4, name: 'Bracelets', count: 14, status: 'active' },
        { id: 5, name: 'Pendants', count: 14, status: 'active' },
        { id: 6, name: 'Collections', status: 'active' }
    ],
    promotions: JSON.parse(localStorage.getItem('adminPromotions')) || [],
    users: JSON.parse(localStorage.getItem('adminUsers')) || [
        { id: 1, name: 'Admin User', email: 'admin@diamondcasa.in', role: 'Administrator', status: 'active', lastLogin: '2024-01-15' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});

function initializeAdmin() {
    setupLogin();
    setupNavigation();
    setupDashboard();
    setupProducts();
    setupOrders();
    setupCustomers();
    setupCategories();
    setupInventory();
    setupPromotions();
    setupContent();
    setupSettings();
    setupUsers();
    setupModals();
    setupCharts();
    setupERPNext();
    setupPurchaseOrders();
    setupSuppliers();
    setupReturns();
    setupStockTransfers();
}

// Login Functionality
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginPage = document.getElementById('loginPage');
    const adminDashboard = document.getElementById('adminDashboard');

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        // Default admin credentials (in production, this would be server-side authentication)
        const validCredentials = [
            { email: 'admin@diamondcasa.com', password: 'admin123' },
            { email: 'admin', password: 'admin' },
            { email: 'test@diamondcasa.com', password: 'test123' }
        ];

        const isValid = validCredentials.some(cred => 
            cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
        );

        if (isValid || (email && password)) {
            // Allow any email/password for demo purposes, but show message for default credentials
            if (isValid) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
                loginPage.style.display = 'none';
                adminDashboard.style.display = 'flex';
                loadDashboardData();
            } else {
                // For demo: accept any credentials
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
                loginPage.style.display = 'none';
                adminDashboard.style.display = 'flex';
                loadDashboardData();
            }
        } else {
            alert('Please enter email and password');
        }
    });

    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loginPage.style.display = 'none';
        adminDashboard.style.display = 'flex';
        loadDashboardData();
    }

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        loginPage.style.display = 'flex';
        adminDashboard.style.display = 'none';
    });
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');

            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show correct page
            pageContents.forEach(content => content.classList.remove('active'));
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
                pageTitle.textContent = item.querySelector('span').textContent;
            }
        });
    });

    // Mobile menu toggle
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Dashboard
function setupDashboard() {
    updateBadges();
    loadRecentOrders();
    loadTopProducts();
    loadLowStock();
}

function loadDashboardData() {
    updateBadges();
    loadRecentOrders();
    loadTopProducts();
    loadLowStock();
}

function updateBadges() {
    document.getElementById('productsBadge').textContent = adminData.products.length || 0;
    document.getElementById('ordersBadge').textContent = adminData.orders.length || 0;
    document.getElementById('customersBadge').textContent = adminData.customers.length || 0;
}

function loadRecentOrders() {
    const table = document.getElementById('recentOrdersTable');
    if (!table) return;

    const recentOrders = adminData.orders.slice(0, 5);
    if (recentOrders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No orders yet</td></tr>';
        return;
    }

    table.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>₹${order.amount.toLocaleString('en-IN')}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
        </tr>
    `).join('');
}

function loadTopProducts() {
    const list = document.getElementById('topProductsList');
    if (!list) return;

    const topProducts = [
        { name: 'Classic Solitaire Ring', sales: 234, revenue: 116766000 },
        { name: 'Halo Diamond Ring', sales: 189, revenue: 196087500 },
        { name: 'Diamond Necklace', sales: 156, revenue: 161850000 },
        { name: 'Tennis Bracelet', sales: 142, revenue: 132003200 }
    ];

    list.innerHTML = topProducts.map(product => `
        <div class="top-product-item">
            <div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💍</div>
            <div style="flex: 1;">
                <strong>${product.name}</strong>
                <p style="color: #666; font-size: 0.9rem; margin-top: 0.3rem;">${product.sales} sales • ₹${product.revenue.toLocaleString('en-IN')}</p>
            </div>
        </div>
    `).join('');
}

function loadLowStock() {
    const table = document.getElementById('lowStockTable');
    if (!table) return;

    const lowStock = adminData.products.filter(p => p.stock < 10).slice(0, 5);
    if (lowStock.length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem;">All products are well stocked</td></tr>';
        return;
    }

    table.innerHTML = lowStock.map(product => `
        <tr>
            <td>${product.name}</td>
            <td><span style="color: ${product.stock < 5 ? '#f44336' : '#ff9800'}">${product.stock}</span></td>
            <td><button class="btn btn-secondary btn-small">Restock</button></td>
        </tr>
    `).join('');
}

// Products Management
function setupProducts() {
    loadProducts();
    
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
        openProductModal();
    });

    document.getElementById('productSearch')?.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
}

function loadProducts() {
    const table = document.getElementById('productsTable');
    if (!table) return;

    if (adminData.products.length === 0) {
        // Load from main site products if available
        try {
            const mainProducts = JSON.parse(localStorage.getItem('products')) || [];
            adminData.products = mainProducts.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: Math.floor(Math.random() * 50) + 10,
                status: 'active',
                image: '💍'
            }));
            saveAdminData();
        } catch (e) {
            console.error('Error loading products:', e);
        }
    }

    if (adminData.products.length === 0) {
        table.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No products found. Add your first product!</td></tr>';
        return;
    }

    table.innerHTML = adminData.products.map(product => `
        <tr>
            <td><input type="checkbox"></td>
            <td><div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">${product.image || '💍'}</div></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>₹${product.price.toLocaleString('en-IN')}</td>
            <td>${product.stock || 0}</td>
            <td><span class="status-badge ${product.status}">${product.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterProducts(searchTerm) {
    const filtered = adminData.products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Re-render table with filtered results
    // (simplified - in production would use a proper filtering function)
}

function openProductModal() {
    document.getElementById('productModal').classList.add('active');
}

// Orders Management
function setupOrders() {
    loadOrders();
}

function loadOrders() {
    const table = document.getElementById('ordersTable');
    if (!table) return;

    // Sample orders if none exist
    if (adminData.orders.length === 0) {
        adminData.orders = [
        { id: 1001, customer: 'Rajesh Kumar', product: 'Classic Solitaire Ring', amount: 499000, status: 'pending', date: '2024-01-15' },
        { id: 1002, customer: 'Priya Sharma', product: 'Halo Diamond Ring', amount: 1037500, status: 'processing', date: '2024-01-14' },
        { id: 1003, customer: 'Amit Patel', product: 'Diamond Necklace', amount: 1037500, status: 'shipped', date: '2024-01-13' },
        { id: 1004, customer: 'Sneha Reddy', product: 'Tennis Bracelet', amount: 929600, status: 'delivered', date: '2024-01-12' },
        { id: 1005, customer: 'Vikram Singh', product: 'Bridal Collection Set', amount: 2075000, status: 'processing', date: '2024-01-11' }
        ];
        saveAdminData();
    }

    table.innerHTML = adminData.orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>₹${order.amount.toLocaleString('en-IN')}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="viewOrder(${order.id})">View</button>
                <button class="btn btn-secondary btn-small" onclick="updateOrderStatus(${order.id})">Update</button>
            </td>
        </tr>
    `).join('');
}

// Customers Management
function setupCustomers() {
    loadCustomers();
}

function loadCustomers() {
    const table = document.getElementById('customersTable');
    if (!table) return;

    if (adminData.customers.length === 0) {
        adminData.customers = [
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '+91 98765 43210', orders: 5, totalSpent: 2495000, status: 'active' },
        { id: 2, name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43211', orders: 3, totalSpent: 3112500, status: 'active' },
        { id: 3, name: 'Amit Patel', email: 'amit.patel@example.com', phone: '+91 98765 43212', orders: 2, totalSpent: 2075000, status: 'active' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '+91 98765 43213', orders: 4, totalSpent: 3718400, status: 'vip' }
        ];
        saveAdminData();
    }

    table.innerHTML = adminData.customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>₹${customer.totalSpent.toLocaleString('en-IN')}</td>
            <td><span class="status-badge ${customer.status}">${customer.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-small">View</button>
                <button class="btn btn-secondary btn-small">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Categories Management
function setupCategories() {
    loadCategories();
    
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => {
        const name = prompt('Enter category name:');
        if (name) {
            adminData.categories.push({
                id: adminData.categories.length + 1,
                name: name,
                count: 0,
                status: 'active'
            });
            saveAdminData();
            loadCategories();
        }
    });
}

function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = adminData.categories.map(category => `
        <div class="category-card">
            <h3>${category.name}</h3>
            <p>${category.count || 0} Products</p>
            <div>
                <button class="btn btn-secondary btn-small">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteCategory(${category.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Inventory Management
function setupInventory() {
    loadInventory();
}

function loadInventory() {
    const table = document.getElementById('inventoryTable');
    if (!table) return;

    if (adminData.products.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No inventory data</td></tr>';
        return;
    }

    table.innerHTML = adminData.products.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td>SKU-${product.id.toString().padStart(4, '0')}</td>
            <td>${product.stock || 0}</td>
            <td>10</td>
            <td><span class="status-badge ${(product.stock || 0) < 10 ? 'inactive' : 'active'}">${(product.stock || 0) < 10 ? 'Low Stock' : 'In Stock'}</span></td>
            <td>
                <button class="btn btn-secondary btn-small">Update</button>
            </td>
        </tr>
    `).join('');
}

// Promotions Management
function setupPromotions() {
    loadPromotions();
    
    document.getElementById('addPromotionBtn')?.addEventListener('click', () => {
        const name = prompt('Enter promotion name:');
        const discount = prompt('Enter discount percentage:');
        if (name && discount) {
            adminData.promotions.push({
                id: adminData.promotions.length + 1,
                name: name,
                discount: discount,
                status: 'active',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            saveAdminData();
            loadPromotions();
        }
    });
}

function loadPromotions() {
    const grid = document.getElementById('promotionsGrid');
    if (!grid) return;

    if (adminData.promotions.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No promotions. Create your first promotion!</div>';
        return;
    }

    grid.innerHTML = adminData.promotions.map(promo => `
        <div class="promotion-card">
            <h3>${promo.name}</h3>
            <p><strong>Discount:</strong> ${promo.discount}%</p>
            <p><strong>Status:</strong> <span class="status-badge ${promo.status}">${promo.status}</span></p>
            <p><strong>Valid:</strong> ${promo.startDate} to ${promo.endDate}</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary btn-small">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deletePromotion(${promo.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Content Management
function setupContent() {
    const tabBtns = document.querySelectorAll('#contentPage .tab-btn');
    const tabContents = document.querySelectorAll('#contentPage .tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });

    loadBanners();
}

function loadBanners() {
    const table = document.getElementById('bannersTable');
    if (!table) return;

    const banners = [
        { id: 1, title: 'Homepage Hero Banner', status: 'active', position: 1 },
        { id: 2, title: 'Featured Collection Banner', status: 'active', position: 2 }
    ];

    table.innerHTML = banners.map(banner => `
        <tr>
            <td><div style="width: 100px; height: 50px; background: #f0f0f0; border-radius: 5px;"></div></td>
            <td><strong>${banner.title}</strong></td>
            <td><span class="status-badge ${banner.status}">${banner.status}</span></td>
            <td>${banner.position}</td>
            <td>
                <button class="btn btn-secondary btn-small">Edit</button>
                <button class="btn btn-secondary btn-small">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Settings
function setupSettings() {
    const tabBtns = document.querySelectorAll('#settingsPage .tab-btn');
    const tabContents = document.querySelectorAll('#settingsPage .tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });
}

// Users Management
function setupUsers() {
    loadUsers();
    
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        const name = prompt('Enter user name:');
        const email = prompt('Enter email:');
        const role = prompt('Enter role (Administrator/Manager/Staff):');
        if (name && email && role) {
            adminData.users.push({
                id: adminData.users.length + 1,
                name: name,
                email: email,
                role: role,
                status: 'active',
                lastLogin: 'Never'
            });
            saveAdminData();
            loadUsers();
        }
    });
}

function loadUsers() {
    const table = document.getElementById('usersTable');
    if (!table) return;

    table.innerHTML = adminData.users.map(user => `
        <tr>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>${user.lastLogin}</td>
            <td>
                <button class="btn btn-secondary btn-small">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Modals
function setupModals() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Charts
function setupCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [996000, 1577000, 1245000, 2075000, 1826000, 2490000, 2324000],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: [20335000, 23987000, 25896000, 24734000, 28635000, 31374000],
                    backgroundColor: '#d4af37'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Rings', 'Earrings', 'Necklaces', 'Bracelets'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#d4af37', '#9c27b0', '#2196f3', '#4caf50']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Utility Functions
function saveAdminData() {
    localStorage.setItem('adminProducts', JSON.stringify(adminData.products));
    localStorage.setItem('adminOrders', JSON.stringify(adminData.orders));
    localStorage.setItem('adminCustomers', JSON.stringify(adminData.customers));
    localStorage.setItem('adminCategories', JSON.stringify(adminData.categories));
    localStorage.setItem('adminPromotions', JSON.stringify(adminData.promotions));
    localStorage.setItem('adminUsers', JSON.stringify(adminData.users));
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        adminData.products = adminData.products.filter(p => p.id !== id);
        saveAdminData();
        loadProducts();
    }
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        adminData.categories = adminData.categories.filter(c => c.id !== id);
        saveAdminData();
        loadCategories();
    }
}

function deletePromotion(id) {
    if (confirm('Are you sure you want to delete this promotion?')) {
        adminData.promotions = adminData.promotions.filter(p => p.id !== id);
        saveAdminData();
        loadPromotions();
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        adminData.users = adminData.users.filter(u => u.id !== id);
        saveAdminData();
        loadUsers();
    }
}

function editProduct(id) {
    openProductModal();
    // Load product data into form
}

function viewOrder(id) {
    alert(`View order #${id} details`);
}

function updateOrderStatus(id) {
    const status = prompt('Enter new status (pending/processing/shipped/delivered/cancelled):');
    if (status) {
        const order = adminData.orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            saveAdminData();
            loadOrders();
        }
    }
}

// Add small button style
const style = document.createElement('style');
style.textContent = `
    .btn-small {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(style);

// ERPNext Integration Setup
function setupERPNext() {
    loadERPNextConfig();
    loadIntegrationLogs();
    loadErrorLogs();
    updateIntegrationStatus();

    // Configuration
    document.getElementById('saveErpnextConfigBtn')?.addEventListener('click', saveERPNextConfig);
    document.getElementById('erpnextEnabled')?.addEventListener('change', toggleERPNext);
    
    // Sync buttons
    document.getElementById('syncProductsBtn')?.addEventListener('click', () => syncERPNextProducts());
    document.getElementById('syncInventoryBtn')?.addEventListener('click', () => syncERPNextInventory());
    document.getElementById('syncAllBtn')?.addEventListener('click', () => syncAllERPNext());
    document.getElementById('testConnectionBtn')?.addEventListener('click', () => testERPNextConnection());
    document.getElementById('clearLogsBtn')?.addEventListener('click', () => clearIntegrationLogs());
    
    // Bulk import
    document.getElementById('bulkImportBtn')?.addEventListener('click', () => startBulkImport());
    
    // Excel upload
    setupExcelUpload();

    // Auto-refresh status every 30 seconds
    setInterval(updateIntegrationStatus, 30000);
}

function loadERPNextConfig() {
    if (!window.ERPNextIntegration) return;

    const config = window.ERPNextIntegration.config;
    document.getElementById('erpnextApiUrl').value = config.apiUrl || '';
    document.getElementById('erpnextApiKey').value = config.apiKey || '';
    document.getElementById('erpnextApiSecret').value = config.apiSecret || '';
    document.getElementById('erpnextUser').value = config.integrationUser || '';
    document.getElementById('erpnextEnabled').checked = config.enabled || false;
}

function saveERPNextConfig() {
    if (!window.ERPNextIntegration) {
        alert('ERPNext Integration module not loaded');
        return;
    }

    const apiUrl = document.getElementById('erpnextApiUrl').value.trim();
    const apiKey = document.getElementById('erpnextApiKey').value.trim();
    const apiSecret = document.getElementById('erpnextApiSecret').value.trim();
    const integrationUser = document.getElementById('erpnextUser').value.trim();

    // Validate URL format
    if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        alert('⚠️ API URL must start with http:// or https://\n\nExample: https://diamondcasa.frappe.cloud');
        return;
    }

    // Remove trailing slash from URL
    const cleanApiUrl = apiUrl.replace(/\/$/, '');

    // Validate credentials
    if (apiUrl && (!apiKey || !apiSecret)) {
        alert('⚠️ Please enter both API Key and API Secret');
        return;
    }

    const config = {
        apiUrl: cleanApiUrl,
        apiKey: apiKey,
        apiSecret: apiSecret,
        integrationUser: integrationUser || 'integration@diamondcasa.in',
        enabled: document.getElementById('erpnextEnabled').checked
    };

    window.ERPNextIntegration.updateConfig(config);
    alert('✅ Configuration saved successfully!\n\nClick "Test Connection" to verify your credentials.');
    updateIntegrationStatus();
}

function toggleERPNext() {
    const enabled = document.getElementById('erpnextEnabled').checked;
    if (window.ERPNextIntegration) {
        window.ERPNextIntegration.updateConfig({ enabled: enabled });
        updateIntegrationStatus();
    }
}

async function syncERPNextProducts() {
    if (!window.ERPNextIntegration) return;

    const btn = document.getElementById('syncProductsBtn');
    btn.disabled = true;
    btn.textContent = 'Syncing...';

    try {
        await window.ERPNextIntegration.syncProducts();
        alert('Products synced successfully!');
        loadIntegrationLogs();
    } catch (error) {
        alert('Error syncing products: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sync Products';
        updateIntegrationStatus();
    }
}

async function syncERPNextInventory() {
    if (!window.ERPNextIntegration) return;

    const btn = document.getElementById('syncInventoryBtn');
    btn.disabled = true;
    btn.textContent = 'Syncing...';

    try {
        await window.ERPNextIntegration.syncInventory();
        alert('Inventory synced successfully!');
        loadIntegrationLogs();
    } catch (error) {
        alert('Error syncing inventory: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sync Inventory';
        updateIntegrationStatus();
    }
}

async function syncAllERPNext() {
    if (!window.ERPNextIntegration) return;

    const btn = document.getElementById('syncAllBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';

    try {
        await Promise.all([
            window.ERPNextIntegration.syncProducts(),
            window.ERPNextIntegration.syncInventory()
        ]);
        alert('All data synced successfully!');
        loadIntegrationLogs();
    } catch (error) {
        alert('Error during sync: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync"></i> Sync All';
        updateIntegrationStatus();
    }
}

async function testERPNextConnection() {
    if (!window.ERPNextIntegration) {
        alert('ERPNext Integration module not loaded. Please refresh the page.');
        return;
    }

    const btn = document.getElementById('testConnectionBtn');
    const apiUrl = document.getElementById('erpnextApiUrl').value.trim();
    const apiKey = document.getElementById('erpnextApiKey').value.trim();
    const apiSecret = document.getElementById('erpnextApiSecret').value.trim();

    if (!apiUrl || !apiKey || !apiSecret) {
        alert('⚠️ Please enter all required fields:\n\n- ERPNext API URL\n- API Key\n- API Secret\n\nClick "Save Configuration" first, then test connection.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing Connection...';

    try {
        // Temporarily update config for testing
        const originalConfig = { ...window.ERPNextIntegration.config };
        window.ERPNextIntegration.config.apiUrl = apiUrl;
        window.ERPNextIntegration.config.apiKey = apiKey;
        window.ERPNextIntegration.config.apiSecret = apiSecret;
        window.ERPNextIntegration.config.enabled = true; // Temporarily enable for test

        const result = await window.ERPNextIntegration.testConnection();
        
        if (result.success) {
            alert('✅ Connection Successful!\n\n' +
                  'ERPNext is reachable and credentials are valid.\n\n' +
                  'You can now:\n' +
                  '1. Enable integration (toggle switch)\n' +
                  '2. Upload products from Excel\n' +
                  '3. Sync products to website');
        } else {
            alert('❌ Connection Failed\n\n' +
                  (result.message || result.error || 'Unknown error') + '\n\n' +
                  'Please check:\n' +
                  '• API URL is correct and accessible\n' +
                  '• API Key and Secret are valid\n' +
                  '• ERPNext instance is running\n' +
                  '• User has proper permissions\n' +
                  '• Network connection is working');
        }
    } catch (error) {
        alert('❌ Connection Error\n\n' +
              error.message + '\n\n' +
              'Please check:\n' +
              '• API URL is accessible (try opening in browser)\n' +
              '• Network connection\n' +
              '• ERPNext instance is running\n' +
              '• CORS settings allow API access');
    } finally {
        // Restore original config
        if (window.ERPNextIntegration && originalConfig) {
            window.ERPNextIntegration.config = originalConfig;
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
    }
}

function updateIntegrationStatus() {
    if (!window.ERPNextIntegration) return;

    const status = window.ERPNextIntegration.getStatus();
    
    document.getElementById('integrationStatus').textContent = status.enabled ? 'Enabled' : 'Disabled';
    document.getElementById('integrationStatus').style.color = status.enabled ? '#4caf50' : '#f44336';
    
    document.getElementById('lastProductSync').textContent = status.lastProductSync 
        ? new Date(status.lastProductSync).toLocaleString() 
        : 'Never';
    
    document.getElementById('lastInventorySync').textContent = status.lastInventorySync 
        ? new Date(status.lastInventorySync).toLocaleString() 
        : 'Never';
    
    document.getElementById('lastOrderSync').textContent = status.lastOrderSync 
        ? new Date(status.lastOrderSync).toLocaleString() 
        : 'Never';
    
    if (status.syncInProgress) {
        document.getElementById('syncInProgress').style.display = 'inline';
    } else {
        document.getElementById('syncInProgress').style.display = 'none';
    }
}

function loadIntegrationLogs() {
    if (!window.ERPNextIntegration) return;

    const table = document.getElementById('integrationLogsTable');
    if (!table) return;

    const logs = window.ERPNextIntegration.integrationLogs.slice(0, 50); // Last 50 logs

    if (logs.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No logs yet</td></tr>';
        return;
    }

    table.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td><span class="status-badge ${log.level === 'success' ? 'active' : 'inactive'}">${log.level}</span></td>
            <td>${log.method}</td>
            <td>${log.endpoint}</td>
            <td>${log.response?.error ? 'Failed' : 'Success'}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="showLogDetails('${log.timestamp}')">View</button>
            </td>
        </tr>
    `).join('');
}

function loadErrorLogs() {
    if (!window.ERPNextIntegration) return;

    const table = document.getElementById('errorLogsTable');
    if (!table) return;

    const errors = window.ERPNextIntegration.syncStatus.errors.slice(-10); // Last 10 errors

    if (errors.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No errors</td></tr>';
        return;
    }

    table.innerHTML = errors.map(error => `
        <tr>
            <td>${new Date(error.timestamp).toLocaleString()}</td>
            <td>${error.type}</td>
            <td style="color: #f44336;">${error.error}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="retrySync('${error.type}')">Retry</button>
            </td>
        </tr>
    `).join('');
}

function showLogDetails(timestamp) {
    if (!window.ERPNextIntegration) return;

    const log = window.ERPNextIntegration.integrationLogs.find(l => l.timestamp === timestamp);
    if (log) {
        alert(`Log Details:\n\nMethod: ${log.method}\nEndpoint: ${log.endpoint}\nRequest: ${JSON.stringify(log.request, null, 2)}\nResponse: ${JSON.stringify(log.response, null, 2)}`);
    }
}

function retrySync(type) {
    if (type === 'product_sync') {
        syncERPNextProducts();
    } else if (type === 'inventory_sync') {
        syncERPNextInventory();
    }
}

function clearIntegrationLogs() {
    if (confirm('Are you sure you want to clear all integration logs?')) {
        if (window.ERPNextIntegration) {
            window.ERPNextIntegration.integrationLogs = [];
            localStorage.setItem('erpnext_logs', JSON.stringify([]));
            loadIntegrationLogs();
        }
    }
}

// Purchase Orders Management
function setupPurchaseOrders() {
    loadPurchaseOrders();
    document.getElementById('addPurchaseOrderBtn')?.addEventListener('click', openPurchaseOrderModal);
}

function loadPurchaseOrders() {
    const table = document.getElementById('purchaseOrdersTable');
    if (!table) return;

    // Load from ERPNext if enabled
    if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
        window.ERPNextIntegration.getPurchaseOrders().then(orders => {
            if (orders && orders.length > 0) {
                table.innerHTML = orders.map(po => `
                    <tr>
                        <td>${po.name}</td>
                        <td>${po.supplier}</td>
                        <td>${new Date(po.transaction_date).toLocaleDateString()}</td>
                        <td>${po.items?.length || 0} items</td>
                        <td>₹${(po.grand_total || 0).toLocaleString('en-IN')}</td>
                        <td><span class="status-badge status-${po.status?.toLowerCase()}">${po.status || 'Draft'}</span></td>
                        <td>
                            <button class="btn-icon" onclick="viewPurchaseOrder('${po.name}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                table.innerHTML = '<tr><td colspan="7" class="text-center">No purchase orders found</td></tr>';
            }
        }).catch(err => {
            console.error('Error loading purchase orders:', err);
            table.innerHTML = '<tr><td colspan="7" class="text-center">Error loading purchase orders</td></tr>';
        });
    } else {
        // Load from local storage
        const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
        if (purchaseOrders.length === 0) {
            table.innerHTML = '<tr><td colspan="7" class="text-center">No purchase orders found</td></tr>';
        } else {
            table.innerHTML = purchaseOrders.map(po => `
                <tr>
                    <td>${po.number}</td>
                    <td>${po.supplier}</td>
                    <td>${new Date(po.date).toLocaleDateString()}</td>
                    <td>${po.items.length} items</td>
                    <td>₹${po.total.toLocaleString('en-IN')}</td>
                    <td><span class="status-badge status-${po.status.toLowerCase()}">${po.status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="viewPurchaseOrder('${po.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

async function openPurchaseOrderModal() {
    // Load suppliers first
    const suppliers = await loadSuppliersForSelect();
    // Open modal (implementation would go here)
    alert('Purchase Order modal - Implementation in progress');
}

// Suppliers Management
function setupSuppliers() {
    loadSuppliers();
    document.getElementById('addSupplierBtn')?.addEventListener('click', openSupplierModal);
}

async function loadSuppliers() {
    const table = document.getElementById('suppliersTable');
    if (!table) return;

    try {
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            const suppliers = await window.ERPNextIntegration.getSuppliers();
            if (suppliers && suppliers.length > 0) {
                table.innerHTML = suppliers.map(supplier => `
                    <tr>
                        <td>${supplier.supplier_name || supplier.name}</td>
                        <td>${supplier.supplier_name || 'N/A'}</td>
                        <td>${supplier.email_id || 'N/A'}</td>
                        <td>${supplier.mobile_no || 'N/A'}</td>
                        <td>${supplier.supplier_type || 'Company'}</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>
                            <button class="btn-icon" onclick="viewSupplier('${supplier.name}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" onclick="editSupplier('${supplier.name}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                table.innerHTML = '<tr><td colspan="7" class="text-center">No suppliers found</td></tr>';
            }
        } else {
            // Load from local storage
            const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
            if (suppliers.length === 0) {
                table.innerHTML = '<tr><td colspan="7" class="text-center">No suppliers found</td></tr>';
            } else {
                table.innerHTML = suppliers.map(supplier => `
                    <tr>
                        <td>${supplier.name}</td>
                        <td>${supplier.contactPerson || 'N/A'}</td>
                        <td>${supplier.email || 'N/A'}</td>
                        <td>${supplier.phone || 'N/A'}</td>
                        <td>${supplier.type || 'Company'}</td>
                        <td><span class="status-badge status-${supplier.status || 'active'}">${supplier.status || 'Active'}</span></td>
                        <td>
                            <button class="btn-icon" onclick="viewSupplier('${supplier.id}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" onclick="editSupplier('${supplier.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading suppliers:', error);
        table.innerHTML = '<tr><td colspan="7" class="text-center">Error loading suppliers</td></tr>';
    }
}

async function loadSuppliersForSelect() {
    if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
        return await window.ERPNextIntegration.getSuppliers();
    }
    return JSON.parse(localStorage.getItem('suppliers')) || [];
}

function openSupplierModal() {
    alert('Supplier modal - Implementation in progress');
}

// Returns & Refunds Management
function setupReturns() {
    loadReturns();
    document.getElementById('returnStatusFilter')?.addEventListener('change', (e) => {
        loadReturns(e.target.value);
    });
}

function loadReturns(statusFilter = 'all') {
    const table = document.getElementById('returnsTable');
    if (!table) return;

    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    let filteredReturns = returns;

    if (statusFilter !== 'all') {
        filteredReturns = returns.filter(r => r.status === statusFilter);
    }

    if (filteredReturns.length === 0) {
        table.innerHTML = '<tr><td colspan="8" class="text-center">No returns found</td></tr>';
        return;
    }

    table.innerHTML = filteredReturns.map(ret => `
        <tr>
            <td>#${ret.id}</td>
            <td>#${ret.orderId}</td>
            <td>${ret.customerName || ret.customerEmail}</td>
            <td>${ret.items.length} item(s)</td>
            <td>${ret.reason}</td>
            <td>₹${ret.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN')}</td>
            <td><span class="status-badge status-${ret.status.toLowerCase()}">${ret.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewReturn(${ret.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                ${ret.status === 'Pending' ? `
                    <button class="btn-icon" onclick="approveReturn(${ret.id})" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon" onclick="rejectReturn(${ret.id})" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function viewReturn(returnId) {
    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const returnData = returns.find(r => r.id === returnId);
    if (returnData) {
        alert(`Return #${returnData.id}\nOrder: #${returnData.orderId}\nReason: ${returnData.reason}\nStatus: ${returnData.status}\nItems: ${returnData.items.map(i => `${i.name} x${i.quantity}`).join(', ')}`);
    }
}

async function approveReturn(returnId) {
    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const returnData = returns.find(r => r.id === returnId);
    
    if (returnData) {
        returnData.status = 'Approved';
        localStorage.setItem('returns', JSON.stringify(returns));

        // Sync to ERPNext
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            try {
                await window.ERPNextIntegration.createReturnRequest(returnData);
            } catch (err) {
                console.error('ERPNext sync error:', err);
            }
        }

        loadReturns();
        alert('Return approved successfully!');
    }
}

function rejectReturn(returnId) {
    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const returnData = returns.find(r => r.id === returnId);
    
    if (returnData) {
        returnData.status = 'Rejected';
        localStorage.setItem('returns', JSON.stringify(returns));
        loadReturns();
        alert('Return rejected');
    }
}

// Stock Transfers Management
function setupStockTransfers() {
    loadStockTransfers();
    document.getElementById('newStockTransferBtn')?.addEventListener('click', openStockTransferModal);
}

function loadStockTransfers() {
    const table = document.getElementById('stockTransfersTable');
    if (!table) return;

    const transfers = JSON.parse(localStorage.getItem('stockTransfers')) || [];
    
    if (transfers.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center">No stock transfers found</td></tr>';
        return;
    }

    table.innerHTML = transfers.map(transfer => `
        <tr>
            <td>#${transfer.id}</td>
            <td>${transfer.fromWarehouse}</td>
            <td>${transfer.toWarehouse}</td>
            <td>${transfer.items.length} item(s)</td>
            <td>${new Date(transfer.date).toLocaleDateString()}</td>
            <td><span class="status-badge status-${transfer.status.toLowerCase()}">${transfer.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewStockTransfer(${transfer.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function openStockTransferModal() {
    // Implementation for stock transfer modal
    alert('Stock Transfer modal - Implementation in progress');
}

function viewStockTransfer(transferId) {
    const transfers = JSON.parse(localStorage.getItem('stockTransfers')) || [];
    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
        alert(`Stock Transfer #${transfer.id}\nFrom: ${transfer.fromWarehouse}\nTo: ${transfer.toWarehouse}\nItems: ${transfer.items.map(i => `${i.itemCode} x${i.quantity}`).join(', ')}\nStatus: ${transfer.status}`);
    }
}

function viewPurchaseOrder(poId) {
    alert(`View Purchase Order: ${poId}`);
}

function viewSupplier(supplierId) {
    alert(`View Supplier: ${supplierId}`);
}

function editSupplier(supplierId) {
    alert(`Edit Supplier: ${supplierId}`);
}

// Bulk Product Import
async function startBulkImport() {
    if (!window.ERPNextIntegration) {
        alert('ERPNext Integration module not loaded');
        return;
    }

    if (!window.ERPNextIntegration.config.enabled) {
        alert('Please enable ERPNext integration first');
        return;
    }

    const itemGroup = document.getElementById('bulkImportItemGroup').value;
    const limitInput = document.getElementById('bulkImportLimit').value;
    const limit = limitInput ? parseInt(limitInput) : null;
    const updateExisting = document.getElementById('bulkImportUpdateExisting').checked;

    const importBtn = document.getElementById('bulkImportBtn');
    const progressDiv = document.getElementById('bulkImportProgress');
    const progressBar = document.getElementById('bulkImportProgressBar');
    const statusText = document.getElementById('bulkImportStatus');
    const resultDiv = document.getElementById('bulkImportResult');

    // Disable button and show progress
    importBtn.disabled = true;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing...';
    progressDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    progressBar.style.width = '0%';

    try {
        const result = await window.ERPNextIntegration.bulkImportProducts({
            itemGroup: itemGroup,
            limit: limit,
            updateExisting: updateExisting,
            onProgress: (progress) => {
                const percentage = Math.round((progress.current / progress.total) * 100);
                progressBar.style.width = percentage + '%';
                statusText.textContent = progress.status || `Processing ${progress.current} of ${progress.total}...`;
            }
        });

        // Show success result
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="color: #155724; background: #d4edda; padding: 1rem; border-radius: 6px; border: 1px solid #c3e6cb;">
                <h4 style="margin: 0 0 0.5rem 0; color: #155724;">
                    <i class="fas fa-check-circle"></i> Import Successful!
                </h4>
                <p style="margin: 0.5rem 0;"><strong>Products Imported:</strong> ${result.imported}</p>
                <p style="margin: 0.5rem 0;"><strong>With Images:</strong> ${result.withImages}</p>
                <p style="margin: 0.5rem 0;"><strong>With Videos:</strong> ${result.withVideos}</p>
            </div>
        `;

        // Refresh products page if on it
        if (document.getElementById('productsPage')?.classList.contains('active')) {
            loadProducts();
        }

        alert(`Bulk import completed successfully!\n\nImported: ${result.imported} products\nWith Images: ${result.withImages}\nWith Videos: ${result.withVideos}`);
    } catch (error) {
        console.error('Bulk import error:', error);
        
        // Show error result
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="color: #721c24; background: #f8d7da; padding: 1rem; border-radius: 6px; border: 1px solid #f5c6cb;">
                <h4 style="margin: 0 0 0.5rem 0; color: #721c24;">
                    <i class="fas fa-exclamation-circle"></i> Import Failed
                </h4>
                <p style="margin: 0;">${error.message || 'Unknown error occurred'}</p>
            </div>
        `;

        alert('Bulk import failed: ' + error.message);
    } finally {
        // Re-enable button
        importBtn.disabled = false;
        importBtn.innerHTML = '<i class="fas fa-download"></i> Start Bulk Import';
        progressBar.style.width = '100%';
        statusText.textContent = 'Import complete!';
    }
}

// Excel Upload Setup
function setupExcelUpload() {
    const fileInput = document.getElementById('excelFileInput');
    const uploadBtn = document.getElementById('uploadExcelBtn');
    
    if (!fileInput || !uploadBtn) return;

    // Enable upload button when file is selected
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadBtn.disabled = false;
            previewExcelFile(e.target.files[0]);
        } else {
            uploadBtn.disabled = true;
        }
    });

    // Preview button
    const previewBtn = document.getElementById('previewExcelBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            if (fileInput.files.length > 0) {
                previewExcelFile(fileInput.files[0]);
            } else {
                alert('Please select an Excel file first');
            }
        });
    }

    // Upload button click with confirmation
    uploadBtn.addEventListener('click', () => {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            if (confirm(`Ready to upload all products from "${fileName}"?\n\nThis will:\n- Create/update products in ERPNext\n- Upload images and videos\n- Sync products to website\n\nEstimated time: 10-30 minutes\n\nContinue?`)) {
                uploadExcelToERPNext(fileInput.files[0]);
            }
        }
    });
}

// Preview Excel File
function previewExcelFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            // Show preview
            const previewDiv = document.getElementById('excelPreview');
            const previewTable = document.getElementById('excelPreviewTable');
            
            if (jsonData.length > 0) {
                previewDiv.style.display = 'block';
                
                // Get headers
                const headers = Object.keys(jsonData[0]);
                const previewRows = jsonData.slice(0, 5); // First 5 rows
                
                previewTable.innerHTML = `
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${previewRows.map(row => `
                            <tr>
                                ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                `;
            }
        } catch (error) {
            console.error('Error previewing Excel:', error);
            alert('Error reading Excel file: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Upload Excel to ERPNext
async function uploadExcelToERPNext(file) {
    if (!window.ERPNextIntegration) {
        alert('ERPNext Integration module not loaded');
        return;
    }

    if (!window.ERPNextIntegration.config.enabled) {
        alert('Please enable ERPNext integration first');
        return;
    }

    const updateExisting = document.getElementById('excelUpdateExisting').checked;
    const createPriceList = document.getElementById('excelCreatePriceList').checked;
    const defaultItemGroup = document.getElementById('excelDefaultItemGroup').value;

    const uploadBtn = document.getElementById('uploadExcelBtn');
    const progressDiv = document.getElementById('excelUploadProgress');
    const progressBar = document.getElementById('excelUploadProgressBar');
    const statusText = document.getElementById('excelUploadStatus');
    const resultDiv = document.getElementById('excelUploadResult');

    // Disable button and show progress
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    progressDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    progressBar.style.width = '0%';

    try {
        // Read Excel file
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                if (jsonData.length === 0) {
                    throw new Error('Excel file is empty or has no data');
                }

                statusText.textContent = `Found ${jsonData.length} rows. Starting upload...`;

                // Upload to ERPNext
                let mediaUploadCount = 0;
                const result = await window.ERPNextIntegration.bulkUploadItemsFromExcel(jsonData, {
                    updateExisting: updateExisting,
                    createPriceList: createPriceList,
                    defaultItemGroup: defaultItemGroup,
                    onProgress: (progress) => {
                        const percentage = Math.round((progress.current / progress.total) * 100);
                        progressBar.style.width = percentage + '%';
                        
                        // Enhanced status message
                        let statusMsg = progress.status || `Processing ${progress.current} of ${progress.total}...`;
                        if (progress.status && (progress.status.includes('media') || progress.status.includes('image') || progress.status.includes('video'))) {
                            statusMsg += ' (Uploading media files...)';
                        }
                        statusText.textContent = statusMsg;
                    }
                });

                // Automatically sync products to website after successful upload
                if (result.created > 0 || result.updated > 0) {
                    statusText.textContent = `Upload complete! Syncing ${result.created + result.updated} products to website...`;
                    progressBar.style.width = '95%';
                    
                    try {
                        const syncedProducts = await window.ERPNextIntegration.syncProducts();
                        statusText.textContent = `✅ Upload and sync complete! ${syncedProducts.length} products are now live on the website.`;
                        progressBar.style.width = '100%';
                        progressBar.style.background = '#4caf50';
                    } catch (syncError) {
                        console.warn('Auto-sync after upload failed:', syncError);
                        statusText.textContent = 'Upload complete! (Note: Click "Sync Products" manually to sync to website)';
                        progressBar.style.background = '#ff9800';
                    }
                }

                // Show results
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div style="color: #155724; background: #d4edda; padding: 1rem; border-radius: 6px; border: 1px solid #c3e6cb;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #155724;">
                            <i class="fas fa-check-circle"></i> Upload Complete!
                        </h4>
                        <p style="margin: 0.5rem 0;"><strong>Total Rows:</strong> ${result.total}</p>
                        <p style="margin: 0.5rem 0;"><strong>Created:</strong> ${result.created}</p>
                        <p style="margin: 0.5rem 0;"><strong>Updated:</strong> ${result.updated}</p>
                        <p style="margin: 0.5rem 0;"><strong>Failed:</strong> ${result.failed}</p>
                        <p style="margin: 0.5rem 0; color: #0c5460;">
                            <i class="fas fa-images"></i> <strong>Media:</strong> Images and videos are automatically uploaded from Excel URLs (Rendering, Photograph, Recommended Products 1-3, Video columns)
                        </p>
                        ${result.errors.length > 0 ? `
                            <details style="margin-top: 1rem;">
                                <summary style="cursor: pointer; font-weight: 600;">View Errors (${result.errors.length})</summary>
                                <div style="margin-top: 0.5rem; max-height: 200px; overflow-y: auto;">
                                    ${result.errors.map(err => `
                                        <div style="padding: 0.5rem; background: #fff; margin: 0.25rem 0; border-radius: 4px;">
                                            <strong>Row ${err.row}</strong>${err.item_code ? ` (${err.item_code})` : ''}: ${err.error}
                                        </div>
                                    `).join('')}
                                </div>
                            </details>
                        ` : ''}
                    </div>
                `;

                alert(`Upload completed!\n\nCreated: ${result.created}\nUpdated: ${result.updated}\nFailed: ${result.failed}`);

            } catch (error) {
                console.error('Error processing Excel:', error);
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div style="color: #721c24; background: #f8d7da; padding: 1rem; border-radius: 6px; border: 1px solid #f5c6cb;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #721c24;">
                            <i class="fas fa-exclamation-circle"></i> Upload Failed
                        </h4>
                        <p style="margin: 0;">${error.message || 'Unknown error occurred'}</p>
                    </div>
                `;
                alert('Upload failed: ' + error.message);
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload All Products to ERPNext';
                // Keep progress visible to show results
                if (!resultDiv || resultDiv.style.display === 'none' || !resultDiv.innerHTML) {
                    progressDiv.style.display = 'none';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file: ' + error.message);
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload All Products to ERPNext';
    }
}

console.log('Admin Dashboard loaded successfully!');
