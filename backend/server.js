require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added for serving static files
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');

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

// FIXED: '/api/ai' ko change karke '/api' kar diya taaki script.js se match ho jaye
app.use('/api', aiRoutes);

// Serves the main UI (index.html) on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});