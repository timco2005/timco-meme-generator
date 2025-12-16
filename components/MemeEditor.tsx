'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TextBoxData } from '@/lib/types';
import { db, id } from '@/lib/db';
import UploadArea from './UploadArea';
import Gallery from './Gallery';
import ImageCanvas from './ImageCanvas';
import TextControls from './TextControls';

interface MemeEditorProps {
  userId: string;
}

export default function MemeEditor({ userId }: MemeEditorProps) {
  const router = useRouter();
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [activeTextBox, setActiveTextBox] = useState<TextBoxData | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCurrentImageUrl(dataUrl);
      setShowEditor(true);
      setTextBoxes([]);
      setActiveTextBox(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateSelect = (url: string) => {
    setCurrentImageUrl(url);
    setShowEditor(true);
    setTextBoxes([]);
    setActiveTextBox(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddTextBox = () => {
    const newTextBox: TextBoxData = {
      id: Date.now().toString(),
      text: 'Your Text Here',
      fontSize: 40,
      color: '#FFFFFF',
      borderColor: '#000000',
      borderThickness: 3,
      x: 0,
      y: 0,
    };

    // Position in center after image loads
    setTimeout(() => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = (containerRect.width - 200) / 2;
        const centerY = (containerRect.height - 50) / 2;
        newTextBox.x = centerX;
        newTextBox.y = centerY;
      }
      setTextBoxes((prev) => [...prev, newTextBox]);
      setActiveTextBox(newTextBox);
    }, 100);
  };

  const handleUpdateTextBox = useCallback((textBox: TextBoxData, updates: Partial<TextBoxData>) => {
    setTextBoxes((prev) =>
      prev.map((tb) => (tb.id === textBox.id ? { ...tb, ...updates } : tb))
    );
    if (activeTextBox?.id === textBox.id) {
      setActiveTextBox({ ...textBox, ...updates });
    }
  }, [activeTextBox]);

  const handleDragTextBox = useCallback((textBox: TextBoxData, x: number, y: number) => {
    handleUpdateTextBox(textBox, { x, y });
  }, [handleUpdateTextBox]);

  const renderToCanvas = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!currentImageUrl) {
        reject(new Error('No image loaded'));
        return;
      }

      const img = new Image();
      if (currentImageUrl.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        if (!canvasRef.current) {
          reject(new Error('Canvas not available'));
          return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        try {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } catch (error) {
          reject(new Error('Failed to draw image (CORS issue)'));
          return;
        }

        const displayedImg = document.getElementById('memeImage') as HTMLImageElement;
        if (!displayedImg) {
          reject(new Error('Image element not found'));
          return;
        }

        const displayedWidth = displayedImg.offsetWidth || img.width;
        const displayedHeight = displayedImg.offsetHeight || img.height;

        if (displayedWidth === 0 || displayedHeight === 0) {
          reject(new Error('Image not displayed'));
          return;
        }

        const scaleX = canvas.width / displayedWidth;
        const scaleY = canvas.height / displayedHeight;

        textBoxes.forEach((textBox) => {
          const { x, y, text, fontSize, color, borderColor, borderThickness } = textBox;

          if (!text || text.trim() === '') return;

          // Get the text box element to measure its actual size
          const textBoxElement = document.querySelector(`[data-textbox-id="${textBox.id}"]`) as HTMLElement;
          if (!textBoxElement) {
            console.warn(`Text box element not found for id: ${textBox.id}`);
            return;
          }

          const textBoxRect = textBoxElement.getBoundingClientRect();
          const overlayElement = textBoxElement.closest('.text-overlay') as HTMLElement;
          const overlayRect = overlayElement?.getBoundingClientRect();
          
          if (!overlayRect) {
            console.warn('Overlay not found');
            return;
          }

          // Calculate relative position within the overlay (x, y are already relative to overlay)
          // But we need to account for the actual rendered position
          const relativeX = x;
          const relativeY = y;

          // Scale to canvas coordinates
          const scaledX = relativeX * scaleX;
          const scaledY = relativeY * scaleY;
          const scaledFontSize = fontSize * scaleX;

          ctx.font = `bold ${scaledFontSize}px Impact, "Arial Black", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Measure text to get approximate width
          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          const textHeight = scaledFontSize;

          // Calculate center position - x, y are top-left of text box
          // We need to add half the text box size to get center
          const textBoxWidth = textBoxRect.width * scaleX;
          const textBoxHeight = textBoxRect.height * scaleY;
          const centerX = scaledX + textBoxWidth / 2;
          const centerY = scaledY + textBoxHeight / 2;

          const thickness = borderThickness || 3;
          if (thickness > 0) {
            const scaledBorderThickness = thickness * scaleX;
            ctx.strokeStyle = borderColor || '#000000';
            ctx.lineWidth = Math.max(1, scaledBorderThickness);
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(text, centerX, centerY);
          }

          ctx.fillStyle = color || '#FFFFFF';
          ctx.fillText(text, centerX, centerY);
        });

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => reject(new Error('Failed to read blob'));
          reader.readAsDataURL(blob);
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = currentImageUrl;
    });
  }, [currentImageUrl, textBoxes]);

  const handlePostMeme = async () => {
    if (!currentImageUrl) {
      alert('Please select an image first.');
      return;
    }

    if (textBoxes.length === 0) {
      alert('Please add at least one text box before posting.');
      return;
    }

    setIsPosting(true);
    try {
      // Wait a moment to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const base64Image = await renderToCanvas();
      
      if (!base64Image) {
        throw new Error('Failed to generate image');
      }

      db.transact(
        db.tx.memes[id()].update({
          imageUrl: base64Image,
          createdAt: Date.now(),
          userId,
        })
      );

      // Wait a bit for the transaction to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/feed');
    } catch (error: any) {
      console.error('Error posting meme:', error);
      alert(`Error posting meme: ${error.message || 'Please try again.'}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImageUrl) {
      alert('Please select an image first.');
      return;
    }

    if (textBoxes.length === 0) {
      alert('Please add at least one text box before downloading.');
      return;
    }

    try {
      // Wait a moment to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const base64Image = await renderToCanvas();
      if (!base64Image) {
        throw new Error('Failed to generate image');
      }
      
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading meme:', error);
      alert(`Error downloading meme: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="main-content">
      <div className="left-panel">
        {!showEditor ? (
          <>
            <UploadArea onFileSelect={handleFileSelect} />
            <Gallery onSelectTemplate={handleTemplateSelect} />
          </>
        ) : (
          <>
            <div className="canvas-header">
              <button
                className="btn-back"
                onClick={() => {
                  setShowEditor(false);
                  setCurrentImageUrl(null);
                  setTextBoxes([]);
                  setActiveTextBox(null);
                }}
              >
                <span className="back-icon">←</span>
                Back to Gallery
              </button>
            </div>
            <ImageCanvas
              imageUrl={currentImageUrl}
              textBoxes={textBoxes}
              activeTextBox={activeTextBox}
              onSelectTextBox={setActiveTextBox}
              onUpdateTextBox={handleUpdateTextBox}
              onDragTextBox={handleDragTextBox}
            />
          </>
        )}
      </div>

      {showEditor && (
        <>
          <TextControls
            activeTextBox={activeTextBox}
            onAddTextBox={handleAddTextBox}
            onUpdateTextBox={(updates) => {
              if (activeTextBox) {
                handleUpdateTextBox(activeTextBox, updates);
              }
            }}
            textBoxes={textBoxes}
            onSelectTextBox={setActiveTextBox}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn btn-save"
              onClick={handlePostMeme}
              disabled={isPosting}
            >
              <span className="save-icon">💾</span>
              {isPosting ? 'Posting...' : 'Post to Feed'}
            </button>
            <button className="btn btn-download" onClick={handleDownload}>
              <span className="download-icon">↓</span>
              Download Meme
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

