'use client';

import React, { useState } from 'react';
import { db, id } from '@/lib/db';
import { MemeEntity, UpvoteEntity } from '@/lib/types';
import MemeCard from './MemeCard';
import FullScreenMeme from './FullScreenMeme';

export default function MemeFeed() {
  const { user } = db.useAuth();
  const [upvotingMemeId, setUpvotingMemeId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [fullScreenMeme, setFullScreenMeme] = useState<MemeEntity | null>(null);
  
  const { data, isLoading, error } = db.useQuery({
    memes: {
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
        <p className="error-hint">Please check your InstantDB connection and try refreshing the page.</p>
      </div>
    );
  }

  const memes = ((data?.memes || []) as unknown as MemeEntity[]).sort((a, b) => {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  const upvotes = (data?.upvotes || []) as unknown as UpvoteEntity[];

  const handleUpvote = async (memeId: string) => {
    if (!user) {
      setMutationError('Please log in to upvote memes');
      setTimeout(() => setMutationError(null), 3000);
      return;
    }

    if (upvotingMemeId === memeId) return; // Prevent double-clicks

    setUpvotingMemeId(memeId);
    setMutationError(null);

    try {
      const existingUpvote = upvotes.find(
        (u) => u.memeId === memeId && u.userId === user.id
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
    } catch (error: any) {
      console.error('Error toggling upvote:', error);
      const errorMessage = error?.message || error?.body?.message || 'Failed to update upvote. Please try again.';
      setMutationError(errorMessage);
      setTimeout(() => setMutationError(null), 5000);
    } finally {
      setUpvotingMemeId(null);
    }
  };

  const getUpvoteCount = (memeId: string) => {
    return upvotes.filter((u) => u.memeId === memeId).length;
  };

  const hasUserUpvoted = (memeId: string) => {
    if (!user) return false;
    return upvotes.some(
      (u) => u.memeId === memeId && u.userId === user.id
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
    <>
      <div className="meme-feed">
        {mutationError && (
          <div className="error-banner" style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            backgroundColor: '#fee', 
            color: '#c33',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {mutationError}
          </div>
        )}
        <div className="meme-grid">
          {memes.map((meme) => (
            <MemeCard
              key={meme.id}
              meme={meme as MemeEntity}
              upvoteCount={getUpvoteCount(meme.id)}
              hasUpvoted={hasUserUpvoted(meme.id)}
              onUpvote={() => handleUpvote(meme.id)}
              isUpvoting={upvotingMemeId === meme.id}
              onClick={() => setFullScreenMeme(meme as MemeEntity)}
            />
          ))}
        </div>
      </div>
      
      {fullScreenMeme && (
        <FullScreenMeme
          meme={fullScreenMeme}
          onClose={() => setFullScreenMeme(null)}
          upvoteCount={getUpvoteCount(fullScreenMeme.id)}
          hasUpvoted={hasUserUpvoted(fullScreenMeme.id)}
          onUpvote={() => handleUpvote(fullScreenMeme.id)}
          isUpvoting={upvotingMemeId === fullScreenMeme.id}
        />
      )}
    </>
  );
}

