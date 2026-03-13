// ============================================
// NULISIN - CANVAS PREVIEW COMPONENT
// ============================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { FontProfile, PaperTemplate } from '@/types';
import { generatePreview, preloadFontForRender } from '@/lib/rendering/handwritingEngine';
import { Loader2, AlertTriangle } from 'lucide-react';

interface CanvasPreviewProps {
  name: string;
  date: string;
  content: string;
  font: FontProfile | null;
  paper: PaperTemplate | null;
  onOverflow?: (overflow: boolean) => void;
  className?: string;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  name,
  date,
  content,
  font,
  paper,
  onOverflow,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Preload font when it changes
  useEffect(() => {
    if (!font) {
      setFontLoaded(false);
      return;
    }

    const loadFont = async () => {
      setFontLoaded(false);
      const loaded = await preloadFontForRender(font);
      setFontLoaded(loaded);
    };

    loadFont();
  }, [font]);

  // Render preview when inputs change - NO DELAY for responsiveness
  const render = useCallback(async () => {
    if (!canvasRef.current || !font || !paper) return;
    if (!fontLoaded) return;

    // Don't render if there's nothing to show
    if (!name.trim() && !date.trim() && !content.trim()) {
      // Clear canvas
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setHasOverflow(false);
      onOverflow?.(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePreview(canvasRef.current, {
        name,
        date,
        content,
        font,
        paper,
        previewScale: 0.5,
      });

      if (result.success) {
        setHasOverflow(result.overflow || false);
        onOverflow?.(result.overflow || false);
      } else {
        setError(result.error || 'Gagal merender preview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saat merender');
    } finally {
      setIsLoading(false);
    }
  }, [name, date, content, font, paper, fontLoaded, onOverflow]);

  // Render immediately on changes - no debounce for better responsiveness
  useEffect(() => {
    render();
  }, [render]);

  // Calculate container styles based on paper aspect ratio
  const getContainerStyles = (): React.CSSProperties => {
    if (!paper) return {};
    return {
      aspectRatio: `${paper.width} / ${paper.height}`,
    };
  };

  if (!font || !paper) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ aspectRatio: '800/1100' }}
      >
        <p className="text-gray-400 text-sm text-center px-4">
          Pilih font dan kertas untuk melihat preview
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      style={getContainerStyles()}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ display: 'block' }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
          <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90">
          <div className="text-center px-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Overflow warning */}
      {hasOverflow && !isLoading && !error && (
        <div className="absolute bottom-2 left-2 right-2 bg-amber-100 border border-amber-300 rounded-lg p-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-xs">
            Isi tulisan kepanjangan. Coba kurangi atau pilih template lain.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!name.trim() && !date.trim() && !content.trim() && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-sm text-center px-4">
            Pratinjau akan muncul setelah kamu mulai mengetik.
          </p>
        </div>
      )}
    </div>
  );
};
