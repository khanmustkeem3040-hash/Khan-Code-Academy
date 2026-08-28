require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const User = require('./models/User'); // 👈 User Model Import Kar Diya

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(path.join(__dirname, '..')));

connectDB();

let visitorCount = 100;

app.get('/api/analytics/visitor-count', (req, res) => {
    visitorCount += 1;
    res.json({ success: true, totalVisitors: visitorCount });
});

// 🚀 REGISTER ROUTE (DATA MONGODB MEIN SAVE KARNE KE LIYE)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, age, gender, bio } = req.body;

        const newUser = new User({
            name,
            email,
            password,
            age,
            gender,
            bio
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// AI Routes
app.use('/api', aiRoutes);

// Serves the main UI (index.html) on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});