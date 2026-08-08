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
   // ========== COPY UPI ID ==========
function copyUPI() {
    navigator.clipboard.writeText('nscodestore@upi').then(function() {
        showNotif('✅ UPI ID copied! Pay using any UPI app.', 'success');
    }).catch(function() {
        prompt('Copy this UPI ID:', 'nscodestore@upi');
    });
}

// ========== PREVIEW SCREENSHOT ==========
function previewScreenshot(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = document.getElementById('screenshotPreview');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ========== CLOSE CHECKOUT ==========
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// ========== SUBMIT ORDER ==========
function submitOrder() {
    var screenshotInput = document.getElementById('screenshotInput');
    var userUpiId = document.getElementById('userUpiId').value;
    
    // Check if screenshot is uploaded
    if (!screenshotInput.files || !screenshotInput.files[0]) {
        showNotif('❌ Please upload payment screenshot!', 'error');
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(e) {
        // Calculate total
        var total = 0;
        var itemsCopy = [];
        
        for (var i = 0; i < cart.length; i++) {
            total = total + (cart[i].price * cart[i].qty);
            itemsCopy.push({
                id: cart[i].id,
                name: cart[i].name,
                price: cart[i].price,
                icon: cart[i].icon,
                qty: cart[i].qty
            });
        }
        
        // Create order object
        var order = {
            id: 'NSC' + Date.now(),
            date: new Date().toLocaleString(),
            items: itemsCopy,
            total: total,
            screenshot: e.target.result,
            userUpiId: userUpiId,
            status: 'pending'
        };
        
        // Add to orders array
        orders.unshift(order);
        
        // Clear cart
        cart = [];
        saveAll();
        updateCartUI();
        closeCheckout();
        
        // Show success message
        showNotif('✅ Order #' + order.id + ' submitted! Wait for admin approval.', 'success');
        
        // Go to orders page
        showPage('orders');
    };
    
    reader.readAsDataURL(screenshotInput.files[0]);
}

// ========== SHOW MY ORDERS ==========
function showMyOrders() {
    var container = document.getElementById('myOrdersList');
    
    if (orders.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:50px;"><div style="font-size:60px;">📋</div><p style="color:#94a3b8;font-size:18px;">No orders yet</p><p style="color:#64748b;">Start shopping to see your orders here!</p></div>';
        return;
    }
    
    var html = '';
    
    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        
        html += '<div class="order-card">';
        
        // Order header
        html += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">';
        html += '<div><h4 style="font-size:18px;">Order #' + order.id + '</h4>';
        html += '<small style="color:#94a3b8;">📅 ' + order.date + '</small></div>';
        
        // Status badge
        var statusClass = 'status-' + order.status;
        html += '<span class="' + statusClass + '">' + order.status.toUpperCase() + '</span>';
        html += '</div>';
        
        // Order items
        html += '<div style="background:#0f172a;padding:15px;border-radius:10px;margin:12px 0;">';
        
        for (var j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            html += '<div style="display:flex;justify-content:space-between;padding:5px 0;">';
            html += '<span>' + item.icon + ' ' + item.name + ' × ' + item.qty + '</span>';
            html += '<span style="color:#3b82f6;">₹' + (item.price * item.qty) + '</span>';
            html += '</div>';
        }
        
        html += '<hr style="border-color:#334155;margin:10px 0;">';
        html += '<div style="display:flex;justify-content:space-between;">';
        html += '<strong>Total:</strong>';
        html += '<strong style="color:#10b981;font-size:18px;">₹' + order.total + '</strong>';
        html += '</div></div>';
        
        // Screenshot
        if (order.screenshot) {
            html += '<div style="margin:10px 0;">';
            html += '<small style="color:#94a3b8;">📸 Payment Screenshot:</small><br>';
            html += '<img src="' + order.screenshot + '" style="max-width:180px;border-radius:8px;margin-top:5px;cursor:pointer;border:1px solid #334155;" onclick="window.open(this.src)">';
            html += '</div>';
        }
        
        // Status actions
        if (order.status === 'approved') {
            html += '<div style="background:rgba(16,185,129,0.15);padding:15px;border-radius:10px;margin-top:12px;border:1px solid #10b981;">';
            html += '<p style="color:#10b981;font-weight:bold;font-size:16px;">✅ Payment Verified!</p>';
            html += '<p style="color:#94a3b8;font-size:13px;">Your files are ready to download</p>';
            html += '<button onclick="downloadFiles(\'' + order.id + '\')" style="background:#3b82f6;color:white;border:none;padding:12px 24px;border-radius:8px;margin-top:8px;cursor:pointer;font-weight:bold;font-size:15px;">📥 Download Files</button>';
            html += '</div>';
        } else if (order.status === 'pending') {
            html += '<div style="background:rgba(245,158,11,0.1);padding:12px;border-radius:8px;margin-top:12px;">';
            html += '<p style="color:#f59e0b;">⏳ Waiting for admin verification...</p>';
            html += '<p style="color:#94a3b8;font-size:12px;">This usually takes 5-10 minutes</p>';
            html += '</div>';
        } else if (order.status === 'rejected') {
            html += '<div style="background:rgba(239,68,68,0.1);padding:12px;border-radius:8px;margin-top:12px;">';
            html += '<p style="color:#ef4444;">❌ Payment Rejected</p>';
            if (order.reason) {
                html += '<p style="color:#94a3b8;font-size:13px;">Reason: ' + order.reason + '</p>';
            }
            html += '<p style="color:#94a3b8;font-size:12px;">Contact support or place a new order</p>';
            html += '</div>';
        }
        
        html += '</div>'; // End order-card
    }
    
    container.innerHTML = html;
}

// ========== DOWNLOAD FILES (GOOGLE DRIVE) ==========
function downloadFiles(orderId) {
    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
            break;
        }
    }
    
    if (!order || order.status !== 'approved') {
        showNotif('❌ Order not approved yet!', 'error');
        return;
    }
    
    var downloaded = 0;
    var totalFiles = order.items.length;
    
    for (var j = 0; j < order.items.length; j++) {
        var product = null;
        for (var k = 0; k < products.length; k++) {
            if (products[k].id === order.items[j].id) {
                product = products[k];
                break;
            }
        }
        
        if (product && product.downloadLink) {
            // Open Google Drive link
            setTimeout(function(link, name) {
                window.open(link, '_blank');
            }, j * 500, product.downloadLink, product.name);
            
            downloaded++;
            showNotif('📥 Opening: ' + product.name, 'success');
        } else if (product && !product.downloadLink) {
            showNotif('⚠️ No download link for: ' + product.name, 'error');
        }
    }
    
    if (downloaded > 0) {
        setTimeout(function() {
            showNotif('✅ ' + downloaded + '/' + totalFiles + ' files downloading! Check new tabs.', 'success');
        }, 1000);
    } else {
        showNotif('❌ No download links found! Contact support.', 'error');
    }
}
// ==========================================
// NS CODE STORE - Part 3: Admin Panel
// ==========================================

// ========== ADMIN TOGGLE ==========
function toggleAdmin() {
    if (adminLoggedIn) {
        adminLoggedIn = false;
        sessionStorage.removeItem('nsAdminLogin');
        document.getElementById('adminBtn').textContent = '🔐 Admin';
        document.getElementById('adminBtn').style.background = '#3b82f6';
        showPage('home');
        showNotif('👋 Admin logged out', 'info');
    } else {
        showAdminLogin();
    }
        }

// ========== ADMIN LOGIN MODAL ==========
function showAdminLogin() {
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:2000;display:flex;justify-content:center;align-items:center;';
    modal.id = 'adminLoginModal';
    
    var innerHTML = '';
    innerHTML += '<div style="background:#1e293b;padding:35px;border-radius:16px;max-width:420px;width:90%;border:1px solid #334155;">';
    innerHTML += '<div style="text-align:center;font-size:50px;margin-bottom:15px;">🔐</div>';
    innerHTML += '<h3 style="color:#3b82f6;margin-bottom:20px;text-align:center;">Admin Login</h3>';
    innerHTML += '<div class="form-group">';
    innerHTML += '<label style="color:#94a3b8;">Enter Password</label>';
    innerHTML += '<input type="password" id="adminPassInput" placeholder="Enter admin password..." style="width:100%;padding:14px;background:#0f172a;border:1px solid #334155;color:white;border-radius:8px;font-size:16px;">';
    innerHTML += '</div>';
    innerHTML += '<p id="loginErr" style="color:#ef4444;display:none;margin-bottom:10px;text-align:center;">❌ Wrong password!</p>';
    innerHTML += '<button onclick="verifyAdmin()" style="width:100%;background:#10b981;color:white;border:none;padding:14px;border-radius:8px;font-size:16px;cursor:pointer;font-weight:bold;margin-top:10px;">✅ Login as Admin</button>';
    innerHTML += '<button onclick="closeAdminLogin()" style="width:100%;background:#334155;color:white;border:none;padding:12px;border-radius:8px;margin-top:10px;cursor:pointer;">Cancel</button>';
    innerHTML += '</div>';
    
    modal.innerHTML = innerHTML;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
    
    setTimeout(function() {
        var input = document.getElementById('adminPassInput');
        if (input) input.focus();
    }, 200);
}

function closeAdminLogin() {
    var modal = document.getElementById('adminLoginModal');
    if (modal) modal.remove();
}

// ========== VERIFY ADMIN PASSWORD ==========
function verifyAdmin() {
    var password = document.getElementById('adminPassInput').value;
    
    if (password === ADMIN_PASSWORD) {
        adminLoggedIn = true;
        sessionStorage.setItem('nsAdminLogin', 'true');
        
        var modal = document.getElementById('adminLoginModal');
        if (modal) modal.remove();
        
        document.getElementById('adminBtn').textContent = '🔓 Exit Admin';
        document.getElementById('adminBtn').style.background = '#10b981';
        
        showAdminPage();
        updateAdminBadge();
        showNotif('✅ Welcome Admin!', 'success');
    } else {
        document.getElementById('loginErr').style.display = 'block';
        document.getElementById('adminPassInput').value = '';
        document.getElementById('adminPassInput').focus();
    }
}

// ========== SHOW ADMIN PAGE ==========
function showAdminPage() {
    if (!adminLoggedIn) {
        showAdminLogin();
        return;
    }
    
    var allPages = document.querySelectorAll('.page');
    for (var i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('active');
    }
    document.getElementById('adminPage').classList.add('active');
    showAdminTab('orders');
}

// ========== ADMIN TABS ==========
function showAdminTab(tab) {
    if (!adminLoggedIn) return;
    
    var tabs = document.querySelectorAll('.admin-tabs button');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active-tab');
    }
    
    if (tab === 'orders' && tabs[0]) tabs[0].classList.add('active-tab');
    if (tab === 'products' && tabs[1]) tabs[1].classList.add('active-tab');
    if (tab === 'users' && tabs[2]) tabs[2].classList.add('active-tab');
    if (tab === 'stats' && tabs[3]) tabs[3].classList.add('active-tab');
    
    var content = document.getElementById('adminContent');
    
    if (tab === 'orders') showAdminOrders();
    if (tab === 'products') showAdminProducts();
    if (tab === 'users') showAdminUsers();
    if (tab === 'stats') showAdminStats();
}

// ========== ADMIN ORDERS ==========
function showAdminOrders() {
    var content = document.getElementById('adminContent');
    var pendingOrders = [];
    
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === 'pending') {
            pendingOrders.push(orders[i]);
        }
    }
    
    var html = '<h4 style="margin-bottom:20px;font-size:18px;">⏳ Pending Orders (' + pendingOrders.length + ')</h4>';
    
    if (pendingOrders.length === 0) {
        html += '<div style="text-align:center;padding:50px;background:#1e293b;border-radius:12px;">';
        html += '<div style="font-size:60px;">✅</div>';
        html += '<p style="color:#10b981;font-size:18px;">No pending orders!</p>';
        html += '<p style="color:#94a3b8;">All caught up 🎉</p>';
        html += '</div>';
    } else {
        for (var j = 0; j < pendingOrders.length; j++) {
            var order = pendingOrders[j];
            
            html += '<div class="order-card" style="border-left:5px solid #f59e0b;margin-bottom:15px;">';
            
            // Order header
            html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
            html += '<div><h4 style="font-size:18px;">Order #' + order.id + '</h4>';
            html += '<small style="color:#94a3b8;">📅 ' + order.date + '</small></div>';
            html += '<span style="background:#f59e0b;color:black;padding:6px 14px;border-radius:20px;font-weight:bold;font-size:13px;">⏳ PENDING</span>';
            html += '</div>';
            
            if (order.userUpiId) {
                html += '<p style="color:#94a3b8;margin:5px 0;">👤 Customer UPI: <strong>' + order.userUpiId + '</strong></p>';
            }
            
            if (order.userId) {
                var customer = null;
                for (var u = 0; u < users.length; u++) {
                    if (users[u].id === order.userId) {
                        customer = users[u];
                        break;
                    }
                }
                if (customer) {
                    html += '<p style="color:#94a3b8;margin:5px 0;">👤 Customer: <strong>' + customer.name + '</strong> (' + customer.email + ')</p>';
                }
            }
            
            // Order items
            html += '<div style="background:#0f172a;padding:15px;border-radius:10px;margin:12px 0;">';
            for (var k = 0; k < order.items.length; k++) {
                var item = order.items[k];
                html += '<div style="display:flex;justify-content:space-between;padding:5px 0;">';
                html += '<span>' + item.icon + ' ' + item.name + ' × ' + item.qty + '</span>';
                html += '<span style="color:#3b82f6;">₹' + (item.price * item.qty) + '</span>';
                html += '</div>';
            }
            html += '<hr style="border-color:#334155;margin:10px 0;">';
            html += '<div style="display:flex;justify-content:space-between;">';
            html += '<strong>Total:</strong>';
            html += '<strong style="color:#10b981;font-size:20px;">₹' + order.total + '</strong>';
            html += '</div></div>';
            
            // Screenshot
            if (order.screenshot) {
                html += '<div style="margin:12px 0;">';
                html += '<strong style="color:#94a3b8;">📸 Payment Proof:</strong><br>';
                html += '<img src="' + order.screenshot + '" style="max-width:250px;border-radius:8px;cursor:pointer;border:2px solid #334155;margin-top:5px;" onclick="window.open(this.src)">';
                html += '</div>';
            } else {
                html += '<p style="color:#ef4444;">⚠️ No screenshot uploaded!</p>';
            }
            
            // Action buttons
            html += '<div style="display:flex;gap:12px;margin-top:18px;">';
            html += '<button onclick="approveOrder(\'' + order.id + '\')" style="background:#10b981;color:white;border:none;padding:14px;border-radius:10px;flex:1;cursor:pointer;font-weight:bold;font-size:15px;">✅ Approve Payment</button>';
            html += '<button onclick="rejectOrder(\'' + order.id + '\')" style="background:#ef4444;color:white;border:none;padding:14px;border-radius:10px;flex:1;cursor:pointer;font-weight:bold;font-size:15px;">❌ Reject</button>';
            html += '</div>';
            
            html += '</div>';
        }
    }
    
    content.innerHTML = html;
}

// ========== APPROVE ORDER ==========
function approveOrder(orderId) {
    if (!confirm('✅ Approve this payment?\n\nCustomer will be able to download files.')) return;
    
    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
            break;
        }
    }
    
    if (order) {
        order.status = 'approved';
        order.approvedAt = new Date().toLocaleString();
        saveAll();
        showAdminOrders();
        updateAdminBadge();
        showNotif('✅ Order #' + orderId + ' approved!', 'success');
    }
}

// ========== REJECT ORDER ==========
function rejectOrder(orderId) {
    var reason = prompt('❌ Reason for rejection:');
    if (!reason) return;
    
    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
            break;
        }
    }
    
    if (order) {
        order.status = 'rejected';
        order.reason = reason;
        order.rejectedAt = new Date().toLocaleString();
        saveAll();
        showAdminOrders();
        updateAdminBadge();
        showNotif('❌ Order #' + orderId + ' rejected', 'error');
    }
}

// ========== ADMIN PRODUCTS ==========
function showAdminProducts() {
    var content = document.getElementById('adminContent');
    
    var html = '';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">';
    html += '<h4 style="font-size:18px;">📦 Total Products: ' + products.length + '</h4>';
    html += '<button onclick="showProductForm()" style="background:#10b981;color:white;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;">➕ Add New Product</button>';
    html += '</div>';
    
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        
        html += '<div class="order-card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;">';
        html += '<div style="display:flex;align-items:center;gap:15px;flex:1;min-width:250px;">';
        html += '<div style="font-size:45px;">' + p.icon + '</div>';
        html += '<div>';
        html += '<h4 style="font-size:16px;">' + p.name + '</h4>';
        html += '<span class="product-category">' + p.category.toUpperCase() + '</span>';
        html += '<p style="color:#94a3b8;font-size:13px;margin:5px 0;">' + p.desc + '</p>';
        html += '<p>';
        html += '<span style="color:#3b82f6;font-size:18px;font-weight:bold;">₹' + (p.salePrice || p.price) + '</span>';
        if (p.salePrice) html += '<span class="old-price">₹' + p.price + '</span>';
        if (p.featured) html += '<span style="color:#f59e0b;margin-left:8px;">⭐ Featured</span>';
        if (p.downloadLink) {
            html += '<span style="color:#10b981;margin-left:8px;font-size:12px;">🔗 Download Ready</span>';
        } else {
            html += '<span style="color:#ef4444;margin-left:8px;font-size:12px;">⚠️ No Link</span>';
        }
        html += '</p>';
        html += '</div></div>';
        
        html += '<div style="display:flex;gap:10px;">';
        html += '<button onclick="showProductForm(' + p.id + ')" style="background:#3b82f6;color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;">✏️ Edit</button>';
        html += '<button onclick="deleteProduct(' + p.id + ')" style="background:#ef4444;color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;">🗑️ Delete</button>';
        html += '</div>';
        html += '</div>';
    }
    
    content.innerHTML = html;
}

// ========== PRODUCT FORM ==========
function showProductForm(productId) {
    var product = null;
    if (productId) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                product = products[i];
                break;
            }
        }
    }
    
    var isEdit = (product !== null);
    
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:2000;display:flex;justify-content:center;align-items:center;padding:20px;';
    modal.id = 'productFormModal';
    
    var html = '';
    html += '<div style="background:#1e293b;padding:30px;border-radius:16px;max-width:550px;width:100%;max-height:85vh;overflow-y:auto;border:1px solid #334155;">';
    
    html += '<h3 style="color:#3b82f6;margin-bottom:25px;font-size:20px;">';
    html += isEdit ? '✏️ Edit Product' : '➕ Add New Product';
    html += '</h3>';
    
