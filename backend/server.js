require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

let visitorCount = 100;

app.get('/api/analytics/visitor-count', (req, res) => {
    visitorCount += 1;
    res.json({ success: true, totalVisitors: visitorCount });
});

// FIXED: '/api/ai' ko change karke '/api' kar diya taaki script.js se match ho jaye
app.use('/api', aiRoutes);

app.get('/', (req, res) => {
    res.send("🚀 Khan Code Academy Backend Server Connected & Operational!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});