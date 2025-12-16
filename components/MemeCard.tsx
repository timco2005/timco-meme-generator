'use client';

import React from 'react';
import { MemeEntity } from '@/lib/types';

interface MemeCardProps {
  meme: MemeEntity;
  upvoteCount: number;
  hasUpvoted: boolean;
  onUpvote: () => void;
  isUpvoting?: boolean;
  onClick?: () => void;
}

export default function MemeCard({ meme, upvoteCount, hasUpvoted, onUpvote, isUpvoting = false, onClick }: MemeCardProps) {
  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote();
  };

  return (
    <div className="meme-card">
      <div className="meme-image-container" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <img src={meme.imageUrl} alt="Meme" className="meme-image" />
      </div>
      <div className="meme-footer">
        <button
          className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''} ${isUpvoting ? 'upvoting' : ''}`}
          onClick={handleUpvoteClick}
          disabled={isUpvoting}
          aria-label="Upvote"
        >
          <span className="upvote-icon">👍</span>
          <span className="upvote-count">{isUpvoting ? '...' : upvoteCount}</span>
        </button>
        <div className="meme-meta">
          <span className="meme-date">
            {new Date(meme.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

