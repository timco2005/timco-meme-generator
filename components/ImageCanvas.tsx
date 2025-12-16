'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { TextBoxData } from '@/lib/types';
import TextBox from './TextBox';

interface ImageCanvasProps {
  imageUrl: string | null;
  textBoxes: TextBoxData[];
  activeTextBox: TextBoxData | null;
  onSelectTextBox: (textBox: TextBoxData) => void;
  onUpdateTextBox: (textBox: TextBoxData, updates: Partial<TextBoxData>) => void;
  onDragTextBox: (textBox: TextBoxData, x: number, y: number) => void;
}

export default function ImageCanvas({
  imageUrl,
  textBoxes,
  activeTextBox,
  onSelectTextBox,
  onUpdateTextBox,
  onDragTextBox,
}: ImageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setImageLoaded(false);
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className="canvas-section">
        <div className="image-wrapper">
          <div className="canvas-placeholder">
            <div className="placeholder-icon">⛰️</div>
            <div className="placeholder-text">Upload an image to get started</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-section">
      <div className="image-wrapper" ref={containerRef}>
        {imageUrl.startsWith('http') || imageUrl.startsWith('data:') ? (
          <img
            id="memeImage"
            src={imageUrl}
            alt="Meme template"
            crossOrigin={imageUrl.startsWith('http') ? 'anonymous' : undefined}
            onLoad={() => setImageLoaded(true)}
            style={{ 
              maxWidth: '100%',
              maxHeight: '600px',
              height: 'auto',
              display: imageLoaded ? 'block' : 'none' 
            }}
          />
        ) : (
          <Image
            id="memeImage"
            src={imageUrl}
            alt="Meme template"
            width={800}
            height={600}
            style={{
              maxWidth: '100%',
              maxHeight: '600px',
              height: 'auto',
              display: imageLoaded ? 'block' : 'none',
            }}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {imageLoaded && (
          <div className="text-overlay">
            {textBoxes.map((textBox) => (
              <TextBox
                key={textBox.id}
                textBox={textBox}
                isActive={activeTextBox?.id === textBox.id}
                onSelect={() => onSelectTextBox(textBox)}
                onUpdate={(updates) => onUpdateTextBox(textBox, updates)}
                onDrag={(x, y) => onDragTextBox(textBox, x, y)}
                containerRef={containerRef}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

