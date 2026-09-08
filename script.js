// Initialize layout features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadAbout();
    attachContactFormListener();
    setupSmoothScroll();
    setupScrollSpy();
});

async function loadMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    // Static fallback data ensures menu always renders on GitHub Pages
    const fallbackMenu = [
        {
            "name": "Avocado Cold Brew",
            "price": 150.00,
            "description": "Rich cold brew topped with creamy avocado foam.",
            "isNew": true,
            "video": "avocado.mp4"
        },
        {
            "name": "Matcha Latte",
            "price": 140.00,
            "description": "Premium ceremonial grade matcha with steamed milk.",
            "isNew": false,
            "video": "matcha.mp4"
        },
        {
            "name": "Classic Cafe Latte",
            "price": 130.00,
            "description": "Smooth espresso blended with silky milk.",
            "isNew": false,
            "video": "latte.mp4"
        }
    ];

    let items = fallbackMenu;

    try {
        const response = await fetch('./menu.json');
        if (response.ok) {
            items = await response.json();
        }
    } catch (err) {
        console.warn('Using inline fallback menu data:', err);
    }

    container.innerHTML = items.map((item) => `
        <div class="menu-item ${item.isNew ? 'new-product-item' : ''}">
            <div class="menu-item-header">
                <h3>${item.name} - ₱${Number(item.price).toFixed(2)}</h3>
                ${item.isNew ? '<span class="new-badge">NEW</span>' : ''}
            </div>
            <p>${item.description}</p>
            
            <div class="inline-video-container">
                <video loop muted playsinline class="inline-video">
                    <source src="${item.video}" type="video/mp4">
                </video>
            </div>
        </div>
    `).join('');

    const menuCards = container.querySelectorAll('.menu-item');
    menuCards.forEach(card => {
        const videoContainer = card.querySelector('.inline-video-container');
        if (videoContainer) {
            videoContainer.addEventListener('click', (e) => e.stopPropagation());
        }

        card.addEventListener('click', () => {
            const isAlreadyActive = card.classList.contains('active');

            menuCards.forEach(c => {
                c.classList.remove('active');
                const vid = c.querySelector('video');
                if (vid) {
                    vid.pause();
                    vid.currentTime = 0;
                }
            });

            if (!isAlreadyActive) {
                card.classList.add('active');
                const activeVid = card.querySelector('video');
                if (activeVid) {
                    activeVid.play().catch(err => console.warn('Playback interrupted:', err));
                }
            }
        });
    });
}

// Display static About details without backend API dependency
function loadAbout() {
    const container = document.getElementById('about-container');
    if (!container) return;

    const data = {
        title: "Welcome to Brew Heaven",
        description: "Crafting perfection in every cup with artisanal roasted beans, fresh organic ingredients, and modern coffee innovation.",
        features: ["Artisanal Brews", "Glassmorphic Ambiance", "Fresh Ingredients", "Handcrafted Drinks"]
    };

    container.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.description}</p>
        <br>
        <p><strong>Highlights:</strong> ${data.features.join(', ')}</p>
    `;
}

// Handle contact form submission purely on client-side
function attachContactFormListener() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const responseEl = document.getElementById('contact-response');

        if (responseEl) {
            responseEl.innerText = "Thank you for contacting Brew Heaven! Your message has been sent.";
        }
        form.reset();
    });
}

// Intercept nav links and scroll smoothly to target section
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Highlight current section link in the navbar during scrolling
function setupScrollSpy() {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active', 
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
}