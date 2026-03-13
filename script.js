// script.js
(function() {
    // ---------- book data ----------
    const books = [
        { id: 'b1', title: 'The Paper Palace', author: 'Miranda Cowley Heller', price: 499 },
        { id: 'b2', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', price: 629 },
        { id: 'b3', title: 'The Name of the Wind', author: 'Patrick Rothfuss', price: 799 },
        { id: 'b4', title: 'Piranesi', author: 'Susanna Clarke', price: 550 },
        { id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', price: 620 },
        { id: 'b6', title: 'Circe', author: 'Madeline Miller', price: 480 },
        { id: 'b7', title: 'The House in the Cerulean Sea', author: 'T.J. Klune', price: 710 },
        { id: 'b8', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', price: 895 },
        { id: 'b9', title: 'Project Hail Mary', author: 'Andy Weir', price: 660 },
        { id: 'b10', title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', price: 720 }
    ];

    // ---------- cart state ----------
    let cart = {};

    // ---------- DOM elements ----------
    const booksGrid = document.getElementById('booksGrid');
    const cartCountSpan = document.getElementById('cart-count');
    
    // Flyout elements
    const flyout = document.getElementById('cartFlyout');
    const overlay = document.getElementById('flyoutOverlay');
    const closeFlyoutBtn = document.getElementById('closeFlyoutBtn');
    const cartSummaryBtn = document.getElementById('cart-summary-btn');
    const flyoutItemsContainer = document.getElementById('flyoutItemsContainer');
    const flyoutTotalSpan = document.getElementById('flyoutTotalAmount');
    const flyoutCheckout = document.getElementById('flyoutCheckoutBtn');

    // Navigation elements
    const homeLink = document.getElementById('home-link');
    const booksLink = document.getElementById('books-link');
    const aboutLink = document.getElementById('about-link');
    const booksSection = document.getElementById('booksSection');
    const aboutSection = document.getElementById('aboutSection');
    const stallBanner = document.getElementById('stallBanner');
    const navLinks = document.querySelectorAll('.nav-link');

    // ---------- render book grid ----------
    function renderBooks() {
        booksGrid.innerHTML = ''; 
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="cover-icon"><i class="fas fa-book" style="font-size: 3rem;"></i></div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-price">${book.price}</div>
                <button class="add-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}">
                    <i class="fas fa-cart-plus"></i> add to basket
                </button>
            `;
            booksGrid.appendChild(card);
        });

        // Attach event listeners to all "add to basket" buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const title = btn.dataset.title;
                const price = parseInt(btn.dataset.price, 10);
                addToCart(id, title, price);
            });
        });
    }

    // ---------- cart functions ----------
    function addToCart(id, title, price) {
        if (cart[id]) {
            cart[id].quantity += 1;
        } else {
            cart[id] = { id, title, price, quantity: 1 };
        }
        updateCartUI();
    }

    function removeOneFromCart(id) {
        if (cart[id]) {
            if (cart[id].quantity > 1) {
                cart[id].quantity -= 1;
            } else {
                delete cart[id];
            }
        }
        updateCartUI();
    }

    function deleteItemCompletely(id) {
        delete cart[id];
        updateCartUI();
    }

    function computeCartSummary() {
        let totalItems = 0, totalPrice = 0;
        Object.values(cart).forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });
        return { totalItems, totalPrice };
    }

    function updateCartUI() {
        const { totalItems, totalPrice } = computeCartSummary();
        cartCountSpan.textContent = totalItems;

        // update flyout content
        if (totalItems === 0) {
            flyoutItemsContainer.innerHTML = `<div class="empty-cart-msg">your basket is gathering dust... 📖</div>`;
        } else {
            let html = '';
            Object.values(cart).forEach(item => {
                html += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <span class="cart-item-title">${item.title}</span>
                            <span class="cart-item-price">${item.price}</span>
                        </div>
                        <div class="cart-item-actions">
                            <button class="qty-decrease" data-id="${item.id}"><i class="fas fa-minus-circle"></i></button>
                            <span class="item-qty">${item.quantity}</span>
                            <button class="qty-increase" data-id="${item.id}"><i class="fas fa-plus-circle"></i></button>
                            <button class="item-remove" data-id="${item.id}"><i class="fas fa-trash-can"></i></button>
                        </div>
                    </div>
                `;
            });
            flyoutItemsContainer.innerHTML = html;

            // attach listeners inside flyout
            flyoutItemsContainer.querySelectorAll('.qty-decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeOneFromCart(btn.dataset.id);
                });
            });
            flyoutItemsContainer.querySelectorAll('.qty-increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    if (cart[id]) addToCart(id, cart[id].title, cart[id].price);
                });
            });
            flyoutItemsContainer.querySelectorAll('.item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteItemCompletely(btn.dataset.id);
                });
            });
        }
        flyoutTotalSpan.textContent = totalPrice;
    }

    // ---------- flyout controls ----------
    function openFlyout() {
        flyout.classList.add('open');
        overlay.classList.add('show');
    }
    function closeFlyout() {
        flyout.classList.remove('open');
        overlay.classList.remove('show');
    }

    cartSummaryBtn.addEventListener('click', openFlyout);
    closeFlyoutBtn.addEventListener('click', closeFlyout);
    overlay.addEventListener('click', closeFlyout);

    flyoutCheckout.addEventListener('click', () => {
        const { totalItems } = computeCartSummary();
        if (totalItems === 0) {
            alert('Your basket is empty — add a book or two!');
        } else {
            alert('📦 Thanks for visiting the stall! (demo — no actual checkout)');
            closeFlyout();
        }
    });

    // ---------- navigation ----------
    function showHome() {
        stallBanner.classList.remove('hidden');
        booksSection.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        navLinks.forEach(l => l.classList.remove('active'));
        homeLink.classList.add('active');
    }
    function showBooks() {
        stallBanner.classList.remove('hidden');
        booksSection.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        navLinks.forEach(l => l.classList.remove('active'));
        booksLink.classList.add('active');
        booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function showAbout() {
        stallBanner.classList.add('hidden');
        booksSection.classList.add('hidden');
        aboutSection.classList.remove('hidden');
        navLinks.forEach(l => l.classList.remove('active'));
        aboutLink.classList.add('active');
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    homeLink.addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    booksLink.addEventListener('click', (e) => { e.preventDefault(); showBooks(); });
    aboutLink.addEventListener('click', (e) => { e.preventDefault(); showAbout(); });

    // ---------- initial rendering ----------
    renderBooks();
    updateCartUI();
    showHome(); // start with home view
})();