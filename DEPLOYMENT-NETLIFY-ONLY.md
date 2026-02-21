# EcoKart Deployment Guide - Netlify Full-Stack

This guide will walk you through deploying your EcoKart MERN stack application entirely on Netlify using serverless functions for the backend.

## Prerequisites

1. **GitHub Account**: You need a GitHub account to host your code
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **MongoDB Atlas**: For cloud database (free tier available)

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `ecokart`

## Step 2: Deploy to Netlify

### 2.1 Connect Netlify to GitHub
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select the `rishitagrawal217/EcoKart` repository

### 2.2 Configure Build Settings
1. **Build command**: `npm run build`
2. **Publish directory**: `build`
3. **Node version**: `18`

### 2.3 Set Environment Variables
Add these environment variables in Netlify:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `URL`: Your Netlify site URL (e.g., `https://ecokart.netlify.app`)
- `NODE_ENV`: `production`

### 2.4 Deploy Site
1. Click "Deploy site"
2. Wait for deployment to complete
3. Copy the site URL (e.g., `https://ecokart.netlify.app`)

## Step 3: Test Your Deployment

### 3.1 Test Backend API
Visit your site URL + `/.netlify/functions/api/test` to test the backend:
```
https://ecokart.netlify.app/.netlify/functions/api/test
```

### 3.2 Test Products API
```
https://ecokart.netlify.app/.netlify/functions/api/products
```

### 3.3 Test Frontend
Visit your site URL to test the complete application:
```
https://ecokart.netlify.app
```

## How It Works

### Serverless Functions
- Backend code is converted to Netlify serverless functions
- Located in `netlify/functions/api.js`
- Handles all API routes: `/api/products`, `/api/auth`, `/api/cart`, etc.

### URL Rewriting
- Frontend requests to `/api/*` are automatically redirected to serverless functions
- Configuration in `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Environment Variables
- Backend uses MongoDB connection from environment variables
- Frontend uses relative URLs (no hardcoded API URL needed)

## Configuration Files

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Serverless Function (`netlify/functions/api.js`)
- Converts Express app to Netlify serverless function
- Handles MongoDB connection
- Includes all API routes

### Frontend Config (`src/config.js`)
```javascript
const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || '',
  APP_NAME: 'EcoKart',
  VERSION: '1.0.0'
};
```

## Troubleshooting

### Common Issues

1. **Function Deployment Issues**
   - Check if all dependencies are in `server/package.json`
   - Ensure Node.js version is compatible (set to 18)
   - Check Netlify function logs

2. **Database Connection Issues**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas cluster is running
   - Ensure IP access is configured (0.0.0.0/0)

3. **API Routing Issues**
   - Check if redirects are working properly
   - Verify function names match redirect patterns
   - Test individual function endpoints

4. **Build Errors**
   - Check if `REACT_APP_API_URL` is not set (should be empty for relative URLs)
   - Ensure all dependencies are installed
   - Check for any syntax errors in the code

### Debugging

1. **Check Netlify Logs**
   - Go to your site in Netlify Dashboard
   - Click "Functions" to see serverless function logs
   - Check "Deploys" for build logs

2. **Test Functions Individually**
   - Access functions directly: `/.netlify/functions/api/test`
   - Check function responses and errors

3. **Local Testing**
   - Use Netlify CLI for local testing
   - Install: `npm install -g netlify-cli`
   - Run: `netlify dev`

## Advantages of Netlify Full-Stack

1. **Single Platform**: Both frontend and backend on one platform
2. **Free Tier**: Generous free tier for both static sites and functions
3. **Automatic HTTPS**: SSL certificates included
4. **Global CDN**: Fast content delivery worldwide
5. **Git Integration**: Automatic deployments on push
6. **Environment Variables**: Secure configuration management

## Limitations

1. **Function Timeout**: Serverless functions have execution limits
2. **Cold Starts**: First request may be slower
3. **Memory Limits**: Limited memory per function
4. **Database Connections**: Need to manage connection pooling

## Final Notes

- Your app will automatically redeploy when you push changes to GitHub
- Monitor your app's performance in Netlify Analytics
- Set up monitoring and alerts for production issues
- Consider upgrading to paid plans for higher limits

## Support

If you encounter issues:
1. Check Netlify documentation
2. Review MongoDB Atlas documentation
3. Check the project's README.md
4. Contact: codeconquerors123@gmail.com
