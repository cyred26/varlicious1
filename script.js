document.addEventListener('DOMContentLoaded', function() {
    // Welcome screen transition
    const startBtn = document.getElementById('startOrderBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    
    if (startBtn && welcomeScreen) {
        startBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('slide-out');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
        });
    }
    
    // Category filtering system
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    function filterItems(category) {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Initialize with "All Items" selected
    filterItems('all');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterItems(category);
        });
    });

    // Toggle order bar
    const toggleOrderBtn = document.getElementById('toggleOrderBtn');
    const orderContent = document.getElementById('orderContent');
    
    toggleOrderBtn.addEventListener('click', function() {
        this.classList.toggle('collapsed');
        orderContent.classList.toggle('collapsed');
        
        // Update the button text
        if (this.classList.contains('collapsed')) {
            this.textContent = '▼';
        } else {
            this.textContent = '▲';
        }
    });

    // Order management
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const ordersList = document.getElementById('ordersList');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Order items storage
    let orderItems = [];
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Check if item already exists in the order
            const existingItemIndex = orderItems.findIndex(item => item.name === name);
            
            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                orderItems[existingItemIndex].quantity += 1;
            } else {
                // New item
                orderItems.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            // Ensure the order bar is expanded
            if (orderContent.classList.contains('collapsed')) {
                toggleOrderBtn.click();
            }
            
            // Update the order display
            updateOrderDisplay();
        });
    });
    
    // Update order display
    function updateOrderDisplay() {
        // Clear current orders list
        ordersList.innerHTML = '';
        
        if (orderItems.length === 0) {
            ordersList.innerHTML = '<div class="empty-order">Your order is empty</div>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            
            // Add each order item to the display
            orderItems.forEach((item, index) => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                
                orderItem.innerHTML = `
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">₱${item.price}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" data-index="${index}">-</button>
                        <span class="order-item-quantity">${item.quantity}</span>
                        <button class="qty-btn increase" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">×</button>
                    </div>
                `;
                
                ordersList.appendChild(orderItem);
            });
            
            // Add event listeners to the newly created buttons
            document.querySelectorAll('.qty-btn.decrease').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (orderItems[index].quantity > 1) {
                        orderItems[index].quantity -= 1;
                        updateOrderDisplay();
                    }
                });
            });
            
            document.querySelectorAll('.qty-btn.increase').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    orderItems[index].quantity += 1;
                    updateOrderDisplay();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    orderItems.splice(index, 1);
                    updateOrderDisplay();
                });
            });
        }
        
        // Update total
        let total = 0;
        orderItems.forEach(item => {
            total += item.price * item.quantity;
        });
        
        orderTotal.textContent = `₱${total}`;
    }
    
    // Initialize checkout button
    checkoutBtn.addEventListener('click', function() {
        alert('Thank you for your order! Your total is ₱' + orderTotal.textContent.substring(1));
        orderItems = [];
        updateOrderDisplay();
    });
});