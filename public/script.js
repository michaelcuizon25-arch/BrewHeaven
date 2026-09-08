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

    try {
        const response = await fetch('menu.json'); // Changed from /api/menu
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const items = await response.json();

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

    } catch (err) {
        console.error('Error loading menu:', err);
        container.innerHTML = '<p>Error loading menu.</p>';
    }
}
// Fetch and display about details
async function loadAbout() {
    const container = document.getElementById('about-container');
    if (!container) return;

    try {
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        container.innerHTML = `
            <h1>${data.title}</h1>
            <p>${data.description}</p>
            <br>
            <p><strong>Highlights:</strong> ${Array.isArray(data.features) ? data.features.join(', ') : ''}</p>
        `;
    } catch (err) {
        console.error('Error loading about section:', err);
        container.innerHTML = '<h1>About Us</h1><p>Error loading product details.</p>';
    }
}

// Handle contact form submission
function attachContactFormListener() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const responseEl = document.getElementById('contact-response');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value, message: messageInput.value })
            });

            const data = await res.json();
            if (responseEl) responseEl.innerText = data.status || 'Message sent!';
            form.reset();
        } catch (err) {
            if (responseEl) responseEl.innerText = 'Error submitting message.';
        }
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