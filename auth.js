html += '<div class="product-icon">' + product.icon + '</div>';
            html += '<span class="product-category">' + product.category.toUpperCase() + '</span>';
            html += '<h3 class="product-name">' + product.name + '</h3>';
            html += '<p class="product-desc">' + product.desc + '</p>';
            html += '<div class="product-price">';
            html += '<div><span class="price">₹' + (product.salePrice || product.price) + '</span></div>';
            html += '<button class="buy-btn" onclick="addToCart(' + product.id + ')">Add to Cart</button>';
            html += '</div></div>';
        }
    }
    html += '</div>';
    
    content.innerHTML = html;
}

// ========== ADD TO WISHLIST ==========
function addToWishlist(productId) {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    var wishlist = JSON.parse(localStorage.getItem('nsWishlist_' + currentUser.id)) || [];
    
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] === productId) {
            showNotif('❤️ Already in wishlist!', 'info');
            return;
        }
    }
    
    wishlist.push(productId);
    localStorage.setItem('nsWishlist_' + currentUser.id, JSON.stringify(wishlist));
    showNotif('❤️ Added to wishlist!', 'success');
}

// ========== REMOVE FROM WISHLIST ==========
function removeFromWishlist(productId) {
    if (!currentUser) return;
    
    var wishlist = JSON.parse(localStorage.getItem('nsWishlist_' + currentUser.id)) || [];
    var newWishlist = [];
    
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] !== productId) {
            newWishlist.push(wishlist[i]);
        }
    }
    
    localStorage.setItem('nsWishlist_' + currentUser.id, JSON.stringify(newWishlist));
    showWishlistPage();
    showNotif('💔 Removed from wishlist', 'info');
}

// ========== OVERRIDE SHOW PAGE ==========
var originalShowPage = showPage;
showPage = function(page) {
    if (page === 'profile') {
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        document.getElementById('profilePage').classList.add('active');
        showProfilePage();
        return;
    }
    
    if (page === 'wishlist') {
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        document.getElementById('wishlistPage').classList.add('active');
        showWishlistPage();
        return;
    }
    
    originalShowPage(page);
};

// ========== OVERRIDE SUBMIT ORDER ==========
var originalSubmitOrder = submitOrder;
submitOrder = function() {
    if (!currentUser) {
        showNotif('❌ Please login first!', 'error');
        showAuthModal('login');
        closeCheckout();
        return;
    }
    originalSubmitOrder();
    
    if (orders.length > 0) {
        orders[0].userId = currentUser.id;
        currentUser.totalOrders = (currentUser.totalOrders || 0) + 1;
        
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === currentUser.id) {
                users[i].totalOrders = currentUser.totalOrders;
                break;
            }
        }
        
        saveUsers();
        saveCurrentUser();
        saveAll();
        
        // Play sound for new order
        playOrderSound();
        
        // Update admin badge
        updateAdminBadge();
        
        // Send browser notification
        sendOrderNotification(orders[0].id, orders[0].total);
    }
};

// ========== OVERRIDE SHOW MY ORDERS ==========
var originalShowMyOrders = showMyOrders;
showMyOrders = function() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    var container = document.getElementById('myOrdersList');
    if (!container) return;
    
    var userOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].userId === currentUser.id) {
            userOrders.push(orders[i]);
        }
    }
    
    if (userOrders.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:50px;"><div style="font-size:60px;">📋</div><p style="color:#94a3b8;font-size:18px;">No orders yet</p><p style="color:#64748b;">Start shopping!</p></div>';
        return;
    }
    
    var tempOrders = orders;
    orders = userOrders;
    originalShowMyOrders();
    orders = tempOrders;
};

// ========== PLAY ORDER SOUND ==========
function playOrderSound() {
    try {
        var audio = document.getElementById('orderSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(function() {});
        }
    } catch(e) {}
}

// ========== UPDATE ADMIN BADGE ==========
function updateAdminBadge() {
    var badge = document.getElementById('adminBadge');
    if (!badge) return;
    
    var pendingCount = 0;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === 'pending') {
            pendingCount++;
        }
    }
    
    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// ========== SEND BROWSER NOTIFICATION ==========
function sendOrderNotification(orderId, total) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
        new Notification('🔔 New Order Received!', {
            body: 'Order #' + orderId + ' - ₹' + total,
            icon: '📦'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                new Notification('🔔 New Order Received!', {
                    body: 'Order #' + orderId + ' - ₹' + total,
                    icon: '📦'
                });
            }
        });
    }
}

// ========== AUTO REFRESH ADMIN ==========
setInterval(function() {
    updateAdminBadge();
    
    // Auto refresh admin orders if admin panel is open
    var adminPage = document.getElementById('adminPage');
    if (adminPage && adminPage.classList.contains('active') && adminLoggedIn) {
        var activeTab = document.querySelector('.admin-tabs button.active-tab');
        if (activeTab && activeTab.textContent.includes('Orders')) {
            showAdminOrders();
        }
    }
}, 30000); // 30 seconds

// ========== INITIALIZE ==========
initAdmin();
updateUserUI();
updateAdminBadge();

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Check if user was logged in
if (currentUser) {
    loadUserCart();
    updateUserUI();
}

console.log('🔐 Auth System Ready');
console.log('👤 Current User:', currentUser ? currentUser.name : 'None');
console.log('👥 Total Users:', users.length);
console.log('🔔 Notifications:', Notification.permission);
