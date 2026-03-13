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

    // ---------- cart state (object map for fast lookup) ----------
    let cart = {};  // key: bookId, value: { id, title, price, quantity }

    // ---------- DOM elements ----------
    const booksGrid = document.getElementById('booksGrid');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalSpan = document.getElementById('cartTotalAmount');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // ---------- utility: format currency (INR) ----------
    const formatPrice = (price) => price;  // we just display number, '₹' is added in css/html

    // ---------- render book grid ----------
    function renderBooks() {
        booksGrid.innerHTML = ''; 
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.setAttribute('data-book-id', book.id);
            // using emoji / fontawesome as cover
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

        // attach event listeners to all "add to cart" buttons (after they exist)
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
            // increase quantity
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

    // compute total items count and total price
    function computeCartSummary() {
        let totalItems = 0;
        let totalPrice = 0;
        Object.values(cart).forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });
        return { totalItems, totalPrice };
    }

    // render cart sidebar & update all badges
    function updateCartUI() {
        const { totalItems, totalPrice } = computeCartSummary();
        cartCountSpan.textContent = totalItems;

        // update cart items list
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

            // attach events for cart item buttons
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
                        // increase: add one more, same as add but we know title/price from cart
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

        // update total
        cartTotalSpan.textContent = totalPrice;   // ₹ sign is added via pseudo
    }

    // scroll to cart on small screens (optional behaviour for cart toggle)
    document.getElementById('cart-summary-btn').addEventListener('click', () => {
        document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // checkout button (demo)
    checkoutBtn.addEventListener('click', () => {
        const { totalItems } = computeCartSummary();
        if (totalItems === 0) {
            alert('Your basket is empty — add a book or two!');
        } else {
            alert('📦 Thanks for visiting the stall! (demo — no actual checkout)');
            // optional: clear cart after "checkout"? we just keep it for demo, but can reset
            // cart = {}; updateCartUI();   // if you want to clear, uncomment
        }
    });

    // initial rendering
    renderBooks();
    // cart is initially empty, so UI shows empty message
    updateCartUI();
})();