document.addEventListener('DOMContentLoaded', function() {
        // Let anchors navigate via their hrefs; no interception needed
        renderCart();
});

        function getCart() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
        }
        function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        }
        function renderCart() {
        let cart = getCart();
        const cartLayout = document.getElementById('cartLayout');
        const cartList = document.getElementById('cartItemsList');
        const emptyCartDiv = document.getElementById('emptyCart');

        if (!cart || cart.length === 0) {
            cartLayout.style.display = 'none';
            emptyCartDiv.style.display = 'block';
            return;
        }
        cartLayout.style.display = 'grid';
        emptyCartDiv.style.display = 'none';
        cartList.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.setAttribute('data-id', item.id);
            itemElement.innerHTML = `
            <img class="item-image" src="${item.image || 'placeholder.jpg'}" alt="${item.name || 'Product image'}">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                <div class="quantity-controls">
                    <button class="qty-btn">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn">+</button>
                </div>
                <span class="item-price">₹${item.price.toLocaleString()}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="remove-btn" title="Remove item">🗑️</button>
            </div>
            `;
            // Quantity minus
            itemElement.querySelectorAll('.qty-btn')[0].addEventListener('click', function() {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(it => it.id != item.id);
            }
            saveCart(cart); renderCart();
            });
            // Quantity plus
            itemElement.querySelectorAll('.qty-btn')[1].addEventListener('click', function() {
            item.quantity++;
            saveCart(cart); renderCart();
            });
            // Remove button
            itemElement.querySelector('.remove-btn').addEventListener('click', function() {
            cart = cart.filter(it => it.id != item.id);
            saveCart(cart); renderCart();
            });
            cartList.appendChild(itemElement);
        });
        // Update summary after DOM updates
        updateCartDisplay(cart);
        updateSummary(cart);
        }
        function updateCartDisplay(cart) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('itemCount').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
        }
        function updateSummary(cart) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById('total').textContent = `₹${subtotal.toLocaleString()}`;
        }
        function proceedToCheckout() {
        let cart = getCart();
        if (cart && cart.length) {
            window.location.href = 'ConfirmationOrder_10.html';
        } else {
            alert('Your cart is empty!');
        }
        }
        function toggleMenu() {
        document.getElementById('sideMenu').classList.toggle('active');
        document.getElementById('overlay').classList.toggle('active');
        }