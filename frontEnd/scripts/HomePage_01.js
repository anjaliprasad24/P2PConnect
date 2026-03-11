// HomePage.js - paste whole file (replace old file)

// run after DOM ready
document.addEventListener('DOMContentLoaded', function() {

    const BACKEND = window.location.origin && window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:4000';
    const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="Arial" font-size="24">No Image</text></svg>';

    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch (_) { return null; }
    }
    function getCartKey() {
        const u = getCurrentUser();
        const email = u && u.email ? u.email : 'guest';
        return `cartItems:${email}`;
    }
    function migrateLegacyCartIfNeeded() {
        const legacy = localStorage.getItem('cartItems');
        const perUserKey = getCartKey();
        if (legacy && !localStorage.getItem(perUserKey)) {
            localStorage.setItem(perUserKey, legacy);
            // Do not remove legacy immediately to allow other pages to migrate once; optional cleanup later
        }
    }
    function getCart() {
        migrateLegacyCartIfNeeded();
        const key = getCartKey();
        return JSON.parse(localStorage.getItem(key)) || [];
    }
    function saveCart(cart) {
        const key = getCartKey();
        localStorage.setItem(key, JSON.stringify(cart));
    }

    // -- Fetch products from backend and render them --
    async function loadProducts() {
        try {
            const res = await fetch('/api/products'); // use same-origin Spring Boot backend
            const products = await res.json();

            const grid = document.getElementById('productsGrid');
            if (!grid) return; // safety

            grid.innerHTML = ''; // clear

            products.forEach(p => {
                const card = document.createElement('div');
                card.classList.add('product-card');

                // store for filtering/formatting
                card.dataset.category = p.category || 'other';
                card.dataset.condition = p.condition || '';
                card.dataset.mfgDate = p.mfgDate || '';
                card.dataset.expiration = p.expirationDate || '';

                // card HTML (keeps your existing structure/styles)
                card.innerHTML = `
                    <div>
                        <div class="product-image">
                            <img src="" alt="${p.name || ''}"
                                 style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                        </div>
                        <h3 class="product-title">${p.name || 'Unnamed Product'}</h3>
                        <div class="product-price">₹${p.price ?? ''}</div>
                        <p class="product-description">${p.description || ''}</p>
                        <div class="product-condition"></div>
                        <div class="product-date mfg-date"></div>
                    </div>
                    <div class="add-to-cart-section">
                        <div class="quantity-selector">
                            <label for="quantity">Quantity:</label>
                            <input type="number" value="1" min="1" max="${p.stock || 10}">
                        </div>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                `;

                const imgEl = card.querySelector('.product-image img');
                const rawImg = p.image || '';
                const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : BACKEND + rawImg) : PLACEHOLDER;
                imgEl.src = imgSrc;

                const btn = card.querySelector('.add-to-cart-btn');
                const qtyInput = card.querySelector('input[type="number"]');
                btn.addEventListener('click', () => {
                    const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
                    const cart = getCart();
                    const existing = cart.find(it => String(it.id) === String(p.id));
                    if (existing) {
                        existing.quantity += qty;
                    } else {
                        cart.push({
                            id: p.id,
                            name: p.name || '',
                            description: p.description || '',
                            image: p.image || '',
                            price: Number(p.price) || 0,
                            quantity: qty
                        });
                    }
                    saveCart(cart);
                });

                grid.appendChild(card);
            });

            // fill condition / date text
            updateProductDetails();

        } catch (err) {
            console.error('Error loading products:', err);
            const grid = document.getElementById('productsGrid');
            if (grid) grid.innerHTML = '<p style="text-align:center;color:red;">Failed to load products</p>';
        }
    }

    loadProducts(); // initial load

    // -- update condition & date fields inside cards --
    function updateProductDetails() {
        document.querySelectorAll('.product-card').forEach(card => {
            const conditionEl = card.querySelector('.product-condition');
            const dateEl = card.querySelector('.product-date');

            const condition = card.dataset.condition;
            const category = card.dataset.category;
            const expiration = card.dataset.expiration;
            const mfg = card.dataset.mfgDate;

            if (conditionEl) {
                conditionEl.textContent = condition ? 'Condition: ' + condition : '';
            }

            if (dateEl) {
                if (category === 'food' && expiration) dateEl.textContent = 'Expires on: ' + expiration;
                else if (mfg) dateEl.textContent = 'Manufactured on: ' + mfg;
                else dateEl.textContent = '';
            }
        });
    }

    // Allow anchor links to work via their hrefs; no JS interception needed.

    // -- filter buttons (unchanged logic) --
    window.filterProducts = function(category, activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (activeButton) activeButton.classList.add('active');

        document.querySelectorAll('.product-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) card.classList.remove('hide');
            else card.classList.add('hide');
        });
    };

}); // end DOMContentLoaded


// ===== Sidebar toggle MUST be global for inline onclick handlers =====
// Keep this OUTSIDE DOMContentLoaded so HTML onclick="toggleMenu()" can find it.
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    // safety checks
    if (!menu || !overlay) {
        // if elements not found, log and return
        console.warn('toggleMenu: sideMenu or overlay not found');
        return;
    }

    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
