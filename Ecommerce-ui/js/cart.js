// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Handle add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        }
    });
    
    // Handle cart dropdown toggle
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('show');
            renderCartItems();
        });
        
        // Close cart dropdown when clicking outside
        document.addEventListener('click', function() {
            cartDropdown.classList.remove('show');
        });
        
        cartDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle view cart button
    const viewCartBtn = document.getElementById('view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            // In a real app, this would navigate to a cart page
            showToast('Cart page would open here', 'info');
        });
    }
    
    // Handle checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // In a real app, this would navigate to a checkout page
            showToast('Checkout page would open here', 'info');
        });
    }
});

// Add product to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Increment quantity if product is already in cart
        existingItem.quantity += 1;
        showToast(`${product.name} quantity updated!`, 'info');
    } else {
        // Add new product to cart
        cart.push({
            ...product,
            quantity: 1
        });
        showToast(`${product.name} added to cart!`, 'success');
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Animate the add to cart button
    const btn = document.querySelector(`.add-to-cart-btn[data-product-id="${productId}"]`);
    if (btn) {
        btn.classList.add('added');
        setTimeout(() => {
            btn.classList.remove('added');
        }, 1000);
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== parseInt(productId));
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Re-render cart items
    renderCartItems();
    
    showToast('Item removed from cart', 'info');
}

// Update cart quantity
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the item to update
    const item = cart.find(item => item.id === parseInt(productId));
    
    if (item) {
        // Update quantity
        item.quantity += change;
        
        // Remove item if quantity is 0 or less
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Re-render cart items
            renderCartItems();
        }
    }
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count
        cartCount.textContent = totalItems;
        
        // Show/hide cart count based on whether there are items
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Render cart items in dropdown
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems) return;
    
    // Clear current cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        // Hide empty cart message
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';
        
        // Calculate total price
        let totalPrice = 0;
        
        // Render each cart item
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-center py-2 border-b';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3">
                <div class="flex-grow">
                    <h4 class="text-sm font-medium">${item.name}</h4>
                    <p class="text-xs text-gray-500">₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center">
                    <button class="quantity-btn text-gray-500 hover:text-gray-700 px-1" data-product-id="${item.id}" data-action="decrease">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="quantity-btn text-gray-500 hover:text-gray-700 px-1" data-product-id="${item.id}" data-action="increase">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                    <button class="remove-btn text-red-500 hover:text-red-700 ml-2" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Update total price
        if (cartTotal) {
            cartTotal.textContent = `₹${totalPrice}`;
        }
        
        // Add event listeners to quantity and remove buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const action = this.getAttribute('data-action');
                
                if (action === 'increase') {
                    updateQuantity(productId, 1);
                } else if (action === 'decrease') {
                    updateQuantity(productId, -1);
                }
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                removeFromCart(productId);
            });
        });
    }
}