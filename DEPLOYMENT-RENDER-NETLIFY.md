# EcoKart Deployment Guide - Render + Netlify

This guide will walk you through deploying your EcoKart MERN stack application with backend on Render and frontend on Netlify.

## Prerequisites

1. **GitHub Account**: You need a GitHub account to host your code
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
4. **MongoDB Atlas**: For cloud database (free tier available)

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git Repository
```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: EcoKart MERN stack app"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `ecokart`
4. Make it public or private (your choice)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ecokart.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### 2.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `ecokart`

## Step 3: Deploy Backend to Render

### 3.1 Connect Render to GitHub
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select the `ecokart` repository
5. Choose the `server` directory as root

### 3.2 Configure Backend Deployment
1. **Name**: `ecokart-backend`
2. **Environment**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Plan**: Free

### 3.3 Set Environment Variables
Add these environment variables in Render:
- `NODE_ENV`: `production`
- `PORT`: `5001`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A random secret string (e.g., `your-super-secret-jwt-key-2024`)

### 3.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy the deployment URL (e.g., `https://ecokart-backend.onrender.com`)
4. Test the API: `https://ecokart-backend.onrender.com/api/products`

## Step 4: Deploy Frontend to Netlify

### 4.1 Connect Netlify to GitHub
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select the `ecokart` repository

### 4.2 Configure Frontend Deployment
1. **Build command**: `npm run build`
2. **Publish directory**: `build`
3. **Node version**: `18`

### 4.3 Set Environment Variables
Add this environment variable:
- `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://ecokart-backend.onrender.com`)

### 4.4 Deploy Frontend
1. Click "Deploy site"
2. Wait for deployment to complete
3. Copy the frontend URL (e.g., `https://ecokart.netlify.app`)

## Step 5: Test Your Deployment

### 5.1 Test Backend API
Visit your backend URL + `/api/products` to see if it's working:
```
https://ecokart-backend.onrender.com/api/products
```

### 5.2 Test Frontend
Visit your frontend URL to test the complete application:
```
https://ecokart.netlify.app
```

## Step 6: Configure CORS (if needed)

If you encounter CORS issues, update your backend CORS settings in `server/index.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://ecokart.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Configuration Files Created

### Render Configuration (`server/render.yaml`)
```yaml
services:
  - type: web
    name: ecokart-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://ecokart-backend.onrender.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Troubleshooting

### Common Issues

1. **Backend Deployment Issues**
   - Check if all dependencies are in `server/package.json`
   - Ensure Node.js version is compatible
   - Verify environment variables are set correctly

2. **Frontend Build Errors**
   - Check if `REACT_APP_API_URL` is set correctly
   - Ensure all dependencies are installed
   - Check for any syntax errors in the code

3. **API Connection Issues**
   - Verify backend URL is correct and accessible
   - Check if CORS is properly configured
   - Ensure MongoDB connection string is working

4. **Database Issues**
   - Verify MongoDB Atlas cluster is running
   - Check if IP access is configured (0.0.0.0/0)
   - Ensure database user has correct permissions

### Debugging

1. **Check Render Logs**
   - Go to your service in Render Dashboard
   - Click "Logs" to see server logs
   - Check "Events" for deployment history

2. **Check Netlify Logs**
   - Go to your site in Netlify Dashboard
   - Click "Deploys" to see build logs
   - Check "Functions" for any serverless function issues

3. **Test Locally**
   - Test with production environment variables locally
   - Use `npm run build` to test build process
   - Test API endpoints with Postman or curl

## Final Notes

- Your app will automatically redeploy when you push changes to GitHub
- Render provides a free tier with limited resources
- Netlify provides free hosting for static sites
- Monitor your app's performance in both dashboards
- Set up monitoring and alerts for production issues

## Support

If you encounter issues:
1. Check Render documentation
2. Review Netlify documentation
3. Check MongoDB Atlas documentation
4. Review the project's README.md
5. Contact: codeconquerors123@gmail.com
