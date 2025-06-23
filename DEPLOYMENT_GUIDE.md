# SkillHub LMS - Unified Vercel Deployment Guide

This guide provides step-by-step instructions for deploying SkillHub as a **unified full-stack application** to Vercel. The deployment serves both the React frontend and Express.js backend from a single domain, eliminating the need for separate deployments.

## 🏗️ Architecture Overview

- **Single Domain**: Both frontend and backend served from the same Vercel URL
- **API Routes**: All API calls go to `/api/*` and are handled by the Express server
- **Static Files**: React app is built and served as static files by Express
- **React Router**: Client-side routing works correctly with fallback to `index.html`

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Production database
3. **Cloudinary**: File storage service
4. **Razorpay**: Payment processing
5. **Gmail**: Email service with app password

## 🔧 Required Environment Variables

Add these to your **Vercel Project Settings** (not in code):

```env
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillhub
CLIENT_URL=https://your-app-name.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET_ID=your_paypal_secret_id
```

## 🚀 Deployment Steps

### 1. Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for unified Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your Git repository
4. Vercel will detect the `vercel.json` configuration automatically
5. **Do NOT change any build settings** - they're configured in `vercel.json`

### 3. Configure Environment Variables

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add all variables from the list above
3. **Important**: Set `CLIENT_URL` to your actual Vercel URL after first deployment

### 4. Deploy and Update CLIENT_URL

1. First deployment will give you a URL like `https://your-app-name.vercel.app`
2. Update the `CLIENT_URL` environment variable with this URL
3. Redeploy (Vercel will auto-redeploy when you change env vars)

## 🔍 How It Works

### Request Routing
- **API Requests**: `/api/*` → Express server handles these
- **Static Files**: `/` → Served from `client/dist` by Express
- **React Routes**: All other routes → Fallback to `index.html` for React Router

### Build Process
1. Vercel runs `npm run vercel-build`
2. This installs dependencies for both client and server
3. Builds the React app to `client/dist`
4. Express server serves the built React app as static files

### Environment Handling
- **Production**: Uses relative URLs (`/api`) since everything is on same domain
- **Development**: Uses `http://localhost:3000` for local development

## ✅ Testing Your Deployment

After deployment, test these URLs:

1. **Frontend**: `https://your-app.vercel.app` → Should load React app
2. **API Health**: `https://your-app.vercel.app/api/health` → Should return JSON
3. **React Routes**: `https://your-app.vercel.app/auth` → Should load login page
4. **API Calls**: Login/register should work from the frontend

## 🐛 Troubleshooting

### 404 Errors
- **Cause**: Usually incorrect `vercel.json` or missing build files
- **Fix**: Ensure `client/dist` exists after build

### API Not Working
- **Cause**: Environment variables not set or incorrect
- **Fix**: Check all env vars are set in Vercel dashboard

### CORS Errors
- **Cause**: `CLIENT_URL` not matching actual domain
- **Fix**: Update `CLIENT_URL` to exact Vercel URL

### Build Failures
- **Cause**: Missing dependencies or build errors
- **Fix**: Test build locally with `npm run build`

## 🔒 Security Notes

1. **Never commit `.env` files** to Git
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Whitelist your domain** in external services
4. **Use HTTPS** (automatic with Vercel)

## 📱 Local Development

For local development, use:

```bash
# Install all dependencies
npm run install-all

# Start both client and server
npm run dev
```

This runs:
- React dev server on `http://localhost:5173`
- Express server on `http://localhost:3000`

## 🎯 Key Benefits

✅ **Single Deployment**: One URL for everything  
✅ **No CORS Issues**: Same domain for frontend and backend  
✅ **Simplified Routing**: React Router works perfectly  
✅ **Cost Effective**: Single Vercel project  
✅ **Easy Maintenance**: One deployment to manage  

## 📞 Support

If you encounter issues:
1. Check Vercel function logs in dashboard
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check MongoDB Atlas connection

---

**Your SkillHub LMS is now ready for production! 🎓**
