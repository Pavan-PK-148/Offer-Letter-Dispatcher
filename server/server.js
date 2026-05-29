require('dotenv').config(); // MUST stay at the absolute top of the file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const csvRoutes = require('./routes/csvRoutes');
const mailRoutes = require('./routes/mailRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Initialize Database connection
connectDB();

// Robust CORS Middleware Config (Allows your React Vite frontend to connect safely)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Middleware
app.use(express.json());

// Main Core API Routing Sub-Systems
app.use('/api/auth', authRoutes);
app.use('/api/campaign', csvRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/history', historyRoutes);

// Base Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ONLINE', channel: 'SMTP_READY', timestamp: new Date() });
});

// Port Execution Listeners
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡ Xyzon V2.0 Core Engine active on Port ${PORT}`);
});