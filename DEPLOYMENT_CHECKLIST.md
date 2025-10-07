# ✅ Netlify Deployment Checklist

## 🎯 Quick Fix for "Missing Package" Error

### Most Common Causes:

1. **Environment Variables Not Set** ⚠️
2. **Build Command Incorrect** ⚠️
3. **Node Version Mismatch** ⚠️
4. **Missing Dependencies** ⚠️

---

## 🚀 Step-by-Step Deployment

### Step 1: Verify Local Build Works
```bash
cd frontend
npm install
npm run build
```
**Expected:** Build completes successfully

---

### Step 2: Check Files Exist

- [x] `frontend/netlify.toml` ✅ Created
- [x] `frontend/public/_redirects` ✅ Exists
- [x] `frontend/src/config.js` ✅ Exists
- [x] `frontend/package.json` ✅ Exists

---

### Step 3: Netlify Site Settings

#### Build Settings:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

#### Environment Variables:
```
REACT_APP_API_BASE = https://dirtycloths-laundry-project-production.up.railway.app
```

**How to add:**
1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Click "Add a variable"
4. Add the variable above
5. Click "Save"
6. **Redeploy the site**

---

### Step 4: Deploy

#### Option A: Git Deploy (Recommended)
```bash
git add .
git commit -m "Add Netlify configuration"
git push origin main
```
Netlify will auto-deploy.

#### Option B: Manual Deploy
1. Drag `build` folder to Netlify
2. Wait for deployment

---

## 🔍 If Build Still Fails

### Check 1: Node Version
In `netlify.toml`, verify:
```toml
[build.environment]
  NODE_VERSION = "18"
```

Try changing to "16" or "20" if needed.

---

### Check 2: Build Command
In Netlify dashboard, verify:
```
Build command: npm run build
```

NOT:
- ❌ `npm build`
- ❌ `react-scripts build`
- ❌ `yarn build`

---

### Check 3: Publish Directory
In Netlify dashboard, verify:
```
Publish directory: build
```

If base directory is `frontend`, then:
```
Publish directory: frontend/build
```

---

### Check 4: Dependencies
Run locally:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

If this works, commit `package-lock.json`:
```bash
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

---

## 🐛 Common Error Messages & Fixes

### Error: "Module not found"
**Fix:** Add missing package to `package.json`:
```bash
npm install <package-name>
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

---

### Error: "Command failed with exit code 1"
**Fix:** Check build logs for specific error. Usually:
1. Missing environment variable
2. Syntax error in code
3. Missing dependency

---

### Error: "Page not found"
**Fix:** Ensure `_redirects` file exists:
```
frontend/public/_redirects
```

Content:
```
/*    /index.html   200
```

---

### Error: "API calls fail"
**Fix:** Set environment variable in Netlify:
```
REACT_APP_API_BASE = https://dirtycloths-laundry-project-production.up.railway.app
```

Then redeploy.

---

## 📋 Pre-Deployment Verification

Run this command to check everything:
```bash
cd frontend
node check-deployment.js
```

This will verify:
- ✅ All dependencies present
- ✅ Config files exist
- ✅ No hardcoded localhost URLs
- ✅ Build scripts configured

---

## 🎯 Final Checklist

Before deploying, ensure:

- [ ] Local build works: `npm run build`
- [ ] `netlify.toml` exists in frontend folder
- [ ] Environment variable set in Netlify dashboard
- [ ] Build settings correct in Netlify
- [ ] `_redirects` file in `public` folder
- [ ] All changes committed and pushed
- [ ] No hardcoded `localhost` URLs

---

## 🆘 Still Having Issues?

### Get Build Logs:
1. Go to Netlify Dashboard
2. Click on your site
3. Go to "Deploys"
4. Click on failed deploy
5. Read the error logs
6. Copy the error message

### Common Log Patterns:

**Pattern 1:**
```
Error: Cannot find module 'X'
```
**Fix:** `npm install X`

**Pattern 2:**
```
'API_BASE_URL' is not defined
```
**Fix:** Import from config.js

**Pattern 3:**
```
Build script not found
```
**Fix:** Check `package.json` scripts section

---

## ✨ Success Indicators

Deployment is successful when you see:

```
✅ Build succeeded
✅ Deploy succeeded
✅ Site is live
```

And when you visit your site:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ No console errors
- ✅ API calls go to Railway (not localhost)

---

## 📞 Quick Commands

```bash
# Test build locally
npm run build

# Serve build locally
npx serve -s build

# Check for issues
node check-deployment.js

# Deploy via CLI
netlify deploy --prod

# View logs
netlify logs
```

---

**Status:** Ready for Deployment ✅  
**Date:** 2025-10-08  
**Next Step:** Deploy to Netlify and set environment variables
