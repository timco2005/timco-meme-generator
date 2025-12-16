# Quick Deployment Guide

## Fastest Way: Vercel CLI (No Git Required!)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy
```bash
vercel login
vercel
```

### 3. Add Environment Variable
When prompted or via dashboard:
- `NEXT_PUBLIC_INSTANTDB_APP_ID` = your-app-id

### 4. Update InstantDB CORS
- Go to InstantDB Dashboard
- Settings → CORS
- Add your Vercel URL

---

## Alternative: Deploy from Bitbucket

### Prerequisites
- Bitbucket account
- Git initialized in your project

### Steps

1. **Push to Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://bitbucket.org/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in (you can use email, GitHub, GitLab, or Bitbucket)
   - Click "New Project"
   - Click "Import Third-Party Git Repository"
   - Enter your Bitbucket repository URL: `https://bitbucket.org/YOUR_USERNAME/YOUR_REPO_NAME`
   - Click "Continue"
   - Add environment variable: `NEXT_PUBLIC_INSTANTDB_APP_ID`
   - Click "Deploy"

3. **Deploy on Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "Bitbucket" as your Git provider
   - Authorize Netlify to access your Bitbucket account
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variable: `NEXT_PUBLIC_INSTANTDB_APP_ID`
   - Click "Deploy"

4. **Configure InstantDB**
   - Add deployment URL to CORS settings in InstantDB dashboard

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] InstantDB CORS settings updated
- [ ] Test authentication on deployed site
- [ ] Test meme creation
- [ ] Test upvoting
- [ ] Test full-screen view
- [ ] Mobile responsiveness check

---

## Common Issues

**Build Fails:**
- Check environment variables are set
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**Authentication Not Working:**
- Verify CORS settings in InstantDB
- Check App ID is correct
- Ensure magic code auth is enabled

**Images Not Loading:**
- Images are base64 encoded, should work everywhere
- Check browser console for errors

