const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());

// Serve static assets directly from root
app.use(express.static(__dirname));

// --- API Endpoints ---
app.get('/api/menu', (req, res) => {
    res.json([
        { 
            name: "Pumpkin Spice Latte", 
            price: 150.00, 
            description: "Espresso with steamed milk, pumpkin spice syrup, and whipped cream.", 
            isNew: true,
            video: "pumpkin.png"
        },
        { 
            name: "Latte", 
            price: 90.00, 
            description: "Rich espresso combined with steamed milk and a thin layer of foam.", 
            isNew: false,
            video: "latte.mp4"
        },
        { 
            name: "Avocado Toast", 
            price: 129.00, 
            description: "Fresh sourdough topped with mashed avocado and poached eggs.", 
            isNew: false, 
            video: "avocado.mp4"
        },
        { 
            name: "Strawberry Matcha Latte", 
            price: 149.00, 
            description: "Ceremonial grade green tea layered over fresh strawberry puree.", 
            isNew: false,
            video: "matcha.mp4"
        }
    ]);
});

app.get('/api/about', (req, res) => {
    res.json({
        title: "About Our Cafe",
        description: "Brew Haven is made for slow mornings, late-night study sessions, and kwentuhan that lasts for hours. We built this space for students, creatives, and anyone who just needs a place to pahing.",
        features: ["100% Organic", "Zero Plastic Packaging", "Fast Local Delivery"]
    });
});

app.post('/api/contact', (req, res) => {
    const { email, message } = req.body;
    console.log(`[Contact Received] From: ${email} | Message: ${message}`);
    res.json({ status: "Success! Your message was received by our server." });
});

// --- SPA Fallback Route (Serves index.html from root) ---
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});