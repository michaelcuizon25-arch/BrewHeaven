// Initialize layout features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadAbout();
    attachContactFormListener();
    setupSmoothScroll();
    setupScrollSpy();
    setup3DTilt();
    setupEmailToggle();
});

async function loadMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    // Fallback menu with support for both images and videos
    const fallbackMenu = [
        { 
            "name": "Pumpkin Spice Latte", 
            "price": 150.00, 
            "description": "Espresso with steamed milk, pumpkin spice syrup, and whipped cream.", 
            "isNew": true,
            "image": "pumpkin.jpg"
        },
        { 
            "name": "Latte", 
            "price": 90.00, 
            "description": "Rich espresso combined with steamed milk and a thin layer of foam.", 
            "isNew": false,
            "video": "latte.mp4"
        },
        { 
            "name": "Avocado Toast", 
            "price": 129.00, 
            "description": "Fresh sourdough topped with mashed avocado and poached eggs.", 
            "isNew": false, 
            "video": "avocado.mp4"
        },
        { 
            "name": "Strawberry Matcha Latte", 
            "price": 149.00, 
            "description": "Ceremonial grade green tea layered over fresh strawberry puree.", 
            "isNew": false,
            "video": "matcha.mp4"
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

    container.innerHTML = items.map((item) => {
        const mediaFile = item.image || item.video;
        const isImage = mediaFile && /\.(jpg|jpeg|png|webp|gif)$/i.test(mediaFile);

        return `
            <div class="menu-item ${item.isNew ? 'new-product-item' : ''}">
                <div class="menu-item-header">
                    <h3>${item.name} - ₱${Number(item.price).toFixed(2)}</h3>
                    ${item.isNew ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <p>${item.description}</p>
                
                ${mediaFile ? `
                <div class="inline-video-container">
                    ${isImage 
                        ? `<img src="${mediaFile}" alt="${item.name}" class="inline-video" />`
                        : `<video loop muted playsinline class="inline-video">
                            <source src="${mediaFile}" type="video/mp4">
                           </video>`
                    }
                </div>` : ''}
            </div>
        `;
    }).join('');

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

// Display About section details
function loadAbout() {
    const container = document.getElementById('about-container');
    if (!container) return;

    const data = {
        title: "About Our Cafe",
        description: "Brew Haven is made for slow mornings, late-night study sessions, and kwentuhan that lasts for hours. We built this space for students, creatives, and anyone who just needs a place to pahinga.",
        features: ["100% Organic", "Zero Plastic Packaging", "Fast Local Delivery"]
    };

    container.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.description}</p>
        <br>
        <p><strong>Highlights:</strong> ${data.features.join(', ')}</p>
    `;
}

// Handle contact form submission locally
function attachContactFormListener() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const responseEl = document.getElementById('contact-response');

        if (responseEl) {
            responseEl.innerText = "Success! Your message was received.";
        }
        form.reset();
    });
}

// Smooth scrolling navigation
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

// Highlight navbar links while scrolling
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

// 3D Card Tilt Effect
function setup3DTilt() {
    const card = document.querySelector('.contact-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `rotateX(${-y / 12}deg) rotateY(${x / 12}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
}

// Expandable Email Image Toggle
function setupEmailToggle() {
    const wrapper = document.querySelector('.contact-email-wrapper');
    const btn = document.getElementById('email-toggle-btn');
    if (!btn || !wrapper) return;

    btn.addEventListener('click', () => {
        const isActive = wrapper.classList.toggle('active');
        btn.setAttribute('aria-expanded', isActive);
    });
}