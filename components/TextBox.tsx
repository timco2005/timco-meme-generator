'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TextBoxData } from '@/lib/types';

interface TextBoxProps {
  textBox: TextBoxData;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextBoxData>) => void;
  onDrag: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function TextBox({
  textBox,
  isActive,
  onSelect,
  onUpdate,
  onDrag,
  containerRef,
}: TextBoxProps) {
  const textBoxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current && textBoxRef.current) {
        const overlayRect = containerRef.current.getBoundingClientRect();
        const textBoxRect = textBoxRef.current.getBoundingClientRect();

        let x = e.clientX - overlayRect.left - dragOffset.x;
        let y = e.clientY - overlayRect.top - dragOffset.y;

        const maxX = overlayRect.width - textBoxRect.width;
        const maxY = overlayRect.height - textBoxRect.height;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        onDrag(x, y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, containerRef, onDrag]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (textBoxRef.current) {
      setIsDragging(true);
      const rect = textBoxRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      onSelect();
      e.preventDefault();
    }
  };

  const getTextShadow = (borderColor: string, borderThickness: number) => {
    if (borderThickness <= 0) return 'none';
    const shadowOffset = Math.max(1, Math.ceil(borderThickness / 2));
    return `
      -${shadowOffset}px -${shadowOffset}px 0 ${borderColor},
      ${shadowOffset}px -${shadowOffset}px 0 ${borderColor},
      -${shadowOffset}px ${shadowOffset}px 0 ${borderColor},
      ${shadowOffset}px ${shadowOffset}px 0 ${borderColor},
      0 0 ${Math.max(2, borderThickness)}px ${borderColor}
    `;
  };

  return (
    <div
      ref={textBoxRef}
      className={`text-box ${isActive ? 'active' : ''}`}
      data-textbox-id={textBox.id}
      style={{
        left: `${textBox.x}px`,
        top: `${textBox.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      <div
        className="text-box-content"
        style={{
          fontSize: `${textBox.fontSize}px`,
          color: textBox.color,
          WebkitTextStroke: textBox.borderThickness > 0
            ? `${textBox.borderThickness}px ${textBox.borderColor}`
            : 'none',
          textShadow: getTextShadow(textBox.borderColor, textBox.borderThickness),
        }}
      >
        {textBox.text || 'Your Text Here'}
      </div>
    </div>
  );
}

