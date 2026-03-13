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
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalSpan = document.getElementById('cartTotalAmount');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Navigation elements
    const homeLink = document.getElementById('home-link');
    const booksLink = document.getElementById('books-link');
    const aboutLink = document.getElementById('about-link');
    const booksSection = document.getElementById('booksSection');
    const aboutSection = document.getElementById('aboutSection');
    const stallBanner = document.getElementById('stallBanner');
    const cartSection = document.getElementById('cartSection');
    const container = document.querySelector('.container');
    const navLinks = document.querySelectorAll('.nav-link');

    // ---------- render book grid ----------
    function renderBooks() {
        booksGrid.innerHTML = ''; 
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.setAttribute('data-book-id', book.id);
            card.innerHTML = `
                <div class="cover-icon">
                    <i class="fas fa-book" style="font-size: 3rem;"></i>
                </div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-price">${book.price}</div>
                <button class="add-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}">
                    <i class="fas fa-cart-plus"></i> add to basket
                </button>
            `;
            booksGrid.appendChild(card);
        });

        // Attach event listeners to add buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const title = btn.getAttribute('data-title');
                const price = parseInt(btn.getAttribute('data-price'), 10);
                addToCart(id, title, price);
            });
        });
    }

    // ---------- cart functions ----------
    function addToCart(id, title, price) {
        if (cart[id]) {
            cart[id].quantity += 1;
        } else {
            cart[id] = {
                id: id,
                title: title,
                price: price,
                quantity: 1
            };
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
        if (cart[id]) {
            delete cart[id];
        }
        updateCartUI();
    }

    function computeCartSummary() {
        let totalItems = 0;
        let totalPrice = 0;
        Object.values(cart).forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });
        return { totalItems, totalPrice };
    }

    function updateCartUI() {
        const { totalItems, totalPrice } = computeCartSummary();
        cartCountSpan.textContent = totalItems;

        if (totalItems === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-msg">your basket is gathering dust... 📖</div>`;
        } else {
            let htmlStr = '';
            Object.values(cart).forEach(item => {
                htmlStr += `
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
            cartItemsContainer.innerHTML = htmlStr;

            // Attach event listeners to cart item buttons
            cartItemsContainer.querySelectorAll('.qty-decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    removeOneFromCart(id);
                });
            });
            cartItemsContainer.querySelectorAll('.qty-increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    if (cart[id]) {
                        addToCart(id, cart[id].title, cart[id].price);
                    }
                });
            });
            cartItemsContainer.querySelectorAll('.item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    deleteItemCompletely(id);
                });
            });
        }

        cartTotalSpan.textContent = totalPrice;
    }

    // ---------- navigation functions ----------
    function showHome() {
        // Show banner
        stallBanner.classList.remove('hidden');
        
        // Show books section
        booksSection.classList.remove('hidden');
        
        // Hide about section
        aboutSection.classList.add('hidden');
        
        // Show cart in container
        cartSection.style.display = 'block';
        container.classList.remove('about-active');
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        homeLink.classList.add('active');
    }

    function showBooks() {
        // Show banner
        stallBanner.classList.remove('hidden');
        
        // Show books section
        booksSection.classList.remove('hidden');
        
        // Hide about section
        aboutSection.classList.add('hidden');
        
        // Show cart in container
        cartSection.style.display = 'block';
        container.classList.remove('about-active');
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        booksLink.classList.add('active');
        
        // Scroll to books section smoothly
        booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showAbout() {
        // Hide banner
        stallBanner.classList.add('hidden');
        
        // Hide books section
        booksSection.classList.add('hidden');
        
        // Show about section
        aboutSection.classList.remove('hidden');
        
        // Hide cart in container and adjust layout
        cartSection.style.display = 'none';
        container.classList.add('about-active');
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        aboutLink.classList.add('active');
        
        // Scroll to about section smoothly
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- event listeners ----------
    document.getElementById('cart-summary-btn').addEventListener('click', () => {
        if (!booksSection.classList.contains('hidden')) {
            cartSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    checkoutBtn.addEventListener('click', () => {
        const { totalItems } = computeCartSummary();
        if (totalItems === 0) {
            alert('Your basket is empty — add a book or two!');
        } else {
            alert('📦 Thanks for visiting the stall! (demo — no actual checkout)');
        }
    });

    // Navigation event listeners
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });

    booksLink.addEventListener('click', (e) => {
        e.preventDefault();
        showBooks();
    });

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
    });

    // ---------- initial rendering ----------
    renderBooks();
    updateCartUI();
    showHome(); // Start with home view
})();