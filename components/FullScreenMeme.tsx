'use client';

import React, { useEffect } from 'react';
import { MemeEntity } from '@/lib/types';

interface FullScreenMemeProps {
  meme: MemeEntity;
  onClose: () => void;
  upvoteCount: number;
  hasUpvoted: boolean;
  onUpvote: () => void;
  isUpvoting?: boolean;
}

export default function FullScreenMeme({ 
  meme, 
  onClose, 
  upvoteCount, 
  hasUpvoted, 
  onUpvote,
  isUpvoting = false 
}: FullScreenMemeProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fullscreen-overlay" onClick={onClose}>
      <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
        <button className="fullscreen-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="fullscreen-image-wrapper">
          <img src={meme.imageUrl} alt="Meme" className="fullscreen-image" />
        </div>
        <div className="fullscreen-footer">
          <button
            className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''} ${isUpvoting ? 'upvoting' : ''}`}
            onClick={onUpvote}
            disabled={isUpvoting}
            aria-label="Upvote"
          >
            <span className="upvote-icon">👍</span>
            <span className="upvote-count">{isUpvoting ? '...' : upvoteCount}</span>
          </button>
          <div className="fullscreen-meta">
            <span className="meme-date">
              {new Date(meme.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

