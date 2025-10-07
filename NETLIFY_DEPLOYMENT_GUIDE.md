# 🚀 Netlify Deployment Guide - DIRTYCLOTHS

## 📋 Pre-Deployment Checklist

### ✅ Files Verified
- [x] `netlify.toml` - Configuration file created
- [x] `public/_redirects` - SPA routing configured
- [x] `src/config.js` - API configuration centralized
- [x] `.env` - Environment variables set
- [x] `package.json` - All dependencies listed

---

## 🔧 Common Netlify Build Issues & Solutions

### Issue 1: Missing Dependencies ❌

**Error:** `Module not found` or `Cannot find package`

**Solution:**
```bash
# Verify all dependencies are in package.json
cd frontend
npm install
npm run build  # Test locally first
```

**Check these packages are in package.json:**
- ✅ react
- ✅ react-dom
- ✅ react-router-dom
- ✅ axios
- ✅ lucide-react
- ✅ framer-motion
- ✅ leaflet
- ✅ react-leaflet
- ✅ tailwindcss

---

### Issue 2: Environment Variables Not Set ❌

**Error:** `API_BASE_URL is undefined` or API calls fail

**Solution:**

1. **Go to Netlify Dashboard**
   - Site Settings → Environment Variables

2. **Add this variable:**
   ```
   Key: REACT_APP_API_BASE
   Value: https://dirtycloths-laundry-project-production.up.railway.app
   ```

3. **Important:** Redeploy after adding environment variables!

---

### Issue 3: Build Command Issues ❌

**Error:** `Build script not found` or `Command failed`

**Solution:**

Ensure `package.json` has correct scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

---

### Issue 4: Node Version Mismatch ❌

**Error:** `Node version not supported`

**Solution:**

The `netlify.toml` file specifies Node 18. If you need a different version:

```toml
[build.environment]
  NODE_VERSION = "18"  # Change to 16, 18, or 20
```

---

### Issue 5: CI Build Warnings Fail ❌

**Error:** `Treating warnings as errors because process.env.CI = true`

**Solution:**

Already fixed in `netlify.toml`:
```toml
[build.environment]
  CI = "false"
```

This prevents warnings from failing the build.

---

## 🚀 Deployment Methods

### Method 1: Git-Based Deployment (Recommended)

#### Step 1: Connect Repository
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository

#### Step 2: Configure Build Settings
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

#### Step 3: Set Environment Variables
- Go to Site Settings → Environment Variables
- Add: `REACT_APP_API_BASE` = `https://dirtycloths-laundry-project-production.up.railway.app`

#### Step 4: Deploy
- Click "Deploy site"
- Netlify will auto-deploy on every push to main branch

---

### Method 2: Manual Deployment (Drag & Drop)

#### Step 1: Build Locally
```bash
cd frontend
npm install
npm run build
```

#### Step 2: Deploy
1. Go to [Netlify](https://app.netlify.com/)
2. Drag the `build` folder to the deploy area
3. Wait for deployment to complete

#### Step 3: Set Environment Variables
- Go to Site Settings → Environment Variables
- Add: `REACT_APP_API_BASE` = `https://dirtycloths-laundry-project-production.up.railway.app`
- Redeploy manually

---

### Method 3: Netlify CLI

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login
```bash
netlify login
```

#### Step 3: Initialize
```bash
cd frontend
netlify init
```

#### Step 4: Deploy
```bash
# Deploy to draft URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 📁 Required File Structure

```
frontend/
├── netlify.toml              ✅ Created
├── package.json              ✅ Exists
├── .env                      ✅ Exists (not deployed)
├── public/
│   └── _redirects            ✅ Exists
├── src/
│   ├── config.js             ✅ Exists
│   └── ...
└── build/                    ✅ Generated on build
```

---

## 🔍 Debugging Netlify Build Failures

### Step 1: Check Build Logs
1. Go to Netlify Dashboard
2. Click on your site
3. Go to "Deploys"
4. Click on the failed deploy
5. Read the error logs

### Step 2: Common Error Patterns

#### Pattern 1: Module Not Found
```
Error: Cannot find module 'package-name'
```
**Fix:** Add to package.json dependencies

#### Pattern 2: Build Failed
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```
**Fix:** Test build locally first: `npm run build`

#### Pattern 3: Environment Variable Missing
```
ReferenceError: process is not defined
```
**Fix:** Add environment variables in Netlify dashboard

#### Pattern 4: Out of Memory
```
FATAL ERROR: Reached heap limit
```
**Fix:** Add to netlify.toml:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

---

## 🛠️ Netlify Configuration Explained

### netlify.toml Breakdown

```toml
[build]
  command = "npm run build"    # Command to build your app
  publish = "build"            # Folder to deploy
  
[build.environment]
  NODE_VERSION = "18"          # Node.js version
  CI = "false"                 # Don't treat warnings as errors

[[redirects]]
  from = "/*"                  # All routes
  to = "/index.html"           # Redirect to index.html
  status = 200                 # Success status (SPA routing)
```

---

## 🔐 Environment Variables Setup

### Required Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `REACT_APP_API_BASE` | `https://dirtycloths-laundry-project-production.up.railway.app` | Backend API URL |

### How to Add in Netlify

1. **Dashboard Method:**
   - Site Settings → Environment Variables → Add variable

2. **CLI Method:**
   ```bash
   netlify env:set REACT_APP_API_BASE "https://dirtycloths-laundry-project-production.up.railway.app"
   ```

3. **Important Notes:**
   - ✅ Must start with `REACT_APP_` for Create React App
   - ✅ Redeploy after adding/changing variables
   - ✅ Variables are injected at build time, not runtime

---

## 🧪 Testing Before Deployment

### Local Build Test
```bash
cd frontend
npm install
npm run build
npx serve -s build
```

Visit `http://localhost:3000` to test the production build locally.

---

## 🚨 Troubleshooting Checklist

If deployment fails, check:

- [ ] All dependencies in `package.json`
- [ ] `netlify.toml` exists in frontend folder
- [ ] Environment variables set in Netlify dashboard
- [ ] Build works locally (`npm run build`)
- [ ] No hardcoded `localhost` URLs in code
- [ ] `_redirects` file in `public` folder
- [ ] Node version compatible (16, 18, or 20)
- [ ] No `.env` file in `.gitignore` (it should be ignored)

---

## 📊 Deployment Status Indicators

### ✅ Successful Deployment
```
Build succeeded
Deploy succeeded
Site is live
```

### ⚠️ Build Warning (Still Deploys)
```
Build succeeded with warnings
Deploy succeeded
Site is live
```

### ❌ Failed Deployment
```
Build failed
Deploy failed
Site is not updated
```

---

## 🔄 Continuous Deployment

Once set up with Git:

1. **Push to repository:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. **Netlify auto-deploys:**
   - Detects push
   - Runs build
   - Deploys if successful
   - Updates live site

---

## 📝 Post-Deployment Verification

### 1. Check Site is Live
- Visit your Netlify URL
- Verify homepage loads

### 2. Test API Connections
- Try user registration
- Try user login
- Check console for errors

### 3. Test Routing
- Navigate to different pages
- Refresh on a route (should not 404)

### 4. Check Environment Variables
- Open browser console
- API calls should go to Railway, not localhost

---

## 🎯 Quick Fix Commands

### Redeploy Site
```bash
netlify deploy --prod
```

### Clear Cache and Redeploy
```bash
netlify build --clear-cache
netlify deploy --prod
```

### View Logs
```bash
netlify logs
```

### Open Site
```bash
netlify open:site
```

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify Community:** https://answers.netlify.com/
- **Build Logs:** Netlify Dashboard → Deploys → Failed Deploy

---

## ✨ Success Indicators

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Site is accessible via Netlify URL
- ✅ Registration/Login works
- ✅ API calls connect to Railway backend
- ✅ No console errors
- ✅ Routing works (no 404 on refresh)

---

**Last Updated:** 2025-10-08  
**Project:** DIRTYCLOTHS Laundry Management System  
**Frontend:** React + Netlify  
**Backend:** Node.js + Railway
