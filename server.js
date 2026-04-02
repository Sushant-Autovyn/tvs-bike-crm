// Root-level server.js for Render deployment
// This file starts the backend server from the backend directory

console.log('🚀 Starting Bike CRM Server...');
console.log('📂 Current directory:', process.cwd());

// Load environment variables from backend directory
require('dotenv').config({ path: './backend/.env' });

console.log('🔑 Environment loaded from backend/.env');
console.log('📄 Loading backend server...');

// Start the backend server
require('./backend/server.js');