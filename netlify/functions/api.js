const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('../../server/models/Product');
const fs = require('fs');
const path = require('path');

// Import routes
const productsRouter = require('../../server/routes/products');
const authRouter = require('../../server/routes/auth');
const cartRouter = require('../../server/routes/cart');
const ordersRouter = require('../../server/routes/orders');
const ecoRewardsRouter = require('../../server/routes/ecoRewards');

const app = express();

// CORS configuration for Netlify
app.use(cors({
  origin: process.env.URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/eco-rewards', ecoRewardsRouter);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://rishitagrawal217:t6ddr0l6cOyXxxml@cluster0.actbcon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      isConnected = true;
      console.log('MongoDB connected');
      
      // Import products if collection is empty
      const count = await Product.countDocuments();
      if (count === 0) {
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../server/products.json')));
        const flatProducts = productsData.flatMap(cat => cat.products.map(prod => ({ ...prod, category: cat.category })));
        await Product.insertMany(flatProducts);
        console.log('Products imported to DB');
      }
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
};

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Netlify backend is working!' });
});

app.get('/', (req, res) => {
  res.send('EcoKart Netlify backend is running!');
});

// Export as serverless function
exports.handler = async (event, context) => {
  await connectToDatabase();
  
  // Convert the event to a format Express can understand
  const eventBuffer = Buffer.from(event.body || '', 'base64');
  event.body = eventBuffer.toString('utf8');
  
  return new Promise((resolve, reject) => {
    const server = require('http').createServer(app);
    
    server.on('request', (req, res) => {
      req.headers = {
        ...req.headers,
        ...event.headers,
        'x-forwarded-for': event.requestContext.identity.sourceIp,
      };
      
      // Handle the request
      app(req, res);
    });
    
    server.emit('request', {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body,
    }, {
      setHeader: (name, value) => {
        if (!res.headers) res.headers = {};
        res.headers[name.toLowerCase()] = value;
      },
      end: (body) => {
        resolve({
          statusCode: res.statusCode || 200,
          headers: res.headers || {},
          body: body,
        });
      },
    });
  });
};
