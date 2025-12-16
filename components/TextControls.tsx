'use client';

import React from 'react';
import { TextBoxData } from '@/lib/types';

interface TextControlsProps {
  activeTextBox: TextBoxData | null;
  onAddTextBox: () => void;
  onUpdateTextBox: (updates: Partial<TextBoxData>) => void;
  textBoxes: TextBoxData[];
  onSelectTextBox: (textBox: TextBoxData) => void;
}

export default function TextControls({
  activeTextBox,
  onAddTextBox,
  onUpdateTextBox,
  textBoxes,
  onSelectTextBox,
}: TextControlsProps) {
  const currentTextSize = activeTextBox?.fontSize || 40;
  const currentTextColor = activeTextBox?.color || '#FFFFFF';
  const currentBorderColor = activeTextBox?.borderColor || '#000000';
  const currentBorderThickness = activeTextBox?.borderThickness || 3;

  const handleTextChange = (text: string) => {
    if (activeTextBox) {
      onUpdateTextBox({ text });
    }
  };

  const handleSizeChange = (size: number) => {
    if (activeTextBox) {
      onUpdateTextBox({ fontSize: size });
    }
  };

  const handleColorChange = (color: string) => {
    if (activeTextBox) {
      onUpdateTextBox({ color });
    }
  };

  const handleBorderColorChange = (color: string) => {
    if (activeTextBox) {
      onUpdateTextBox({ borderColor: color });
    }
  };

  const handleBorderThicknessChange = (thickness: number) => {
    if (activeTextBox) {
      onUpdateTextBox({ borderThickness: thickness });
    }
  };

  return (
    <div className="right-panel">
      <div className="add-text-section">
        <h2>Add Text</h2>

        <div className="control-group">
          <label htmlFor="textInput">Text Content</label>
          <input
            type="text"
            id="textInput"
            placeholder="Enter your meme text"
            value={activeTextBox?.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="textSizeSlider">Font Size</label>
          <div className="slider-container">
            <input
              type="range"
              id="textSizeSlider"
              min="12"
              max="120"
              value={currentTextSize}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
            />
            <span className="slider-value">{currentTextSize}</span>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="textColorPicker">Text Color</label>
          <div className="color-picker-container">
            <input
              type="color"
              id="textColorPicker"
              value={currentTextColor}
              onChange={(e) => handleColorChange(e.target.value.toUpperCase())}
            />
            <input
              type="text"
              id="textColorHex"
              value={currentTextColor}
              className="color-hex-input"
              onChange={(e) => {
                const color = e.target.value.toUpperCase();
                if (/^#[0-9A-F]{6}$/i.test(color)) {
                  handleColorChange(color);
                }
              }}
            />
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="borderColorPicker">Border Color</label>
          <div className="color-picker-container">
            <input
              type="color"
              id="borderColorPicker"
              value={currentBorderColor}
              onChange={(e) => handleBorderColorChange(e.target.value.toUpperCase())}
            />
            <input
              type="text"
              id="borderColorHex"
              value={currentBorderColor}
              className="color-hex-input"
              onChange={(e) => {
                const color = e.target.value.toUpperCase();
                if (/^#[0-9A-F]{6}$/i.test(color)) {
                  handleBorderColorChange(color);
                }
              }}
            />
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="borderThicknessSlider">Border Thickness</label>
          <div className="slider-container">
            <input
              type="range"
              id="borderThicknessSlider"
              min="0"
              max="10"
              value={currentBorderThickness}
              step="0.5"
              onChange={(e) => handleBorderThicknessChange(parseFloat(e.target.value))}
            />
            <span className="slider-value">{currentBorderThickness}</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddTextBox}>
          Add Text to Canvas
        </button>
      </div>

      <div className="text-boxes-section">
        <h2>Text Boxes</h2>
        <div className="text-boxes-list">
          {textBoxes.map((textBox, index) => (
            <div
              key={textBox.id}
              className={`text-box-item ${activeTextBox?.id === textBox.id ? 'active' : ''}`}
              onClick={() => onSelectTextBox(textBox)}
            >
              {textBox.text || `Text Box ${index + 1}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

