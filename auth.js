// ==========================================
// NS CODE STORE - Auth System v2.0
// ==========================================

// Current logged in user
let currentUser = JSON.parse(localStorage.getItem('nsCurrentUser')) || null;

// All users list
let users = JSON.parse(localStorage.getItem('nsAllUsers')) || [];

// Admin user add karo agar nahi hai
function initAdmin() {
    var adminExists = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].isAdmin) {
            adminExists = true;
            break;
        }
    }
    
    if (!adminExists) {
        users.push({
            id: 'admin_' + Date.now(),
            name: 'Store Admin',
            email: 'admin@nscodestore.com',
            phone: '0000000000',
            password: 'nsadmin123',
            avatar: '',
            joinDate: new Date().toLocaleDateString(),
            totalSpent: 0,
            totalOrders: 0,
            isAdmin: true,
            emailVerified: true
        });
        saveUsers();
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('nsAllUsers', JSON.stringify(users));
}

// Save current user
function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('nsCurrentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('nsCurrentUser');
    }
    updateUserUI();
}

// ========== UPDATE UI FOR LOGGED IN USER ==========
function updateUserUI() {
    var userBtn = document.getElementById('userBtn');
    if (!userBtn) return;
    
    if (currentUser) {
        userBtn.textContent = '👤 ' + currentUser.name;
        userBtn.style.background = '#10b981';
        userBtn.onclick = function() {
            showUserMenu();
        };
    } else {
        userBtn.textContent = '👤 Login';
        userBtn.style.background = '#334155';
        userBtn.onclick = function() {
            showAuthModal('login');
        };
    }
}

// ========== USER MENU DROPDOWN ==========
function showUserMenu() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    // Remove existing menu
    var existingMenu = document.getElementById('userMenuDropdown');
    if (existingMenu) existingMenu.remove();
    
    var menu = document.createElement('div');
    menu.id = 'userMenuDropdown';
    menu.style.cssText = 'position:fixed;top:65px;right:20px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:10px;z-index:1500;min-width:220px;box-shadow:0 10px 40px rgba(0,0,0,0.6);';
    
    menu.innerHTML = `
        <div style="padding:12px;border-bottom:1px solid #334155;">
            <strong style="font-size:16px;">${currentUser.name}</strong>
            <br><small style="color:#94a3b8;">${currentUser.email}</small>
            ${currentUser.isAdmin ? '<br><span style="color:#f59e0b;font-size:11px;">👑 Admin</span>' : ''}
        </div>
        <button onclick="showPage('profile');closeUserMenu();" style="display:block;width:100%;padding:10px;background:none;border:none;color:white;text-align:left;cursor:pointer;border-radius:6px;font-size:14px;">👤 My Profile</button>
        <button onclick="showPage('orders');closeUserMenu();" style="display:block;width:100%;padding:10px;background:none;border:none;color:white;text-align:left;cursor:pointer;border-radius:6px;font-size:14px;">📋 My Orders</button>
        <button onclick="showPage('wishlist');closeUserMenu();" style="display:block;width:100%;padding:10px;background:none;border:none;color:white;text-align:left;cursor:pointer;border-radius:6px;font-size:14px;">❤️ Wishlist</button>
        <hr style="border-color:#334155;margin:5px 0;">
        <button onclick="logout();closeUserMenu();" style="display:block;width:100%;padding:10px;background:#ef4444;border:none;color:white;text-align:center;cursor:pointer;border-radius:6px;font-size:14px;font-weight:bold;">🚪 Logout</button>
    `;
    
    document.body.appendChild(menu);
    
    // Close menu on outside click
    setTimeout(function() {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target.id !== 'userBtn') {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function closeUserMenu() {
    var menu = document.getElementById('userMenuDropdown');
    if (menu) menu.remove();
}

// ========== LOGOUT ==========
function logout() {
    // Save user cart before logout
    if (currentUser) {
        localStorage.setItem('nsCart_' + currentUser.id, JSON.stringify(cart));
    }
    
    currentUser = null;
    saveCurrentUser();
    cart = [];
    saveAll();
    updateCartUI();
    showPage('home');
    showNotif('👋 Logged out successfully!', 'info');
}

// ========== HANDLE USER BUTTON CLICK ==========
function handleUserClick() {
    if (currentUser) {
        showUserMenu();
    } else {
        showAuthModal('login');
    }
}

// ========== SHOW AUTH MODAL ==========
function showAuthModal(mode) {
    var modal = document.getElementById('authModal');
    var title = document.getElementById('authTitle');
    var content = document.getElementById('authContent');
    
    if (mode === 'login') {
        title.textContent = '🔐 Login to Your Account';
        content.innerHTML = getLoginForm();
    } else {
        title.textContent = '📝 Create New Account';
        content.innerHTML = getRegisterForm();
    }
    
    modal.classList.add('active');
}

function closeAuth() {
    document.getElementById('authModal').classList.remove('active');
}

// ========== LOGIN FORM ==========
function getLoginForm() {
    return `
        <div class="form-group">
            <label>📧 Email Address</label>
            <input type="email" id="loginEmail" placeholder="Enter your email" autocomplete="email">
        </div>
        <div class="form-group">
            <label>🔒 Password</label>
            <input type="password" id="loginPassword" placeholder="Enter password" autocomplete="current-password">
        </div>
        <p id="loginError" style="color:#ef4444;display:none;margin-bottom:10px;font-size:14px;"></p>
        <button onclick="loginUser()" class="auth-btn btn-success">✅ Login</button>
        <p style="text-align:center;margin-top:18px;color:#94a3b8;">
            Don't have an account? 
            <span class="auth-link" onclick="showAuthModal('register')">Register here</span>
        </p>
        <p style="text-align:center;color:#64748b;font-size:11px;margin-top:12px;">
            Demo: admin@nscodestore.com / nsadmin123
        </p>
    `;
}

// ========== REGISTER FORM ==========
function getRegisterForm() {
    return `
        <div class="form-group">
            <label>👤 Full Name *</label>
            <input type="text" id="regName" placeholder="Enter your full name">
        </div>
        <div class="form-group">
            <label>📧 Email Address *</label>
            <input type="email" id="regEmail" placeholder="Enter your email">
        </div>
        <div class="form-group">
            <label>📱 Phone Number</label>
            <input type="tel" id="regPhone" placeholder="Enter phone number (optional)">
        </div>
        <div class="form-group">
            <label>🔒 Password *</label>
            <input type="password" id="regPassword" placeholder="Minimum 6 characters">
        </div>
        <div class="form-group">
            <label>🔒 Confirm Password *</label>
            <input type="password" id="regConfirmPassword" placeholder="Re-enter password">
        </div>
        <p id="regError" style="color:#ef4444;display:none;margin-bottom:10px;font-size:14px;"></p>
        <button onclick="registerUser()" class="auth-btn btn-primary">🚀 Create Account</button>
        <p style="text-align:center;margin-top:18px;color:#94a3b8;">
            Already have an account? 
            <span class="auth-link" onclick="showAuthModal('login')">Login here</span>
        </p>
    `;
}

// ========== LOGIN USER ==========
function loginUser() {
    var email = document.getElementById('loginEmail').value.trim().toLowerCase();
    var password = document.getElementById('loginPassword').value;
    var errorEl = document.getElementById('loginError');
    
    // Validation
    if (!email || !password) {
        errorEl.textContent = '❌ Please fill all fields!';
        errorEl.style.display = 'block';
        return;
    }
    
    // Find user
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email && users[i].password === password) {
            user = users[i];
            break;
        }
    }
    
    if (!user) {
        errorEl.textContent = '❌ Invalid email or password!';
        errorEl.style.display = 'block';
        return;
    }
    
    // Login success
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        joinDate: user.joinDate,
        totalSpent: user.totalSpent,
        totalOrders: user.totalOrders,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified
    };
    
    saveCurrentUser();
    
    // Load user's cart
    loadUserCart();
    
    closeAuth();
    showNotif('🎉 Welcome back, ' + user.name + '!', 'success');
    showPage('home');
}

// ========== REGISTER USER ==========
function registerUser() {
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim().toLowerCase();
    var phone = document.getElementById('regPhone').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirmPassword = document.getElementById('regConfirmPassword').value;
    var errorEl = document.getElementById('regError');
    
    // Validations
    if (!name || !email || !password || !confirmPassword) {
        errorEl.textContent = '❌ Please fill all required fields!';
        errorEl.style.display = 'block';
        return;
    }
    
    if (name.length < 2) {
        errorEl.textContent = '❌ Name must be at least 2 characters!';
        errorEl.style.display = 'block';
        return;
    }
    
    // Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorEl.textContent = '❌ Please enter a valid email!';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorEl.textContent = '❌ Password must be at least 6 characters!';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        errorEl.textContent = '❌ Passwords do not match!';
        errorEl.style.display = 'block';
        return;
    }
    
    // Check email already exists
    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email) {
            errorEl.textContent = '❌ Email already registered!';
            errorEl.style.display = 'block';
            return;
        }
    }
    
    // Create new user
    var newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        phone: phone || 'Not provided',
        password: password,
        avatar: '',
        joinDate: new Date().toLocaleDateString(),
        totalSpent: 0,
        totalOrders: 0,
        isAdmin: false,
        emailVerified: false
    };
    
    users.push(newUser);
    saveUsers();
    
    // Auto login
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        joinDate: newUser.joinDate,
        totalSpent: newUser.totalSpent,
        totalOrders: newUser.totalOrders,
        isAdmin: newUser.isAdmin,
        emailVerified: newUser.emailVerified
    };
    
    saveCurrentUser();
    closeAuth();
    showNotif('🎉 Account created! Welcome, ' + name + '!', 'success');
    showPage('home');
}

// ========== LOAD USER CART ==========
function loadUserCart() {
    if (currentUser) {
        var userCart = localStorage.getItem('nsCart_' + currentUser.id);
        cart = userCart ? JSON.parse(userCart) : [];
    } else {
        cart = [];
    }
    saveAll();
    updateCartUI();
}

// Override saveAll to save user-specific cart
var originalSaveAll = saveAll;
saveAll = function() {
    originalSaveAll();
    if (currentUser) {
        localStorage.setItem('nsCart_' + currentUser.id, JSON.stringify(cart));
    }
};

// ========== SHOW PROFILE PAGE ==========
function showProfilePage() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    var content = document.getElementById('profileContent');
    
    // Get user orders
    var userOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].userId === currentUser.id) {
            userOrders.push(orders[i]);
        }
    }
    
    var totalSpent = 0;
    for (var j = 0; j < userOrders.length; j++) {
        if (userOrders[j].status === 'approved') {
            totalSpent = totalSpent + userOrders[j].total;
        }
    }
    
    var avatarLetter = currentUser.name.charAt(0).toUpperCase();
    
    content.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">${avatarLetter}</div>
                <h3 style="font-size:22px;">${currentUser.name}</h3>
                <p style="color:#94a3b8;">${currentUser.email}</p>
                ${currentUser.emailVerified ? '<span style="color:#10b981;">✅ Verified Account</span>' : '<span style="color:#f59e0b;">⚠️ Email Not Verified</span>'}
                ${currentUser.isAdmin ? '<br><span style="color:#f59e0b;">👑 Administrator</span>' : ''}
            </div>
            
            <div class="profile-stats">
                <div class="stat-box">
                    <h3>${userOrders.length}</h3>
                    <p>Total Orders</p>
                </div>
                <div class="stat-box">
                    <h3>₹${totalSpent}</h3>
                    <p>Total Spent</p>
                </div>
                <div class="stat-box">
                    <h3>${currentUser.joinDate}</h3>
                    <p>Member Since</p>
                </div>
            </div>
            
            <div style="background:#0f172a;padding:18px;border-radius:10px;margin:15px 0;border:1px solid #334155;">
                <p style="margin:8px 0;"><strong>📧 Email:</strong> ${currentUser.email}</p>
                <p style="margin:8px 0;"><strong>📱 Phone:</strong> ${currentUser.phone}</p>
                <p style="margin:8px 0;"><strong>🆔 User ID:</strong> ${currentUser.id}</p>
                <p style="margin:8px 0;"><strong>📅 Joined:</strong> ${currentUser.joinDate}</p>
            </div>
            
            <div class="profile-actions">
                <button class="edit-profile-btn" onclick="editProfile()">✏️ Edit Profile</button>
                <button class="logout-btn" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
    `;
}

// ========== EDIT PROFILE ==========
function editProfile() {
    if (!currentUser) return;
    
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:2000;display:flex;justify-content:center;align-items:center;';
    modal.id = 'editProfileModal';
    
    modal.innerHTML = `
        <div style="background:#1e293b;padding:30px;border-radius:12px;max-width:450px;width:90%;border:1px solid #334155;">
            <h3 style="color:#3b82f6;margin-bottom:20px;">✏️ Edit Profile</h3>
            
            <div class="form-group">
                <label>👤 Name</label>
                <input type="text" id="editName" value="${currentUser.name}" style="width:100%;padding:12px;background:#0f172a;border:1px solid #334155;color:white;border-radius:8px;">
            </div>
            
            <div class="form-group">
                <label>📱 Phone</label>
                <input type="tel" id="editPhone" value="${currentUser.phone}" style="width:100%;padding:12px;background:#0f172a;border:1px solid #334155;color:white;border-radius:8px;">
            </div>
            
            <div class="form-group">
                <label>🔒 New Password (leave blank to keep current)</label>
                <input type="password" id="editPassword" placeholder="Enter new password" style="width:100%;padding:12px;background:#0f172a;border:1px solid #334155;color:white;border-radius:8px;">
            </div>
            
            <div style="display:flex;gap:10px;margin-top:20px;">
                <button onclick="saveProfile()" style="background:#10b981;color:white;border:none;padding:12px;border-radius:8px;flex:1;cursor:pointer;font-weight:bold;">💾 Save Changes</button>
                <button onclick="document.getElementById('editProfileModal').remove()" style="background:#334155;color:white;border:none;padding:12px;border-radius:8px;flex:1;cursor:pointer;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}

// ========== SAVE PROFILE ==========
function saveProfile() {
    var newName = document.getElementById('editName').value.trim();
    var newPhone = document.getElementById('editPhone').value.trim();
    var newPassword = document.getElementById('editPassword').value;
    
    if (!newName) {
        showNotif('❌ Name cannot be empty!', 'error');
        return;
    }
    
    // Update current user
    currentUser.name = newName;
    currentUser.phone = newPhone || 'Not provided';
    
    // Update in users array
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            users[i].name = newName;
            users[i].phone = newPhone || 'Not provided';
            if (newPassword && newPassword.length >= 6) {
                users[i].password = newPassword;
            }
            break;
        }
    }
    
    saveUsers();
    saveCurrentUser();
    
    document.getElementById('editProfileModal').remove();
    showProfilePage();
    showNotif('✅ Profile updated successfully!', 'success');
}
// ========== SHOW WISHLIST PAGE ==========
function showWishlistPage() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    var wishlist = JSON.parse(localStorage.getItem('nsWishlist_' + currentUser.id)) || [];
    var content = document.getElementById('wishlistContent');
    
    if (wishlist.length === 0) {
        content.innerHTML = '<div style="text-align:center;padding:50px;"><div style="font-size:60px;">❤️</div><p style="color:#94a3b8;font-size:18px;">Your wishlist is empty</p><p style="color:#64748b;">Add products you love!</p></div>';
        return;
    }
    
    var html = '<div class="product-grid">';
    for (var i = 0; i < wishlist.length; i++) {
        var product = null;
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === wishlist[i]) {
                product = products[j];
                break;
            }
        }
        
        if (product) {
            html += '<div class="product-card" style="position:relative;">';
            html += '<span onclick="removeFromWishlist(' + product.id + ')" style="position:absolute;top:10px;right:10px;font-size:24px;cursor:pointer;z-index:10;">💔</span>';
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
