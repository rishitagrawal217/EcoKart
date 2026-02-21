# EcoKart Two-Step Deployment Guide

This guide will walk you through deploying EcoKart in two steps:
1. First deploy backend on Netlify
2. Then deploy frontend using the deployed backend URL

## Step 1: Deploy Backend Only

### 1.1 Create Backend Site on Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select `rishitagrawal217/EcoKart`
4. **Important**: In the build settings, select `netlify-backend.toml` as your configuration file
5. Or manually configure:
   - **Build command**: `echo 'Backend only deployment'`
   - **Publish directory**: `build`
   - **Node version**: `18`

### 1.2 Set Backend Environment Variables
Add these environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `URL`: Your backend site URL (after deployment)
- `NODE_ENV`: `production`

### 1.3 Deploy Backend
1. Click "Deploy site"
2. Wait for deployment to complete
3. Copy the backend URL (e.g., `https://ecokart-backend.netlify.app`)

### 1.4 Test Backend
Test these endpoints:
- `https://ecokart-backend.netlify.app/.netlify/functions/api/test`
- `https://ecokart-backend.netlify.app/.netlify/functions/api/products`

## Step 2: Deploy Frontend with Backend URL

### 2.1 Create Frontend Site on Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select the same `rishitagrawal217/EcoKart` repository
4. **Important**: In the build settings, select `netlify-frontend.toml` as your configuration file
5. Or manually configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: `18`

### 2.2 Set Frontend Environment Variables
Add this environment variable:
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://ecokart-backend.netlify.app`)

### 2.3 Update Frontend Configuration
Before deploying, you need to update `netlify-frontend.toml`:

1. Open `netlify-frontend.toml`
2. Replace `your-backend-url.netlify.app` with your actual backend URL
3. Update both `REACT_APP_API_URL` and the redirect URL
4. Commit and push the changes

Example updated `netlify-frontend.toml`:
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  REACT_APP_API_URL = "https://ecokart-backend.netlify.app"

[[redirects]]
  from = "/api/*"
  to = "https://ecokart-backend.netlify.app/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2.4 Deploy Frontend
1. Click "Deploy site"
2. Wait for deployment to complete
3. Copy the frontend URL (e.g., `https://ecokart.netlify.app`)

### 2.5 Test Complete Application
1. Visit your frontend URL
2. Test user registration/login
3. Test product browsing
4. Test cart functionality

## Configuration Files Explained

### Backend Configuration (`netlify-backend.toml`)
```toml
[build]
  publish = "build"
  command = "echo 'Backend only deployment'"

[build.environment]
  NODE_VERSION = "18"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/test"
  to = "/.netlify/functions/api/test"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Frontend Configuration (`netlify-frontend.toml`)
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  REACT_APP_API_URL = "https://your-backend-url.netlify.app"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.netlify.app/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Step-by-Step Commands

### After Backend Deployment
```bash
# Update frontend config with your backend URL
# Edit netlify-frontend.toml and replace your-backend-url.netlify.app

# Commit and push changes
git add netlify-frontend.toml
git commit -m "Update frontend config with backend URL"
git push origin main
```

### Alternative: Update Frontend Config Programmatically
```bash
# Replace with your actual backend URL
BACKEND_URL="https://ecokart-backend.netlify.app"

# Update netlify-frontend.toml
sed -i.bak "s|your-backend-url.netlify.app|$BACKEND_URL|g" netlify-frontend.toml

# Commit and push
git add netlify-frontend.toml
git commit -m "Update frontend config with backend URL: $BACKEND_URL"
git push origin main
```

## Testing Checklist

### Backend Testing
- [ ] Test endpoint: `{backend-url}/.netlify/functions/api/test`
- [ ] Test products: `{backend-url}/.netlify/functions/api/products`
- [ ] Test auth: `{backend-url}/.netlify/functions/api/auth/register`
- [ ] Check function logs in Netlify dashboard

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] Products display from backend
- [ ] User registration works
- [ ] Login functionality works
- [ ] Cart operations work
- [ ] Checkout process works

## Troubleshooting

### Backend Issues
1. **Function not found**: Check if `netlify/functions/api.js` exists
2. **Database connection**: Verify `MONGODB_URI` environment variable
3. **Build errors**: Check function logs in Netlify dashboard

### Frontend Issues
1. **API connection errors**: Verify `REACT_APP_API_URL` is correct
2. **CORS issues**: Check if backend allows frontend URL
3. **Build errors**: Check build logs in Netlify dashboard

### Common Solutions
1. **Clear cache**: Clear Netlify build cache in site settings
2. **Re-deploy**: Trigger manual redeployment
3. **Check environment variables**: Ensure all required variables are set
4. **Verify URLs**: Make sure all URLs are correct and accessible

## Final Notes

- You now have two separate Netlify sites
- Backend handles all API requests
- Frontend handles all UI and redirects API calls to backend
- Both sites will auto-deploy on git push
- Monitor both sites separately in Netlify dashboard

## Support

If you encounter issues:
1. Check Netlify documentation
2. Review MongoDB Atlas documentation
3. Check the project's README.md
4. Contact: codeconquerors123@gmail.com
