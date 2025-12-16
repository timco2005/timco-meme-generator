# Meme Generator - Full Stack Next.js App

A full-stack meme generator built with Next.js and InstantDB, allowing users to create memes, post them to a shared feed, and upvote their favorites.

## Features

- 🎨 **Meme Editor**: Create memes with customizable text overlays
- 📤 **Post to Feed**: Share your memes with the community
- ⬆️ **Upvoting**: Upvote your favorite memes
- 🔐 **Authentication**: Email/magic code authentication
- 🔄 **Real-time Updates**: See new memes and upvotes in real-time
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **InstantDB** - Real-time database
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up InstantDB:
   - Create an account at [InstantDB](https://instantdb.com)
   - Create a new app in the dashboard
   - Copy your App ID from the dashboard

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add your InstantDB App ID to `.env.local`:
     ```
     NEXT_PUBLIC_INSTANTDB_APP_ID=your-app-id-here
     ```

4. Configure InstantDB Schema:
   - Go to your InstantDB dashboard
   - Navigate to the Schema section
   - Ensure your schema matches the one defined in `lib/db.ts`:
     - **memes** entity:
       - `imageUrl` (string)
       - `createdAt` (number, indexed)
       - `userId` (string)
     - **upvotes** entity:
       - `memeId` (string, indexed)
       - `userId` (string, indexed)
     - **Links**:
       - `memeUpvotes`: memes → upvotes (many-to-one)

5. Configure Authentication:
   - In InstantDB dashboard, go to Authentication settings
   - Enable Magic Code authentication
   - Configure email settings if needed

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
meme_generator/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page (redirects)
│   ├── login/             # Login page
│   ├── create/            # Meme editor page
│   ├── feed/              # Meme feed page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MemeEditor.tsx    # Main editor component
│   ├── ImageCanvas.tsx   # Image display with text overlays
│   ├── TextBox.tsx        # Draggable text box
│   ├── Gallery.tsx        # Template gallery
│   ├── TextControls.tsx  # Text styling controls
│   ├── UploadArea.tsx    # File upload component
│   ├── MemeFeed.tsx      # Feed component
│   ├── MemeCard.tsx      # Individual meme card
│   ├── Navigation.tsx    # Navigation bar
│   ├── AuthForm.tsx      # Authentication form
│   └── AuthGuard.tsx     # Protected route wrapper
├── lib/                   # Utility files
│   ├── db.ts             # InstantDB initialization
│   ├── types.ts          # TypeScript types
│   └── constants.ts      # Constants (templates)
└── public/               # Static assets
    ├── assets/          # Meme templates
    └── logo.svg         # Logo
```

## Usage

1. **Sign In**: Use email/magic code authentication
2. **Create Meme**: 
   - Upload an image or select from gallery
   - Add text overlays with custom styling
   - Drag text boxes to position them
   - Click "Post to Feed" to share
3. **Browse Feed**: View all posted memes
4. **Upvote**: Click the upvote button on memes you like

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Via Vercel Dashboard:

1. **Push to Git (GitHub, GitLab, or Bitbucket):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   
   # For GitHub:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   
   # For Bitbucket:
   git remote add origin https://bitbucket.org/YOUR_USERNAME/YOUR_REPO.git
   
   # For GitLab:
   git remote add origin https://gitlab.com/YOUR_USERNAME/YOUR_REPO.git
   
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login (supports GitHub, GitLab, Bitbucket, or email)
   - Click "New Project"
   - **For GitHub/GitLab**: Import your repository directly
   - **For Bitbucket**: Click "Import Third-Party Git Repository" and enter your repo URL
   - Configure environment variables:
     - Add `NEXT_PUBLIC_INSTANTDB_APP_ID` with your InstantDB App ID
   - Click "Deploy"

#### Via Vercel CLI:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy:**
   ```bash
   vercel login
   vercel
   ```

3. **Add Environment Variables:**
   - During deployment, Vercel will prompt for environment variables
   - Or add them in the Vercel dashboard: Project Settings → Environment Variables

### Option 2: Netlify

1. **Push to Git** (GitHub, GitLab, or Bitbucket - see above)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables:
     - `NEXT_PUBLIC_INSTANTDB_APP_ID`
   - Click "Deploy"

### Option 3: Railway

1. **Push to Git** (GitHub, GitLab, or Bitbucket - see above)

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Note: Railway primarily supports GitHub, but you can also deploy via CLI
   - Select your repository
   - Add environment variables in the Variables tab
   - Railway will auto-detect Next.js and deploy

   **Alternative: Deploy via Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

### Option 4: Self-Hosted (VPS/DigitalOcean/AWS)

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up environment variables on your server:**
   ```bash
   export NEXT_PUBLIC_INSTANTDB_APP_ID=your-app-id
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "meme-generator" -- start
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Important: Post-Deployment

After deploying, make sure to:

1. **Update InstantDB CORS settings:**
   - Go to your InstantDB dashboard
   - Navigate to Settings → CORS
   - Add your deployment URL (e.g., `https://your-app.vercel.app`)

2. **Test authentication:**
   - Verify magic code emails are being sent
   - Test login on your deployed site

3. **Monitor for errors:**
   - Check deployment logs for any issues
   - Verify environment variables are set correctly

## InstantDB Setup

### Schema Requirements

The app requires the following schema in your InstantDB dashboard:

**Entities:**
- `memes`: Stores meme images and metadata
- `upvotes`: Tracks user upvotes for memes

**Fields:**
- All fields must match exactly as defined in `lib/db.ts`
- Indexed fields (`createdAt`, `memeId`, `userId`) are required for queries and ordering

### Troubleshooting

**"Mutation failed {}" error:**
- Verify your schema matches the code exactly
- Ensure you're logged in before attempting mutations
- Check browser console for detailed error messages
- Verify your App ID is correct in `.env.local`

**"NEXT_PUBLIC_INSTANTDB_APP_ID is required" error:**
- Ensure `.env.local` exists in the project root
- Verify the environment variable name is exactly `NEXT_PUBLIC_INSTANTDB_APP_ID`
- Restart the dev server after creating/modifying `.env.local`

**Authentication not working:**
- Verify Magic Code auth is enabled in InstantDB dashboard
- Check email settings in InstantDB dashboard
- Ensure you're using a valid email address

**Queries not loading:**
- Check your internet connection
- Verify the App ID is correct
- Check browser console for network errors
- Ensure schema is properly synced in InstantDB dashboard

## Notes

- Images are stored as base64 data URLs in InstantDB (suitable for MVP)
- For production, consider migrating to external storage (Cloudinary, S3, etc.)
- The app uses InstantDB's real-time subscriptions for instant updates
- Schema changes require updates in both code and InstantDB dashboard

