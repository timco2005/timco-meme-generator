'use client';

import React from 'react';
import { db, id } from '@/lib/db';
import { MemeEntity, UpvoteEntity } from '@/lib/types';
import MemeCard from './MemeCard';

export default function MemeFeed() {
  const { user } = db.useAuth();
  const { data, isLoading, error } = db.useQuery({
    memes: {
      $: { order: { createdAt: 'desc' } },
      upvotes: {},
    },
    upvotes: {},
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading memes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading memes: {error.message}</p>
      </div>
    );
  }

  const memes = data?.memes || [];
  const upvotes = data?.upvotes || [];

  const handleUpvote = (memeId: string) => {
    if (!user) return;

    const existingUpvote = upvotes.find(
      (u: UpvoteEntity) => u.memeId === memeId && u.userId === user.id
    );

    if (existingUpvote) {
      // Remove upvote
      db.transact(db.tx.upvotes[existingUpvote.id].delete());
    } else {
      // Add upvote
      db.transact(
        db.tx.upvotes[id()].update({
          memeId,
          userId: user.id,
        })
      );
    }
  };

  const getUpvoteCount = (memeId: string) => {
    return upvotes.filter((u: UpvoteEntity) => u.memeId === memeId).length;
  };

  const hasUserUpvoted = (memeId: string) => {
    if (!user) return false;
    return upvotes.some(
      (u: UpvoteEntity) => u.memeId === memeId && u.userId === user.id
    );
  };

  if (memes.length === 0) {
    return (
      <div className="empty-feed">
        <p>No memes yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="meme-feed">
      <div className="meme-grid">
        {memes.map((meme: MemeEntity) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            upvoteCount={getUpvoteCount(meme.id)}
            hasUpvoted={hasUserUpvoted(meme.id)}
            onUpvote={() => handleUpvote(meme.id)}
          />
        ))}
      </div>
    </div>
  );
}

