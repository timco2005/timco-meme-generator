'use client';

import AuthGuard from '@/components/AuthGuard';
import MemeFeed from '@/components/MemeFeed';

export default function FeedPage() {
  return (
    <AuthGuard>
      <div className="feed-page">
        <h1>Meme Feed</h1>
        <MemeFeed />
      </div>
    </AuthGuard>
  );
}

