const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');

dotenv.config();

const app = express();

connectDB();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] // Update this for production
    : ['http://localhost:4200', 'http://localhost:3000'],
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

app.get('/', (req, res) => {
  res.send('Bike CRM API is running');
});

// Database info endpoint  
app.get('/api/db-info', (req, res) => {
  const mongoose = require('mongoose');
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

app.use('/api/auth', require('./backend/routes/authroutes'));
app.use('/api/dashboard', require('./backend/routes/dashboardroutes'));
app.use('/api/customers', require('./backend/routes/customerroutes'));
app.use('/api/bikes', require('./backend/routes/bikeroutes'));
app.use('/api/sales', require('./backend/routes/salesroutes'));
app.use('/api/services', require('./backend/routes/serviceroutes'));
app.use('/api/notifications', require('./backend/routes/notificationroutes'));
app.use('/api/quotations', require('./backend/routes/quotationroutes'));
app.use('/api/inventory', require('./backend/routes/inventoryroutes'));
app.use('/api/leads', require('./backend/routes/leadroutes'));
app.use('/api/payments', require('./backend/routes/paymentroutes'));
app.use('/api/staff', require('./backend/routes/staffroutes'));
app.use('/api/suppliers', require('./backend/routes/supplierroutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});