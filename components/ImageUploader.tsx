import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { generatePaletteFromImage } from '../services/geminiService';
import { Palette } from '../types';

interface ImageUploaderProps {
  onPaletteGenerated: (palette: Palette) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // remove the prefix `data:image/jpeg;base64,`
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onPaletteGenerated, setIsLoading, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const base64Data = await blobToBase64(file);
      const palette = await generatePaletteFromImage(base64Data, file.type);
      onPaletteGenerated(palette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [onPaletteGenerated, setIsLoading, setError]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full max-w-lg p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary/50 dark:hover:border-brand-secondary/50'}
        `}
    >
        <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={onFileChange} />
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-brand-primary dark:text-brand-secondary">Click to upload</span> or drag and drop an image
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </label>
    </div>
  );
};
