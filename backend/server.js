const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('🔑 JWT_SECRET value:', process.env.JWT_SECRET ? 'HIDDEN' : 'UNDEFINED');

const app = express();

connectDB();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tvs-bike-crm.onrender.com', 'https://your-production-domain.com'] // Production domains
    : ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, '..', 'dist', 'TVS-bike-crm', 'browser')));

// Database info endpoint  
app.get('/api/db-info', (req, res) => {
  const dbName = mongoose.connection.name;
  const readyState = mongoose.connection.readyState;
  res.json({
    database: dbName,
    connectionState: readyState, // 1 = connected
    host: mongoose.connection.host,
    collections: Object.keys(mongoose.connection.collections)
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date() });
});

app.use('/api/auth', require('./routes/authroutes'));
// Direct test for bike API debugging
app.get('/api/bikes/direct-test', (req, res) => {
  res.json({ message: 'Direct bike test works - no middleware issues' });
});
app.use('/api/dashboard', require('./routes/dashboardroutes'));
app.use('/api/customers', require('./routes/customerroutes'));
app.use('/api/vehicles', require('./routes/bikeroutes-new'));  // WORKING SOLUTION: Use /vehicles instead of /bikes
app.use('/api/sales', require('./routes/salesroutes'));
app.use('/api/services', require('./routes/serviceroutes'));
app.use('/api/notifications', require('./routes/notificationroutes'));
app.use('/api/quotations', require('./routes/quotationroutes'));
app.use('/api/inventory', require('./routes/inventoryroutes'));
app.use('/api/leads', require('./routes/leadroutes'));
app.use('/api/payments', require('./routes/paymentroutes'));
app.use('/api/staff', require('./routes/staffroutes'));
app.use('/api/suppliers', require('./routes/supplierroutes'));

// Catch-all handler: send back Angular's index.html file for client-side routing
// This should come AFTER all API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'TVS-bike-crm', 'browser', 'index.html'));
});

// Handle Angular routes (anything that's not an API route)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'TVS-bike-crm', 'browser', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});