'use client';

import React from 'react';
import { MemeEntity } from '@/lib/types';

interface MemeCardProps {
  meme: MemeEntity;
  upvoteCount: number;
  hasUpvoted: boolean;
  onUpvote: () => void;
}

export default function MemeCard({ meme, upvoteCount, hasUpvoted, onUpvote }: MemeCardProps) {
  return (
    <div className="meme-card">
      <div className="meme-image-container">
        <img src={meme.imageUrl} alt="Meme" className="meme-image" />
      </div>
      <div className="meme-footer">
        <button
          className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
          onClick={onUpvote}
          aria-label="Upvote"
        >
          <span className="upvote-icon">▲</span>
          <span className="upvote-count">{upvoteCount}</span>
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

