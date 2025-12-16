'use client';

import React from 'react';
import { MEME_TEMPLATES } from '@/lib/constants';
import Image from 'next/image';

interface GalleryProps {
  onSelectTemplate: (url: string) => void;
}

export default function Gallery({ onSelectTemplate }: GalleryProps) {
  return (
    <div className="gallery-section">
      <h3>Or choose from gallery:</h3>
      <div className="gallery">
        {MEME_TEMPLATES.map((template, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => onSelectTemplate(template.url)}
            title={template.name}
          >
            {template.url.startsWith('http') ? (
              <img
                src={template.url}
                alt={template.name}
                loading="lazy"
                crossOrigin="anonymous"
              />
            ) : (
              <Image
                src={template.url}
                alt={template.name}
                width={120}
                height={120}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

