const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../../server/models/User');
const Product = require('../../server/models/Product');

const app = express();

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://rishitagrawal217:t6ddr0l6cOyXxxml@cluster0.actbcon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log('MongoDB connected');
      
      // Import products if empty
      const count = await Product.countDocuments();
      if (count === 0) {
        const fs = require('fs');
        const path = require('path');
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../server/products.json')));
        const flatProducts = productsData.flatMap(cat => cat.products.map(prod => ({ ...prod, category: cat.category })));
        await Product.insertMany(flatProducts);
        console.log('Products imported');
      }
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
};

// Initialize connection
connectToDatabase();

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!', database: isConnected ? 'connected' : 'disconnected' });
});

// Products endpoint
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Auth endpoints
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      ecoPoints: 50 // Bonus points for registration
    });

    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { _id: user._id, name: user.name, email: user.email, ecoPoints: user.ecoPoints },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email, ecoPoints: user.ecoPoints },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Cart endpoint (mock)
app.get('/cart', (req, res) => {
  res.json({ items: [], total: 0, message: 'Cart functionality - implement as needed' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'EcoKart API is running!', endpoints: ['/test', '/products', '/auth/register', '/auth/login', '/cart'] });
});

module.exports.handler = serverless(app);
