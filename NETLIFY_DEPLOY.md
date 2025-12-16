# Deploy to Netlify - Quick Guide

## 🚀 Step-by-Step Deployment

### 1. Go to Netlify
Visit: [https://app.netlify.com](https://app.netlify.com)

### 2. Sign Up / Log In
- Click **"Sign up"** or **"Log in"**
- Choose **"Continue with GitHub"** (recommended)

### 3. Import Your Project
1. Click **"Add new site"** or **"Import an existing project"**
2. Select **"GitHub"**
3. Authorize Netlify if prompted
4. Find and select: **`timco-meme-generator`**

### 4. Configure Build Settings
Netlify should auto-detect Next.js, but verify:

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Framework preset**: Next.js (auto-detected)

### 5. Add Environment Variable ⚠️ IMPORTANT!
Before clicking "Deploy site", scroll down to **"Advanced build settings"**:

1. Click **"New variable"**
2. **Key**: `NEXT_PUBLIC_INSTANTDB_APP_ID`
3. **Value**: Your InstantDB App ID (from `.env.local`)

### 6. Deploy! 🎉
- Click **"Deploy site"**
- Wait 2-3 minutes for the build
- You'll get a URL like: `https://random-name-123.netlify.app`

---

## 📋 After Deployment Checklist

### 1. Update InstantDB CORS Settings
⚠️ **CRITICAL**: Your app won't work without this!

1. Go to [InstantDB Dashboard](https://instantdb.com/dashboard)
2. Navigate to **Settings → CORS**
3. Add your Netlify URL: `https://your-site-name.netlify.app`
4. Save changes

### 2. Test Your App
- ✅ Login/authentication works
- ✅ Create a meme
- ✅ Post to feed
- ✅ Upvote functionality
- ✅ Full-screen view (click on meme)

### 3. Optional: Custom Domain
In Netlify dashboard:
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions

---

## 🔧 Troubleshooting

### Build Fails
- Check that environment variable is set correctly
- Look at build logs in Netlify dashboard
- Ensure `package.json` has all dependencies

### App Loads but Authentication Fails
- Verify CORS settings in InstantDB
- Check App ID is correct
- Make sure environment variable starts with `NEXT_PUBLIC_`

### Images Not Loading
- Images are base64 encoded, should work
- Check browser console for errors

---

## 🔄 Automatic Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically rebuild and deploy! 🚀

---

## 📱 Your Deployed App

**GitHub Repo**: https://github.com/timco2005/timco-meme-generator

**Netlify URL**: Will be shown after deployment

**Features**:
- ✨ Meme creation with customizable text
- 📸 Full-screen meme view
- 👍 Upvote functionality
- 🔄 Real-time updates
- 📱 Mobile responsive

Enjoy your deployed meme generator! 🎉

