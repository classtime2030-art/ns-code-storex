// ==========================================
// NS CODE STORE - Complete Script v4.0
// Part 1: Data, Products Display, Cart Functions
// ==========================================

// ========== DATA STORAGE ==========
let cart = JSON.parse(localStorage.getItem('nsCart')) || [];
let orders = JSON.parse(localStorage.getItem('nsOrders')) || [];
let products = JSON.parse(localStorage.getItem('nsProducts')) || getDefaultProducts();
let adminLoggedIn = sessionStorage.getItem('nsAdminLogin') === 'true';
const ADMIN_PASSWORD = 'nsadmin123';

// ========== DEFAULT PRODUCTS ==========
function getDefaultProducts() {
    return [
        { 
            id: 1, 
            name: 'Modern Dashboard', 
            category: 'html', 
            desc: 'Complete admin dashboard with charts, tables and analytics', 
            price: 1499, 
            salePrice: 999, 
            icon: '📊', 
            featured: true, 
            file: 'dashboard.zip',
            downloadLink: ''
        },
        { 
            id: 2, 
            name: 'Portfolio Template', 
            category: 'html', 
            desc: 'Beautiful responsive portfolio for developers & designers', 
            price: 799, 
            salePrice: 499, 
            icon: '🎨', 
            featured: true, 
            file: 'portfolio.zip',
            downloadLink: ''
        },
        { 
            id: 3, 
            name: 'React E-Commerce App', 
            category: 'react', 
            desc: 'Full shopping app with cart, payment & admin panel', 
            price: 2499, 
            salePrice: 1999, 
            icon: '🛍️', 
            featured: false, 
            file: 'ecommerce.zip',
            downloadLink: ''
        },
        { 
            id: 4, 
            name: 'Snake Game JavaScript', 
            category: 'game', 
            desc: 'Classic snake game with modern graphics & levels', 
            price: 299, 
            salePrice: 199, 
            icon: '🐍', 
            featured: true, 
            file: 'snake.zip',
            downloadLink: ''
        },
        { 
            id: 5, 
            name: 'Weather Forecast App', 
            category: 'tool', 
            desc: '7-day weather forecast with beautiful UI', 
            price: 399, 
            salePrice: 299, 
            icon: '🌤️', 
            featured: false, 
            file: 'weather.zip',
            downloadLink: ''
        },
        { 
            id: 6, 
            name: 'Chat Application', 
            category: 'react', 
            desc: 'Real-time messaging app with Firebase backend', 
            price: 1999, 
            salePrice: 1499, 
            icon: '💬', 
            featured: false, 
            file: 'chat.zip',
            downloadLink: ''
        }
    ];
}

// ========== SAVE DATA ==========
function saveAll() {
    localStorage.setItem('nsCart', JSON.stringify(cart));
    localStorage.setItem('nsOrders', JSON.stringify(orders));
    localStorage.setItem('nsProducts', JSON.stringify(products));
}

// ========== NOTIFICATION TOAST ==========
function showNotif(msg, type) {
    var n = document.createElement('div');
    n.className = 'notification';
    if (type === 'success') n.classList.add('notif-success');
    else if (type === 'error') n.classList.add('notif-error');
    else n.classList.add('notif-info');
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(function() { 
        n.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() { n.remove(); }, 300);
    }, 3000);
}

// ========== PAGE NAVIGATION ==========
function showPage(page) {
    var allPages = document.querySelectorAll('.page');
    for (var i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('active');
    }
    
    if (page === 'home') document.getElementById('homePage').classList.add('active');
    if (page === 'products') document.getElementById('productsPage').classList.add('active');
    if (page === 'orders') document.getElementById('ordersPage').classList.add('active');
    
    if (page === 'products') showProducts();
    if (page === 'orders') showMyOrders();
}

// ========== SHOW PRODUCTS ==========
function showProducts() {
    var categoryFilter = document.getElementById('categoryFilter');
    var category = categoryFilter ? categoryFilter.value : 'all';
    
    var searchBox = document.getElementById('searchBox');
    var search = searchBox ? searchBox.value.toLowerCase() : '';
    
    var filtered = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var matchCategory = (category === 'all' || p.category === category);
        var matchSearch = true;
        if (search !== '') {
            matchSearch = (p.name.toLowerCase().indexOf(search) !== -1) || 
                         (p.desc.toLowerCase().indexOf(search) !== -1);
        }
        if (matchCategory && matchSearch) {
            filtered.push(p);
        }
    }
    
    // Featured Products
    var featured = [];
    for (var j = 0; j < products.length; j++) {
        if (products[j].featured) {
            featured.push(products[j]);
        }
    }
    
    var featuredHTML = '';
    for (var k = 0; k < featured.length; k++) {
        featuredHTML += makeProductCard(featured[k]);
    }
    var featuredDiv = document.getElementById('featuredProducts');
    if (featuredDiv) {
        featuredDiv.innerHTML = featuredHTML || '<p style="color:#94a3b8;text-align:center;padding:20px;">No featured products</p>';
    }
    
    // All Products
    var allHTML = '';
    for (var l = 0; l < filtered.length; l++) {
        allHTML += makeProductCard(filtered[l]);
    }
    var allDiv = document.getElementById('allProducts');
    if (allDiv) {
        allDiv.innerHTML = allHTML || '<p style="text-align:center;color:#94a3b8;padding:40px;">No products found</p>';
    }
}

// ========== PRODUCT CARD HTML ==========
function makeProductCard(p) {
    var price = p.salePrice || p.price;
    var oldPriceHTML = '';
    if (p.salePrice) {
        oldPriceHTML = '<span class="old-price">₹' + p.price + '</span>';
    }
    
    var html = '';
    html += '<div class="product-card">';
    html += '<span onclick="addToWishlist(' + p.id + ')" style="position:absolute;top:10px;right:10px;font-size:20px;cursor:pointer;z-index:10;">🤍</span>';
    html += '<div class="product-icon">' + p.icon + '</div>';
    html += '<span class="product-category">' + p.category.toUpperCase() + '</span>';
    html += '<h3 class="product-name">' + p.name + '</h3>';
    html += '<p class="product-desc">' + p.desc + '</p>';
    html += '<div class="product-price">';
    html += '<div><span class="price">₹' + price + '</span>' + oldPriceHTML + '</div>';
    html += '<button class="buy-btn" onclick="addToCart(' + p.id + ')">🛒 Add to Cart</button>';
    html += '</div></div>';
    
    return html;
}

// ========== CART FUNCTIONS ==========
function addToCart(productId) {
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    if (!product) return;
    
    var existingItem = null;
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === productId) {
            existingItem = cart[j];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.qty = existingItem.qty + 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.salePrice || product.price,
            icon: product.icon,
            qty: 1
        });
    }
    
    saveAll();
    updateCartUI();
    showNotif('✅ ' + product.name + ' added to cart!', 'success');
}

function removeFromCart(productId) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    saveAll();
    updateCartUI();
}

function updateCartUI() {
    var count = 0;
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        count = count + cart[i].qty;
        total = total + (cart[i].price * cart[i].qty);
    }
    
    var cartCountEl = document.getElementById('cartCount');
    var cartTotalEl = document.getElementById('cartTotal');
    var cartItemsEl = document.getElementById('cartItems');
    
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartTotalEl) cartTotalEl.textContent = total;
    
    if (cartItemsEl) {
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:50px;">🛒</div><p style="color:#94a3b8;">Your cart is empty</p></div>';
        } else {
            var html = '';
            for (var j = 0; j < cart.length; j++) {
                var item = cart[j];
                html += '<div class="cart-item">';
                html += '<div><strong>' + item.icon + ' ' + item.name + '</strong><br>';
                html += '<small style="color:#94a3b8;">₹' + item.price + ' × ' + item.qty + ' = ₹' + (item.price * item.qty) + '</small></div>';
                html += '<button onclick="removeFromCart(' + item.id + ')" style="background:#ef4444;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:14px;">✕</button>';
                html += '</div>';
            }
            cartItemsEl.innerHTML = html;
        }
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    updateCartUI();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}
// ==========================================
// NS CODE STORE - Part 2: Checkout, Orders & Download
// ==========================================

// ========== CHECKOUT ==========
function checkout() {
    if (cart.length === 0) {
        showNotif('🛒 Cart is empty! Add products first.', 'error');
        return;
    }
    
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + (cart[i].price * cart[i].qty);
    }
    
    var html = '';
    
    // Order Summary
    html += '<h4 style="margin-bottom:15px;font-size:18px;">📋 Order Summary</h4>';
    
    for (var j = 0; j < cart.length; j++) {
        var item = cart[j];
        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #334155;">';
        html += '<span>' + item.icon + ' ' + item.name + ' × ' + item.qty + '</span>';
        html += '<span style="color:#3b82f6;">₹' + (item.price * item.qty) + '</span>';
        html += '</div>';
    }
    
    html += '<div style="display:flex;justify-content:space-between;padding:15px 0;margin-top:10px;">';
    html += '<strong style="font-size:18px;">Total Amount:</strong>';
    html += '<strong style="color:#10b981;font-size:22px;">₹' + total + '</strong>';
    html += '</div>';
    
    // UPI Payment Section
    html += '<div style="background:#0f172a;padding:20px;border-radius:12px;margin:20px 0;border:2px solid #10b981;">';
    html += '<h4 style="color:#10b981;font-size:18px;">📱 Pay via UPI</h4>';
    html += '<p style="font-size:20px;color:#3b82f6;margin:12px 0;letter-spacing:1px;"><strong>nscodestore@upi</strong></p>';
    html += '<button onclick="copyUPI()" style="background:#334155;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;">📋 Copy UPI ID</button>';
    html += '<p style="color:#94a3b8;font-size:12px;margin-top:12px;">💡 Pay exactly <strong>₹' + total + '</strong> and upload screenshot</p>';
    html += '</div>';
    
    // Screenshot Upload
    html += '<div class="upload-box" id="screenshotBox">';
    html += '<div style="font-size:40px;">📸</div>';
    html += '<p style="margin:10px 0;">Tap to Upload Payment Screenshot</p>';
    html += '<p style="color:#94a3b8;font-size:12px;">Take screenshot of successful payment</p>';
    html += '<input type="file" id="screenshotInput" accept="image/*" onchange="previewScreenshot(this)" style="display:none;">';
    html += '<img id="screenshotPreview" style="display:none;max-width:250px;margin:15px auto 0;border-radius:8px;border:2px solid #10b981;">';
    html += '</div>';
    
    // UPI ID Input
    html += '<div class="form-group">';
    html += '<label>📱 Your UPI ID (for verification)</label>';
    html += '<input type="text" id="userUpiId" placeholder="e.g., yourname@upi" style="width:100%;padding:12px;background:#0f172a;border:1px solid #334155;color:white;border-radius:8px;">';
    html += '</div>';
    
    // Submit Button
    html += '<button onclick="submitOrder()" style="width:100%;background:#10b981;color:white;border:none;padding:16px;border-radius:10px;font-size:18px;cursor:pointer;font-weight:bold;margin-top:10px;">';
    html += '✅ Submit Payment for Verification';
    html += '</button>';
    
    html += '<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">⏱️ Admin will verify within 5-10 minutes</p>';
    html += '<p style="color:#64748b;font-size:11px;text-align:center;">Need help? WhatsApp: +91 9876543210</p>';
    
    document.getElementById('checkoutContent').innerHTML = html;
    document.getElementById('checkoutModal').classList.add('active');
    closeCart();
    
    // Screenshot upload click event
    setTimeout(function() {
        var box = document.getElementById('screenshotBox');
        var input = document.getElementById('screenshotInput');
        if (box && input) {
            box.onclick = function() {
                input.click();
            };
        }
    }, 300);
                }
            
