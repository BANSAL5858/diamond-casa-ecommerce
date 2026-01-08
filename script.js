// Product Data - Indian Market (Prices in INR ₹)
const products = [
    // Rings
    { id: 1, name: "Classic Solitaire Ring", brand: "BVLGARI", category: "rings", metal: "gold", diamond: "solitaire", price: 499000, readyToShip: true, description: "A timeless solitaire diamond ring in elegant gold setting. Perfect for engagements and special occasions." },
    { id: 2, name: "Halo Diamond Ring", brand: "Cartier", category: "rings", metal: "platinum", diamond: "halo", price: 1037500, readyToShip: true, description: "Stunning halo design with center diamond surrounded by smaller stones. Exquisite craftsmanship." },
    { id: 3, name: "Vintage Engagement Ring", brand: "Chaumet", category: "rings", metal: "rose-gold", diamond: "vintage", price: 738700, readyToShip: false, description: "Vintage-inspired design with intricate details. Made to order with 15-20 days delivery." },
    { id: 4, name: "Modern Eternity Ring", brand: "Van Cleef & Arpels", category: "rings", metal: "platinum", diamond: "modern", price: 560250, readyToShip: true, description: "Contemporary eternity ring with continuous diamonds. Symbol of eternal love." },
    
    // Earrings
    { id: 5, name: "Diamond Stud Earrings", brand: "BVLGARI", category: "earrings", metal: "platinum", diamond: "solitaire", price: 373500, readyToShip: true, description: "Classic diamond stud earrings in platinum. Timeless elegance for everyday wear." },
    { id: 6, name: "Drop Earrings", brand: "Cartier", category: "earrings", metal: "gold", diamond: "halo", price: 929600, readyToShip: true, description: "Elegant drop earrings with halo diamond design. Perfect for special occasions." },
    { id: 7, name: "Hoop Earrings", brand: "Hermès", category: "earrings", metal: "gold", diamond: "modern", price: 315400, readyToShip: false, description: "Modern diamond hoop earrings. Contemporary design with traditional craftsmanship." },
    { id: 8, name: "Chandelier Earrings", brand: "Van Cleef & Arpels", category: "earrings", metal: "platinum", diamond: "vintage", price: 1311400, readyToShip: true, description: "Luxurious chandelier earrings with vintage design. Statement piece for grand events." },
    
    // Pendants
    { id: 9, name: "Heart Pendant", brand: "Cartier", category: "pendants", metal: "gold", diamond: "solitaire", price: 265600, readyToShip: true, description: "Romantic heart-shaped pendant with diamond. Express your love with this beautiful piece." },
    { id: 10, name: "Cross Pendant", brand: "BVLGARI", category: "pendants", metal: "platinum", diamond: "halo", price: 398400, readyToShip: true, description: "Elegant cross pendant with halo diamonds. Spiritual and elegant design." },
    { id: 11, name: "Initial Pendant", brand: "Chaumet", category: "pendants", metal: "rose-gold", diamond: "modern", price: 240700, readyToShip: false, description: "Personalized initial pendant in rose gold. Customizable with your initial." },
    
    // Necklaces
    { id: 12, name: "Diamond Necklace", brand: "Cartier", category: "necklaces", metal: "platinum", diamond: "solitaire", price: 1037500, readyToShip: true, description: "Stunning diamond necklace with center stone. Perfect for weddings and celebrations." },
    { id: 13, name: "Tennis Necklace", brand: "BVLGARI", category: "necklaces", metal: "platinum", diamond: "modern", price: 1568700, readyToShip: true, description: "Classic tennis necklace with continuous diamonds. Luxurious and elegant." },
    { id: 14, name: "Choker Necklace", brand: "Van Cleef & Arpels", category: "necklaces", metal: "gold", diamond: "halo", price: 1261600, readyToShip: false, description: "Elegant choker with halo diamond design. Modern yet traditional." },
    { id: 15, name: "Lariat Necklace", brand: "Hermès", category: "necklaces", metal: "rose-gold", diamond: "vintage", price: 813400, readyToShip: true, description: "Vintage-inspired lariat necklace. Unique and sophisticated design." },
    
    // Bracelets
    { id: 16, name: "Tennis Bracelet", brand: "Cartier", category: "bracelets", metal: "platinum", diamond: "modern", price: 929600, readyToShip: true, description: "Classic tennis bracelet with continuous diamonds. Timeless elegance." },
    { id: 17, name: "Bangle Bracelet", brand: "BVLGARI", category: "bracelets", metal: "gold", diamond: "halo", price: 722100, readyToShip: true, description: "Elegant bangle with halo diamond accents. Traditional Indian design with modern touch." },
    { id: 18, name: "Cuff Bracelet", brand: "Van Cleef & Arpels", category: "bracelets", metal: "platinum", diamond: "vintage", price: 1111220, readyToShip: false, description: "Vintage-inspired cuff bracelet. Statement piece for special occasions." },
    
    // Bangles
    { id: 19, name: "Diamond Bangle", brand: "Cartier", category: "bangles", metal: "gold", diamond: "solitaire", price: 796800, readyToShip: true, description: "Stunning diamond bangle in gold. Perfect for Indian weddings and festivals." },
    { id: 20, name: "Stackable Bangle", brand: "BVLGARI", category: "bangles", metal: "rose-gold", diamond: "modern", price: 348600, readyToShip: true, description: "Modern stackable bangle set. Mix and match for your style." },
    
    // Collections
    { id: 21, name: "Bridal Collection Set", brand: "Chaumet", category: "collections", metal: "platinum", diamond: "halo", price: 2075000, readyToShip: true, description: "Complete bridal collection including ring, earrings, and necklace. Perfect for Indian weddings." },
    { id: 22, name: "Evening Collection", brand: "Van Cleef & Arpels", category: "collections", metal: "platinum", diamond: "vintage", price: 2656000, readyToShip: false, description: "Luxurious evening collection with matching pieces. Elegant and sophisticated." },
];

// Shopping Cart, Wishlist, Compare
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Enhance products with carat and price range
products.forEach(product => {
    if (!product.carat) product.carat = Math.random() * 3 + 0.5; // Random carat between 0.5-3.5
    if (!product.priceRange) {
        const minPrice = product.price * 0.9;
        const maxPrice = product.price * 1.1;
        product.priceRange = { min: Math.round(minPrice), max: Math.round(maxPrice) };
    }
    if (!product.bestseller) product.bestseller = Math.random() > 0.7; // 30% are bestsellers
    if (!product.portugueseCut) product.portugueseCut = product.name.toLowerCase().includes('solitaire');
    if (!product.titanium) product.titanium = false;
    if (!product.gender) product.gender = Math.random() > 0.3 ? 'women' : 'men';
});

// Add some Portuguese Cut and Titanium products (Prices in INR ₹)
products.push(
    { id: 23, name: "Portuguese Cut 4 Carat Solitaire Ring", brand: "BVLGARI", category: "rings", metal: "platinum", diamond: "solitaire", price: 24256169, priceRange: { min: 24256169, max: 26463571 }, carat: 4, readyToShip: true, bestseller: true, portugueseCut: true, description: "Exquisite Portuguese cut diamond with exceptional brilliance. Perfect for special occasions.", gender: 'women' },
    { id: 24, name: "Radiant 6 Carat Big Rock Solitaire Ring", brand: "Cartier", category: "rings", metal: "platinum", diamond: "solitaire", price: 33562627, priceRange: { min: 33562627, max: 35454132 }, carat: 6, readyToShip: true, bestseller: true, description: "Stunning radiant cut solitaire ring. Statement piece for the special day.", gender: 'women' },
    { id: 25, name: "Titanium Modern Ring", brand: "BVLGARI", category: "rings", metal: "titanium", diamond: "modern", price: 290500, priceRange: { min: 265600, max: 315400 }, carat: 1, readyToShip: true, titanium: true, description: "Modern titanium ring with contemporary design. Lightweight and durable.", gender: 'men' },
    { id: 26, name: "Titanium Bracelet", brand: "Cartier", category: "bracelets", metal: "titanium", diamond: "modern", price: 373500, priceRange: { min: 348600, max: 398400 }, carat: 0.5, readyToShip: true, titanium: true, description: "Durable titanium bracelet. Modern and stylish.", gender: 'men' }
);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderProducts();
    renderReadyToShip();
    renderTrendingNow();
    renderRingsObsession();
    renderBestSellers();
    renderPortugueseCut();
    renderTitaniumCollection();
    renderCustomerFavorites();
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
    setupAnimations();
    setupFAQ();
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Category Filter Links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            document.getElementById('categoryFilter').value = category;
            filterProducts();
            window.scrollTo({ top: document.getElementById('products').offsetTop - 80, behavior: 'smooth' });
        });
    });

    // Search
    const searchBtn = document.getElementById('searchBtn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn?.addEventListener('click', () => {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });

    searchInput?.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Close search on outside click
    document.addEventListener('click', (e) => {
        if (!searchBox?.contains(e.target) && !searchBtn?.contains(e.target)) {
            searchBox?.classList.remove('active');
        }
    });

    // Filters
    document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
    document.getElementById('metalFilter')?.addEventListener('change', filterProducts);
    document.getElementById('diamondFilter')?.addEventListener('change', filterProducts);
    document.getElementById('priceFilter')?.addEventListener('change', filterProducts);
    document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

    // User Login
    document.getElementById('userBtn')?.addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('active');
    });

    document.getElementById('closeLoginModal')?.addEventListener('click', () => {
        document.getElementById('loginModal').classList.remove('active');
    });

    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });

    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // Shopping Cart
    document.getElementById('cartBtn')?.addEventListener('click', () => {
        document.getElementById('cartModal').classList.add('active');
        renderCart();
    });

    document.getElementById('closeCartModal')?.addEventListener('click', () => {
        document.getElementById('cartModal').classList.remove('active');
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        if (!currentUser) {
            alert('Please login to proceed to checkout');
            document.getElementById('cartModal').classList.remove('active');
            document.getElementById('loginModal').classList.add('active');
            return;
        }
        
        // Show checkout form/modal
        await processCheckout();
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.pageYOffset > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Wishlist Modal
    document.getElementById('wishlistBtn')?.addEventListener('click', () => {
        document.getElementById('wishlistModal').classList.add('active');
        renderWishlist();
    });

    document.getElementById('closeWishlistModal')?.addEventListener('click', () => {
        document.getElementById('wishlistModal').classList.remove('active');
    });

    // Compare Button (floating)
    const compareBtn = document.createElement('button');
    compareBtn.className = 'btn btn-secondary';
    compareBtn.textContent = 'Compare Products';
    compareBtn.style.cssText = 'position: fixed; bottom: 150px; right: 30px; z-index: 1500; padding: 0.8rem 1.5rem;';
    compareBtn.addEventListener('click', () => {
        document.getElementById('compareModal').classList.add('active');
        renderCompare();
    });
    document.body.appendChild(compareBtn);

    document.getElementById('closeCompareModal')?.addEventListener('click', () => {
        document.getElementById('compareModal').classList.remove('active');
    });
}

// Render Products
function renderProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const productsToRender = filteredProducts || products;
    productsGrid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
    attachProductListeners(productsGrid);
}

// Render Ready to Ship Products
function renderReadyToShip() {
    const readyToShipGrid = document.getElementById('readyToShipGrid');
    if (!readyToShipGrid) return;

    const readyToShipProducts = products.filter(p => p.readyToShip);
    readyToShipGrid.innerHTML = readyToShipProducts.map(product => createProductCard(product)).join('');
    attachProductListeners(readyToShipGrid);
}

// Get Product Emoji
function getProductEmoji(category) {
    const emojis = {
        rings: '💍',
        earrings: '💎',
        pendants: '✨',
        necklaces: '👑',
        bracelets: '💫',
        bangles: '🌟',
        collections: '💠'
    };
    return emojis[category] || '💍';
}

// Filter Products
function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const metal = document.getElementById('metalFilter').value;
    const diamond = document.getElementById('diamondFilter').value;
    const price = document.getElementById('priceFilter').value;

    let filtered = products.filter(product => {
        if (category !== 'all' && product.category !== category) return false;
        if (metal !== 'all' && product.metal !== metal) return false;
        if (diamond !== 'all' && product.diamond !== diamond) return false;
        
        if (price !== 'all') {
            const [min, max] = price.split('-').map(p => {
                if (p.includes('+')) return Infinity;
                return parseInt(p.replace(/[^0-9]/g, ''));
            });
            if (product.price < min || product.price > max) return false;
        }
        
        return true;
    });

    renderProducts(filtered);
}

// Clear Filters
function clearFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('metalFilter').value = 'all';
    document.getElementById('diamondFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    renderProducts();
}

// Search Functionality
function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" data-product-id="${product.id}">
            <strong>${product.name}</strong><br>
            <small>${product.brand} - ₹${product.price.toLocaleString('en-IN')}</small>
        </div>
    `).join('');

    // Add click listeners to search results
    document.querySelectorAll('#searchResults .search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = parseInt(item.getAttribute('data-product-id'));
            showProductDetail(productId);
            document.getElementById('searchBox').classList.remove('active');
            document.getElementById('searchInput').value = '';
            searchResults.innerHTML = '';
        });
    });
}

// Show Product Detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;

    // Get images array (up to 5) or use single image
    const productImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    const mainImage = productImages.length > 0 ? productImages[0] : '';
    const hasVideo = product.video ? true : false;

    // Build image gallery HTML
    let imageGalleryHTML = '';
    if (productImages.length > 0) {
        imageGalleryHTML = `
            <div class="product-image-gallery">
                <div class="product-main-image">
                    ${mainImage ? `<img src="${mainImage}" alt="${product.name}" id="mainProductImage">` : `<div class="product-placeholder">${getProductEmoji(product.category)}</div>`}
                </div>
                ${productImages.length > 1 ? `
                    <div class="product-thumbnails">
                        ${productImages.map((img, index) => `
                            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                                <img src="${img}" alt="Thumbnail ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        imageGalleryHTML = `<div class="product-placeholder">${getProductEmoji(product.category)}</div>`;
    }

    // Build video HTML
    let videoHTML = '';
    if (hasVideo) {
        videoHTML = `
            <div class="product-video-section">
                <h3>Product Video</h3>
                <div class="product-video-container">
                    <video controls preload="metadata" class="product-video">
                        <source src="${product.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        `;
    }

    productDetail.innerHTML = `
        <div class="product-detail-image">
            ${imageGalleryHTML}
            ${videoHTML}
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p class="product-detail-brand">${product.brand}</p>
            <p class="product-detail-category">${product.category} • ${product.metal} • ${product.diamond}</p>
            <p class="product-detail-price">₹${product.price.toLocaleString('en-IN')}</p>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-specs">
                <p><strong>Category:</strong> ${product.category}</p>
                ${product.subcategory ? `<p><strong>Subcategory:</strong> ${product.subcategory}</p>` : ''}
                <p><strong>Metal:</strong> ${product.metal}</p>
                ${product.metalPurity ? `<p><strong>Metal Purity:</strong> ${product.metalPurity}</p>` : ''}
                <p><strong>Diamond Type:</strong> ${product.diamond}</p>
                ${product.carat ? `<p><strong>Carat:</strong> ${product.carat} Ct</p>` : ''}
                ${product.weight ? `<p><strong>Weight:</strong> ${product.weight} grams</p>` : ''}
                ${product.diamondDetails ? `<p><strong>Diamond Details:</strong> ${product.diamondDetails}</p>` : ''}
                ${product.collection ? `<p><strong>Collection:</strong> ${product.collection}</p>` : ''}
                ${product.size ? `<p><strong>Size:</strong> ${product.size}</p>` : ''}
                ${product.quantity ? `<p><strong>Available Quantity:</strong> ${product.quantity}</p>` : ''}
                ${product.erpnextItemCode ? `<p><strong>SKU:</strong> ${product.erpnextItemCode}</p>` : ''}
                ${product.readyToShip ? '<p><strong>Status:</strong> ✅ Ready to Ship</p>' : `<p><strong>Status:</strong> ⏳ Made to Order (${product.leadTime || 15} days)</p>`}
            </div>
            <div class="product-detail-actions">
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                <button class="btn btn-secondary wishlist-btn" data-product-id="${product.id}">Add to Wishlist</button>
                <button class="btn btn-secondary compare-btn" data-product-id="${product.id}">Compare</button>
            </div>
        </div>
    `;

    // Add thumbnail click handlers
    productDetail.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newImage = thumb.dataset.image;
            const mainImg = productDetail.querySelector('#mainProductImage');
            if (mainImg) {
                mainImg.src = newImage;
            }
            productDetail.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Add event listeners
    productDetail.querySelector('.add-to-cart-btn')?.addEventListener('click', () => {
        addToCart(productId);
        document.getElementById('productModal').classList.remove('active');
    });

    productDetail.querySelector('.wishlist-btn')?.addEventListener('click', () => {
        addToWishlist(productId);
    });

    productDetail.querySelector('.compare-btn')?.addEventListener('click', () => {
        addToCompare(productId);
    });

    document.getElementById('productModal').classList.add('active');
    document.getElementById('closeProductModal')?.addEventListener('click', () => {
        document.getElementById('productModal').classList.remove('active');
    });
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <div class="product-placeholder">${getProductEmoji(item.category)}</div>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">${item.brand} • ${item.category}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    cartFooter.style.display = 'block';
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// User Authentication
function handleLogin() {
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;
    
    // Simulate login (in real app, this would be an API call)
    currentUser = { email, name: email.split('@')[0] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('Login successful!');
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginForm').reset();
    updateUserButton();
}

function handleRegister() {
    const name = document.querySelector('#registerForm input[type="text"]').value;
    const email = document.querySelector('#registerForm input[type="email"]').value;
    const password = document.querySelector('#registerForm input[type="password"]').value;
    
    // Simulate registration
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('Registration successful!');
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerForm').reset();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    updateUserButton();
}

function updateUserButton() {
    const userBtn = document.getElementById('userBtn');
    if (currentUser && userBtn) {
        userBtn.title = `Logged in as ${currentUser.name}`;
    }
}

// Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.brand-card, .product-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Render Trending Now with Product Counts
function renderTrendingNow() {
    const categories = ['rings', 'earrings', 'necklaces', 'bracelets', 'pendants', 'collections'];
    categories.forEach(category => {
        const count = products.filter(p => p.category === category).length;
        const countElement = document.getElementById(`${category}Count`);
        if (countElement) countElement.textContent = count;
    });

    // Add click handlers to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            document.getElementById('categoryFilter').value = category;
            filterProducts();
            window.scrollTo({ top: document.getElementById('products').offsetTop - 80, behavior: 'smooth' });
        });
    });
}

// Render Rings Obsession
function renderRingsObsession() {
    const ringsGrid = document.getElementById('ringsObsessionGrid');
    if (!ringsGrid) return;

    const rings = products.filter(p => p.category === 'rings').slice(0, 8);
    ringsGrid.innerHTML = rings.map(product => createProductCard(product)).join('');
    attachProductListeners(ringsGrid);
}

// Render Best Sellers
function renderBestSellers() {
    const bestSellerGrid = document.getElementById('bestSellerGrid');
    if (!bestSellerGrid) return;

    const bestSellers = products.filter(p => p.bestseller).slice(0, 8);
    bestSellerGrid.innerHTML = bestSellers.map(product => createProductCard(product)).join('');
    attachProductListeners(bestSellerGrid);
}

// Render Portuguese Cut
function renderPortugueseCut() {
    const portugueseGrid = document.getElementById('portugueseCutGrid');
    if (!portugueseGrid) return;

    const portugueseProducts = products.filter(p => p.portugueseCut).slice(0, 6);
    portugueseGrid.innerHTML = portugueseProducts.map(product => createProductCard(product)).join('');
    attachProductListeners(portugueseGrid);
}

// Render Titanium Collection
function renderTitaniumCollection() {
    const titaniumGrid = document.getElementById('titaniumCollectionGrid');
    if (!titaniumGrid) return;

    const titaniumProducts = products.filter(p => p.titanium).slice(0, 6);
    titaniumGrid.innerHTML = titaniumProducts.map(product => createProductCard(product)).join('');
    attachProductListeners(titaniumGrid);
}

// Render Customer Favorites
function renderCustomerFavorites() {
    // New Arrivals (recent products)
    const newArrivals = products.slice(-6).reverse();
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid) {
        newArrivalsGrid.innerHTML = newArrivals.map(product => createProductCard(product)).join('');
        attachProductListeners(newArrivalsGrid);
    }

    // Cost Effective (lower price range)
    const costEffective = products.filter(p => p.price < 10000).slice(0, 6);
    const costEffectiveGrid = document.getElementById('costEffectiveGrid');
    if (costEffectiveGrid) {
        costEffectiveGrid.innerHTML = costEffective.map(product => createProductCard(product)).join('');
        attachProductListeners(costEffectiveGrid);
    }

    // Best Sellers Favorites
    const bestSellersFav = products.filter(p => p.bestseller).slice(0, 6);
    const bestSellersFavGrid = document.getElementById('bestSellersFavoritesGrid');
    if (bestSellersFavGrid) {
        bestSellersFavGrid.innerHTML = bestSellersFav.map(product => createProductCard(product)).join('');
        attachProductListeners(bestSellersFavGrid);
    }

    // Tab switching
    document.querySelectorAll('.favorite-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.favorite-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.favorite-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(`${tabName}-panel`).classList.add('active');
        });
    });
}

// Create Product Card HTML
function createProductCard(product) {
    const priceDisplay = product.priceRange ? 
        `₹${product.priceRange.min.toLocaleString('en-IN')} – ₹${product.priceRange.max.toLocaleString('en-IN')}` : 
        `₹${product.price.toLocaleString('en-IN')}`;
    const caratDisplay = product.carat ? `${product.carat.toFixed(1)} Ct` : '';

    // Get product image - prefer first image from images array, fallback to image, then placeholder
    const productImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    const productImage = productImages.length > 0 ? productImages[0] : '';
    const hasVideo = product.video ? true : false;

    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.readyToShip ? '<span class="ready-to-ship-badge">Ready to Ship</span>' : ''}
            ${hasVideo ? '<span class="video-badge"><i class="fas fa-video"></i> Video</span>' : ''}
            <div class="product-image">
                ${productImage ? `<img src="${productImage}" alt="${product.name}" loading="lazy">` : `<div class="product-placeholder">${getProductEmoji(product.category)}</div>`}
                <div class="product-overlay">
                    <button class="btn btn-secondary view-details-btn" data-product-id="${product.id}">View Details</button>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <p class="product-category">${product.category} ${caratDisplay ? '• ' + caratDisplay : ''} ${product.metalPurity ? '• ' + product.metalPurity : ''}</p>
                <p class="product-price">${priceDisplay}</p>
                ${product.collection ? `<p class="product-collection" style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">Collection: ${product.collection}</p>` : ''}
                <div class="product-actions">
                    <button class="compare-btn" data-product-id="${product.id}">Compare</button>
                    <button class="wishlist-btn-inline" data-product-id="${product.id}">♡ Wishlist</button>
                </div>
            </div>
        </div>
    `;
}

// Attach Product Event Listeners
function attachProductListeners(container) {
    container.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            showProductDetail(productId);
        });
    });

    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });

    container.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            addToCompare(productId);
        });
    });

    container.querySelectorAll('.wishlist-btn-inline').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            toggleWishlist(productId);
        });
    });
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist', 'success');
    }

    saveWishlist();
    updateWishlistCount();
    renderWishlist();
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (!wishlistCount) return;

    wishlistCount.textContent = wishlist.length;
    wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function renderWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
        return;
    }

    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-item-image">
                <div class="product-placeholder">${getProductEmoji(item.category)}</div>
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">Remove</button>
        </div>
    `).join('');
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    updateWishlistCount();
    renderWishlist();
}

// Compare Functions
function addToCompare(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (compareList.length >= 4) {
        alert('You can compare up to 4 products at a time');
        return;
    }

    if (compareList.find(item => item.id === productId)) {
        showNotification('Product already in compare list', 'info');
        return;
    }

    compareList.push(product);
    saveCompare();
    showNotification('Added to compare', 'success');
    renderCompare();
}

function saveCompare() {
    localStorage.setItem('compareList', JSON.stringify(compareList));
}

function renderCompare() {
    const compareItems = document.getElementById('compareItems');
    if (!compareItems) return;

    if (compareList.length === 0) {
        compareItems.innerHTML = '<p class="empty-compare">No products to compare. Add products to compare.</p>';
        return;
    }

    compareItems.innerHTML = compareList.map(item => `
        <div class="compare-item">
            <div class="compare-item-image">
                <div class="product-placeholder">${getProductEmoji(item.category)}</div>
            </div>
            <div class="compare-item-info">
                <div class="compare-item-name">${item.name}</div>
                <div class="compare-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <button class="remove-compare" onclick="removeFromCompare(${item.id})">Remove</button>
        </div>
    `).join('');
}

function removeFromCompare(productId) {
    compareList = compareList.filter(item => item.id !== productId);
    saveCompare();
    renderCompare();
}

// FAQ Accordion
function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Gifting Section
document.querySelectorAll('[data-gift]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const giftType = link.getAttribute('data-gift');
        filterByGiftType(giftType);
    });
});

function filterByGiftType(giftType) {
    // Filter products based on gift type (simplified logic)
    let filtered = products;
    if (giftType === 'wedding' || giftType === 'anniversary') {
        filtered = products.filter(p => p.category === 'rings' || p.category === 'collections');
    } else if (giftType === 'diwali' || giftType === 'dussehra') {
        // Indian festivals - show gold jewelry, bangles, and traditional pieces
        filtered = products.filter(p => p.metal === 'gold' || p.category === 'bangles' || p.category === 'necklaces');
    } else if (giftType === 'rakhi') {
        // Rakhi gifts - typically for sisters, show elegant jewelry
        filtered = products.filter(p => p.category === 'bracelets' || p.category === 'earrings' || p.category === 'pendants');
    } else if (giftType === 'mom' || giftType === 'her' || giftType === 'wife') {
        filtered = products.filter(p => p.gender === 'women');
    } else if (giftType === 'him') {
        filtered = products.filter(p => p.gender === 'men');
    }

    const giftingGrid = document.getElementById('giftingGrid');
    if (giftingGrid) {
        giftingGrid.innerHTML = filtered.slice(0, 8).map(product => createProductCard(product)).join('');
        attachProductListeners(giftingGrid);
    }
}

// Solitaires by Shape
document.querySelectorAll('.shape-card').forEach(card => {
    card.addEventListener('click', () => {
        const shape = card.getAttribute('data-shape');
        filterByShape(shape);
    });
});

function filterByShape(shape) {
    // Filter solitaire products by shape (simplified)
    const filtered = products.filter(p => p.diamond === 'solitaire');
    document.getElementById('categoryFilter').value = 'rings';
    filterProducts();
    window.scrollTo({ top: document.getElementById('products').offsetTop - 80, behavior: 'smooth' });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#25D366' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}


// Initialize user button
if (currentUser) {
    updateUserButton();
}

// Initialize wishlist and compare
updateWishlistCount();
renderWishlist();
renderCompare();

// Checkout Process with ERPNext Integration
async function processCheckout() {
    // Collect shipping information (simplified - in production would be a form)
    const shippingAddress = {
        name: currentUser.name || 'Customer',
        addressLine1: prompt('Enter Address Line 1:') || '123 Main Street',
        addressLine2: prompt('Enter Address Line 2 (optional):') || '',
        city: prompt('Enter City:') || 'Mumbai',
        state: prompt('Enter State:') || 'Maharashtra',
        pincode: prompt('Enter Pincode:') || '400001',
        phone: prompt('Enter Phone Number:') || '+91 98765 43210'
    };

    if (!shippingAddress.addressLine1 || !shippingAddress.city) {
        alert('Please provide complete shipping address');
        return;
    }

    // Create order object
    const orderData = {
        id: Date.now(),
        customer: {
            name: currentUser.name,
            email: currentUser.email,
            phone: shippingAddress.phone
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.erpnextItemCode || `SKU-${item.id}`,
            erpnextItemCode: item.erpnextItemCode || `SKU-${item.id}`,
            quantity: item.quantity,
            price: item.price,
            leadTime: item.leadTime || 0
        })),
        shippingAddress: shippingAddress,
        paymentMethod: 'Online', // Would be selected from payment gateway
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    try {
        // Save order locally
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Sync to ERPNext
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            try {
                const salesOrder = await window.ERPNextIntegration.syncOrderToERPNext(orderData);
                orderData.erpnextSalesOrder = salesOrder?.data?.name;
                orderData.erpnextSynced = true;
                
                // Update order with ERPNext reference
                const updatedOrders = JSON.parse(localStorage.getItem('orders')) || [];
                const orderIndex = updatedOrders.findIndex(o => o.id === orderData.id);
                if (orderIndex > -1) {
                    updatedOrders[orderIndex] = orderData;
                    localStorage.setItem('orders', JSON.stringify(updatedOrders));
                }
            } catch (erpnextError) {
                console.error('ERPNext sync error:', erpnextError);
                orderData.erpnextSynced = false;
                orderData.erpnextError = erpnextError.message;
                // Order is saved locally, will retry sync later
            }
        }

        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();

        // Close cart modal
        document.getElementById('cartModal').classList.remove('active');

        // Show success message
        alert(`Order placed successfully! Order ID: #${orderData.id}${orderData.erpnextSalesOrder ? '\nERPNext Sales Order: ' + orderData.erpnextSalesOrder : ''}`);
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error processing order. Please try again.');
    }
}

// Customer Portal / My Account Functions
function openAccountModal() {
    if (!currentUser) {
        alert('Please login to access your account');
        document.getElementById('loginModal').classList.add('active');
        return;
    }
    document.getElementById('accountModal').classList.add('active');
    loadCustomerOrders();
}

function closeAccountModal() {
    document.getElementById('accountModal').classList.remove('active');
}

// Account Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    const accountTabs = document.querySelectorAll('.account-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    accountTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            accountTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
            
            if (targetTab === 'orders') {
                loadCustomerOrders();
            } else if (targetTab === 'returns') {
                loadReturns();
            } else if (targetTab === 'profile') {
                loadProfile();
            }
        });
    });

    // Account Modal Close
    const closeAccountModalBtn = document.getElementById('closeAccountModal');
    if (closeAccountModalBtn) {
        closeAccountModalBtn.addEventListener('click', closeAccountModal);
    }

    // User button click to open account
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                openAccountModal();
            } else {
                document.getElementById('loginModal').classList.add('active');
            }
        });
    }

    // Track Order Button
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', trackOrder);
    }

    // Return Request Button
    const newReturnBtn = document.getElementById('newReturnBtn');
    if (newReturnBtn) {
        newReturnBtn.addEventListener('click', () => {
            document.getElementById('returnModal').classList.add('active');
            loadReturnOrders();
        });
    }

    // Return Form Submit
    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', handleReturnRequest);
    }

    // Close Return Modal
    const closeReturnModal = document.getElementById('closeReturnModal');
    if (closeReturnModal) {
        closeReturnModal.addEventListener('click', () => {
            document.getElementById('returnModal').classList.remove('active');
        });
    }

    // Profile Form Submit
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
});

// Load Customer Orders
async function loadCustomerOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    ordersList.innerHTML = '<p class="loading">Loading orders...</p>';

    try {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Filter orders for current user
        orders = orders.filter(order => order.customer.email === currentUser.email);

        // Try to sync from ERPNext if enabled
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            try {
                const erpnextOrders = await window.ERPNextIntegration.getCustomerOrders(currentUser.email);
                // Merge ERPNext orders with local orders
                erpnextOrders.forEach(erpOrder => {
                    const exists = orders.find(o => o.erpnextSalesOrder === erpOrder.name);
                    if (!exists) {
                        orders.push({
                            id: erpOrder.name,
                            erpnextSalesOrder: erpOrder.name,
                            items: [],
                            total: erpOrder.grand_total,
                            status: erpOrder.status,
                            createdAt: erpOrder.transaction_date,
                            deliveryDate: erpOrder.delivery_date
                        });
                    }
                });
            } catch (err) {
                console.error('Error loading ERPNext orders:', err);
            }
        }

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="empty-orders">No orders found</p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <strong>Order #${order.id}</strong>
                        ${order.erpnextSalesOrder ? `<span class="erpnext-badge">ERPNext: ${order.erpnextSalesOrder}</span>` : ''}
                    </div>
                    <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Items:</strong> ${order.items.length} item(s)</p>
                    <p><strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
                    ${order.deliveryDate ? `<p><strong>Expected Delivery:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="order-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">View Details</button>
                    ${order.status === 'Delivered' ? `<button class="btn btn-sm btn-secondary" onclick="requestReturn(${order.id})">Return</button>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<p class="error">Error loading orders. Please try again.</p>';
    }
}

// Track Order
async function trackOrder() {
    const trackingNumber = document.getElementById('trackingNumber').value;
    const trackingResult = document.getElementById('trackingResult');
    
    if (!trackingNumber) {
        alert('Please enter an order ID or tracking number');
        return;
    }

    trackingResult.innerHTML = '<p class="loading">Tracking order...</p>';

    try {
        // Try to get from ERPNext first
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            try {
                // Try as sales order name
                const orderStatus = await window.ERPNextIntegration.getOrderStatus(trackingNumber);
                displayTrackingResult(orderStatus);
                return;
            } catch (e) {
                // Try as tracking number
                try {
                    const shipment = await window.ERPNextIntegration.getShipmentTracking(trackingNumber);
                    if (shipment) {
                        displayTrackingResult(shipment);
                        return;
                    }
                } catch (e2) {
                    console.log('Not found in ERPNext');
                }
            }
        }

        // Fallback to local storage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id.toString() === trackingNumber || o.erpnextSalesOrder === trackingNumber);
        
        if (order) {
            trackingResult.innerHTML = `
                <div class="tracking-info">
                    <h3>Order #${order.id}</h3>
                    <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
                </div>
            `;
        } else {
            trackingResult.innerHTML = '<p class="error">Order not found. Please check your order ID.</p>';
        }
    } catch (error) {
        console.error('Error tracking order:', error);
        trackingResult.innerHTML = '<p class="error">Error tracking order. Please try again.</p>';
    }
}

function displayTrackingResult(orderStatus) {
    const trackingResult = document.getElementById('trackingResult');
    trackingResult.innerHTML = `
        <div class="tracking-info">
            <h3>Order ${orderStatus.salesOrder.name}</h3>
            <p><strong>Status:</strong> <span class="status-${orderStatus.status.toLowerCase()}">${orderStatus.status}</span></p>
            <p><strong>Date:</strong> ${new Date(orderStatus.salesOrder.transaction_date).toLocaleDateString()}</p>
            ${orderStatus.deliveryDate ? `<p><strong>Expected Delivery:</strong> ${new Date(orderStatus.deliveryDate).toLocaleDateString()}</p>` : ''}
            ${orderStatus.shipment ? `
                <div class="shipment-info">
                    <h4>Shipment Details</h4>
                    <p><strong>Tracking Number:</strong> ${orderStatus.shipment.trackingNumber}</p>
                    <p><strong>Carrier:</strong> ${orderStatus.shipment.carrier}</p>
                </div>
            ` : ''}
        </div>
    `;
}

// Load Returns
function loadReturns() {
    const returnsList = document.getElementById('returnsList');
    if (!returnsList) return;

    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const userReturns = returns.filter(r => r.customerEmail === currentUser.email);

    if (userReturns.length === 0) {
        returnsList.innerHTML = '<p>No returns yet</p>';
        return;
    }

    returnsList.innerHTML = userReturns.map(ret => `
        <div class="return-item">
            <p><strong>Return #${ret.id}</strong> - Order #${ret.orderId}</p>
            <p>Status: <span class="status-${ret.status.toLowerCase()}">${ret.status}</span></p>
            <p>Reason: ${ret.reason}</p>
        </div>
    `).join('');
}

// Load Return Orders for Return Request
function loadReturnOrders() {
    const returnOrderSelect = document.getElementById('returnOrderSelect');
    if (!returnOrderSelect) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.customer.email === currentUser.email && o.status === 'Delivered');

    returnOrderSelect.innerHTML = '<option value="">Select an order...</option>' + 
        userOrders.map(order => `<option value="${order.id}">Order #${order.id} - ₹${order.total.toLocaleString('en-IN')}</option>`).join('');

    returnOrderSelect.addEventListener('change', (e) => {
        const orderId = e.target.value;
        if (orderId) {
            const order = orders.find(o => o.id.toString() === orderId);
            if (order) {
                displayReturnItems(order);
            }
        }
    });
}

function displayReturnItems(order) {
    const returnItemsList = document.getElementById('returnItemsList');
    returnItemsList.innerHTML = order.items.map(item => `
        <label class="return-item-checkbox">
            <input type="checkbox" value="${item.id}" data-price="${item.price}" data-quantity="${item.quantity}">
            ${item.name} - Qty: ${item.quantity} - ₹${item.price.toLocaleString('en-IN')}
        </label>
    `).join('');
}

// Handle Return Request
async function handleReturnRequest(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('returnOrderSelect').value;
    const reason = document.getElementById('returnReason').value;
    const notes = document.getElementById('returnNotes').value;
    const selectedItems = Array.from(document.querySelectorAll('#returnItemsList input:checked'));

    if (!orderId || !reason || selectedItems.length === 0) {
        alert('Please fill all required fields and select items to return');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id.toString() === orderId);

    const returnData = {
        id: Date.now(),
        orderId: parseInt(orderId),
        customerEmail: currentUser.email,
        customerName: currentUser.name,
        salesOrderName: order.erpnextSalesOrder,
        reason: reason,
        notes: notes,
        items: selectedItems.map(item => {
            const orderItem = order.items.find(i => i.id.toString() === item.value);
            return {
                id: orderItem.id,
                erpnextItemCode: orderItem.erpnextItemCode,
                sku: orderItem.sku,
                name: orderItem.name,
                quantity: parseInt(item.dataset.quantity),
                price: parseFloat(item.dataset.price)
            };
        }),
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    try {
        // Save locally
        const returns = JSON.parse(localStorage.getItem('returns')) || [];
        returns.push(returnData);
        localStorage.setItem('returns', JSON.stringify(returns));

        // Sync to ERPNext
        if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
            try {
                await window.ERPNextIntegration.createReturnRequest(returnData);
                returnData.erpnextSynced = true;
            } catch (err) {
                console.error('ERPNext sync error:', err);
                returnData.erpnextSynced = false;
            }
        }

        alert('Return request submitted successfully!');
        document.getElementById('returnModal').classList.remove('active');
        document.getElementById('returnForm').reset();
        loadReturns();
    } catch (error) {
        console.error('Error submitting return:', error);
        alert('Error submitting return request. Please try again.');
    }
}

// Load Profile
function loadProfile() {
    if (!currentUser) return;

    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
}

// Update Profile
function updateProfile(e) {
    e.preventDefault();
    
    currentUser.name = document.getElementById('profileName').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.phone = document.getElementById('profilePhone').value;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserButton();
    alert('Profile updated successfully!');
}

// View Order Details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        alert(`Order #${order.id}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status}\nTotal: ₹${order.total.toLocaleString('en-IN')}\nItems: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}`);
    }
}

// Request Return
function requestReturn(orderId) {
    document.getElementById('returnModal').classList.add('active');
    loadReturnOrders();
    document.getElementById('returnOrderSelect').value = orderId;
    document.getElementById('returnOrderSelect').dispatchEvent(new Event('change'));
}

// Listen for product updates from ERPNext
window.addEventListener('productsUpdated', (event) => {
    const updatedProducts = event.detail;
    // Update global products array
    products.length = 0;
    products.push(...updatedProducts);
    
    // Re-render all product sections
    renderProducts();
    renderReadyToShip();
    renderTrendingNow();
    renderRingsObsession();
    renderBestSellers();
    renderPortugueseCut();
    renderTitaniumCollection();
    renderCustomerFavorites();
    
    console.log(`Products updated: ${updatedProducts.length} products synced from ERPNext`);
});

// Auto-sync products and inventory on page load if ERPNext is enabled
document.addEventListener('DOMContentLoaded', () => {
    if (window.ERPNextIntegration && window.ERPNextIntegration.config.enabled) {
        // Initial sync
        window.ERPNextIntegration.syncProducts()
            .then(syncedProducts => {
                console.log(`Initial sync complete: ${syncedProducts.length} products loaded from ERPNext`);
                // Products are automatically updated via productsUpdated event
            })
            .catch(err => console.error('Product sync error:', err));
        
        window.ERPNextIntegration.syncInventory()
            .then(() => console.log('Inventory synced from ERPNext'))
            .catch(err => console.error('Inventory sync error:', err));

        // Periodic sync every 15 minutes
        setInterval(() => {
            if (window.ERPNextIntegration.config.enabled) {
                window.ERPNextIntegration.syncProducts()
                    .then(syncedProducts => {
                        console.log(`Periodic sync complete: ${syncedProducts.length} products updated from ERPNext`);
                    })
                    .catch(err => console.error('Product sync error:', err));
                
                window.ERPNextIntegration.syncInventory()
                    .catch(err => console.error('Inventory sync error:', err));
            }
        }, 15 * 60 * 1000); // 15 minutes
    }
});

console.log('Diamond Casa website loaded successfully with all features!');
