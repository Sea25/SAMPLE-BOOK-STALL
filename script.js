(function() {
    // ---------- book data (kept for potential future use, but not displayed) ----------
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

    // ---------- DOM elements ----------
    const booksGrid = document.getElementById('booksGrid');
    const aboutSection = document.getElementById('aboutSection');
    const aboutLink = document.getElementById('about-link');
    const homeLink = document.querySelector('.nav-link:first-child');
    const navLinks = document.querySelectorAll('.nav-link');

    // ---------- render book grid (empty now - no books shown) ----------
    function renderBooks() {
        booksGrid.innerHTML = ''; 
        // Books grid is intentionally left empty
        // You can add a message if you want
        booksGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; background: #fcf6f1; border-radius: 32px;">
                <i class="fas fa-book-open" style="font-size: 4rem; color: #b46f4c; opacity: 0.5;"></i>
                <h3 style="margin-top: 1rem; color: #5f4c3e; font-weight: 400;">no books to display</h3>
                <p style="color: #907c6d; margin-top: 0.5rem;">check out our about section to learn more about the stall</p>
            </div>
        `;
    }

    // ---------- navigation functions ----------
    function showHome() {
        booksGrid.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        
        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        homeLink.classList.add('active');
    }

    function showAbout() {
        booksGrid.classList.add('hidden');
        aboutSection.classList.remove('hidden');
        
        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        aboutLink.classList.add('active');
    }

    // ---------- event listeners ----------
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
    });

    // ---------- initial rendering ----------
    renderBooks();
    // Start with home view (books grid visible, about hidden)
    showHome();
})();