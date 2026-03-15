// ============================================
// NULISIN - GENERATOR PAGE COMPONENT
// ============================================

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { CanvasPreview } from './CanvasPreview';
import { GeneratorForm } from './GeneratorForm';
import { exportToPNG, generateExport } from '@/lib/rendering/handwritingEngine';
import { getFontById } from '@/lib/fonts/defaultFonts';
import { getPaperById } from '@/lib/templates/defaultPapers';
import { useCustomFonts, useCustomPapers } from '@/hooks/useLocalStorage';
import type { FontProfile, PaperTemplate } from '@/types';
import { defaultFonts } from '@/lib/fonts/defaultFonts';
import { defaultPapers } from '@/lib/templates/defaultPapers';
import { toast } from 'sonner';
import { Pen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GeneratorPage: React.FC = () => {
  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [selectedFontId, setSelectedFontId] = useState(defaultFonts[0].id);
  const [selectedPaperId, setSelectedPaperId] = useState(defaultPapers[0].id);
  
  // Loading state
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Custom fonts and papers
  const { fonts: storedCustomFonts } = useCustomFonts();
  const { papers: storedCustomPapers } = useCustomPapers();
  
  // Export canvas ref (hidden)
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  // Build custom font profiles
  const customFontProfiles: FontProfile[] = useMemo(() => {
    return storedCustomFonts.map((f) => ({
      id: f.id,
      name: f.name,
      source: f.source,
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
    }));
  }, [storedCustomFonts]);

  // Build custom paper templates
  const customPaperTemplates: PaperTemplate[] = useMemo(() => {
    return storedCustomPapers.map((p) => ({
      id: p.id,
      name: p.name,
      backgroundImage: p.backgroundImage,
      width: p.width,
      height: p.height,
      zones: p.zones,
      lineHeight: p.lineHeight,
      padding: p.padding,
      isCustom: true,
    }));
  }, [storedCustomPapers]);

  // Get current font and paper
  const currentFont = useMemo(() => {
    return getFontById(selectedFontId, customFontProfiles);
  }, [selectedFontId, customFontProfiles]);

  const currentPaper = useMemo(() => {
    return getPaperById(selectedPaperId, customPaperTemplates);
  }, [selectedPaperId, customPaperTemplates]);

  // Load custom fonts on mount — skip fonts already registered to
  // avoid memory accumulation from duplicate FontFace objects
  useEffect(() => {
    const loadCustomFonts = async () => {
      for (const font of storedCustomFonts) {
        // Skip if already loaded in this session
        if (document.fonts.check(`16px "${font.name}"`)) continue;
        try {
          const fontSource = font.source.startsWith('data:') ? font.source : `url(${font.source})`;
          const fontFace = new FontFace(font.name, `url("${fontSource}")`);
          await fontFace.load();
          document.fonts.add(fontFace);
        } catch (error) {
          console.error(`Failed to load custom font: ${font.name}`, error);
        }
      }
    };
    loadCustomFonts();
  }, [storedCustomFonts]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!exportCanvasRef.current || !currentFont || !currentPaper) {
      toast.error('Tidak dapat mengekspor. Pastikan font dan kertas sudah dipilih.');
      return;
    }

    if (!content.trim()) {
      toast.error('Isi tulisan tidak boleh kosong.');
      return;
    }

    setIsDownloading(true);

    try {
      const result = await generateExport(exportCanvasRef.current, {
        name,
        date,
        content,
        font: currentFont,
        paper: currentPaper,
        exportScale: 2,
      });

      if (result.success) {
        exportToPNG(exportCanvasRef.current, `nulisin-${Date.now()}.png`);
        toast.success('Gambar berhasil diunduh!');
      } else {
        toast.error(result.error || 'Gagal mengekspor gambar');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengekspor');
    } finally {
      setIsDownloading(false);
    }
  }, [name, date, content, currentFont, currentPaper]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <Pen className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 leading-tight">Nulisin</span>
              <span className="text-[10px] text-gray-500 leading-tight">Generator Tulisan Tangan</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/generator"
              className="text-sm font-medium text-amber-600"
            >
              Generator
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel - Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                Generator Tulisan Tangan
              </h1>
              <p className="text-sm text-gray-500 mb-5">
                Ketik, pilih gaya, dan unduh hasilnya.
              </p>
              
              <GeneratorForm
                name={name}
                setName={setName}
                date={date}
                setDate={setDate}
                content={content}
                setContent={setContent}
                selectedFontId={selectedFontId}
                setSelectedFontId={setSelectedFontId}
                selectedPaperId={selectedPaperId}
                setSelectedPaperId={setSelectedPaperId}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h2 className="text-sm font-medium text-gray-700 mb-3">
                  Pratinjau Hasil
                </h2>
                
                <CanvasPreview
                  name={name}
                  date={date}
                  content={content}
                  font={currentFont || null}
                  paper={currentPaper || null}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden export canvas */}
      <canvas
        ref={exportCanvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};
