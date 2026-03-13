// ============================================
// NULISIN - FONT UPLOADER COMPONENT
// ============================================

import React, { useState, useRef, useCallback } from 'react';
import { X, Check, AlertCircle, FileType } from 'lucide-react';
import { validateFontFile } from '@/lib/fonts/defaultFonts';
import { useCustomFonts } from '@/hooks/useLocalStorage';
import type { FontProfile } from '@/types';

interface FontUploaderProps {
  onFontAdded?: (font: FontProfile) => void;
}

export const FontUploader: React.FC<FontUploaderProps> = ({ onFontAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFont, fonts: customFonts } = useCustomFonts();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFontFile(file);
    if (!validation.valid) {
      setError(validation.message || 'File tidak valid');
      setSuccess(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Read file as data URL
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const source = e.target?.result as string;
        if (!source) {
          setError('Gagal membaca file');
          setIsLoading(false);
          return;
        }

        // Extract font name from filename
        const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const fontId = `custom-font-${Date.now()}`;

        // Create font profile
        const fontProfile: FontProfile = {
          id: fontId,
          name: fontName,
          source,
          defaultSize: 26,
          lineHeightMultiplier: 1.7,
          letterSpacing: 0.4,
          jitterSettings: {
            xJitter: 1.5,
            yJitter: 2,
            rotationJitter: 1.2,
            spacingJitter: 1,
            baselineShift: 2,
          },
          isCustom: true,
        };

        // Load the font
        try {
          const fontFace = new FontFace(fontName, `url(${source})`);
          await fontFace.load();
          document.fonts.add(fontFace);

          // Save to localStorage
          addFont({
            id: fontId,
            name: fontName,
            source,
          });

          setSuccess(`Font "${fontName}" berhasil ditambahkan!`);
          onFontAdded?.(fontProfile);
        } catch (fontError) {
          setError('Gagal memuat font. Pastikan file font valid.');
        }

        setIsLoading(false);
      };

      reader.onerror = () => {
        setError('Gagal membaca file');
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsLoading(false);
    }
  }, [addFont, onFontAdded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-5 cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-amber-100' : 'bg-gray-100'}
          `}>
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileType className={`w-4 h-4 ${isDragging ? 'text-amber-600' : 'text-gray-500'}`} />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {isLoading ? 'Memuat font...' : 'Unggah Font Custom'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Seret file atau klik untuk memilih
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              .ttf, .otf, .woff, .woff2 (maks. 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-700">{success}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-green-400 hover:text-green-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* List of custom fonts */}
      {customFonts.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Font Custom Tersimpan:</p>
          <div className="flex flex-wrap gap-2">
            {customFonts.map((font) => (
              <span
                key={font.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-200"
              >
                {font.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
