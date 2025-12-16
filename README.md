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

- **Next.js 14** - React framework with App Router
- **InstantDB** - Real-time database
- **TypeScript** - Type safety
- **React** - UI library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
The app ID is already configured in `.env.local`, but you can update it if needed:
```
NEXT_PUBLIC_INSTANTDB_APP_ID=12dda760-fc25-4f9d-96a2-aa7dbb592f0c
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Notes

- Images are stored as base64 data URLs in InstantDB (suitable for MVP)
- For production, consider migrating to external storage (Cloudinary, S3, etc.)
- The app uses InstantDB's real-time subscriptions for instant updates

