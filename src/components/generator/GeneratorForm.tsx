// ============================================
// NULISIN - GENERATOR FORM COMPONENT
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Download, Save, Type, Palette, Settings } from 'lucide-react';
import type { FontProfile, PaperTemplate } from '@/types';
import { defaultFonts } from '@/lib/fonts/defaultFonts';
import { defaultPapers } from '@/lib/templates/defaultPapers';
import { useCustomFonts, useCustomPapers, useDraftAutosave, useDebounce } from '@/hooks/useLocalStorage';
import { FontUploader } from './FontUploader';
import { PaperUploader } from './PaperUploader';

interface GeneratorFormProps {
  name: string;
  setName: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  selectedFontId: string;
  setSelectedFontId: (value: string) => void;
  selectedPaperId: string;
  setSelectedPaperId: (value: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  name,
  setName,
  date,
  setDate,
  content,
  setContent,
  selectedFontId,
  setSelectedFontId,
  selectedPaperId,
  setSelectedPaperId,
  onDownload,
  isDownloading,
}) => {
  const { fonts: customFonts, addFont: addCustomFont } = useCustomFonts();
  const { papers: customPapers, addPaper: addCustomPaper } = useCustomPapers();
  const { saveDraft, draft, getDraftAge } = useDraftAutosave();
  const [activeTab, setActiveTab] = useState('teks');
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  // Custom fonts and papers are combined in the select dropdowns directly

  // Debounced values for autosave
  const debouncedName = useDebounce(name, 1000);
  const debouncedDate = useDebounce(date, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Autosave draft
  useEffect(() => {
    if (debouncedName || debouncedDate || debouncedContent) {
      saveDraft({
        name: debouncedName,
        date: debouncedDate,
        content: debouncedContent,
        selectedFontId,
        selectedPaperId,
      });
      setShowDraftSaved(true);
      const timer = setTimeout(() => setShowDraftSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [debouncedName, debouncedDate, debouncedContent, selectedFontId, selectedPaperId, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    if (draft && !name && !date && !content) {
      const age = getDraftAge();
      // Only load draft if it's less than 7 days old
      if (age && age < 7 * 24 * 60 * 60 * 1000) {
        setName(draft.name);
        setDate(draft.date);
        setContent(draft.content);
        setSelectedFontId(draft.selectedFontId);
        setSelectedPaperId(draft.selectedPaperId);
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    setName('');
    setDate('');
    setContent('');
    setSelectedFontId(defaultFonts[0].id);
    setSelectedPaperId(defaultPapers[0].id);
  }, [setName, setDate, setContent, setSelectedFontId, setSelectedPaperId]);

  const handleFontAdded = useCallback((font: FontProfile) => {
    addCustomFont({
      id: font.id,
      name: font.name,
      source: font.source,
    });
    setSelectedFontId(font.id);
  }, [addCustomFont, setSelectedFontId]);

  const handlePaperAdded = useCallback((paper: PaperTemplate) => {
    addCustomPaper({
      id: paper.id,
      name: paper.name,
      backgroundImage: paper.backgroundImage,
      width: paper.width,
      height: paper.height,
      zones: paper.zones,
      lineHeight: paper.lineHeight,
      padding: paper.padding,
    });
    setSelectedPaperId(paper.id);
  }, [addCustomPaper, setSelectedPaperId]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teks" className="flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Teks</span>
          </TabsTrigger>
          <TabsTrigger value="gaya" className="flex items-center gap-1.5">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Gaya</span>
          </TabsTrigger>
          <TabsTrigger value="kustom" className="flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Kustom</span>
          </TabsTrigger>
        </TabsList>

        {/* Teks Tab */}
        <TabsContent value="teks" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama / Salam</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Halo Budi,"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Contoh: 13 Maret 2026"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Isi Tulisan</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi suratmu di sini..."
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Draft saved indicator */}
          {showDraftSaved && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Save className="w-3 h-3" />
              Draft tersimpan otomatis di browser.
            </p>
          )}
        </TabsContent>

        {/* Gaya Tab */}
        <TabsContent value="gaya" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font">Pilih Font</Label>
            <Select value={selectedFontId} onValueChange={setSelectedFontId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih font tulisan tangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default-fonts" disabled className="text-gray-400">
                  Font Bawaan
                </SelectItem>
                {defaultFonts.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    {font.name}
                  </SelectItem>
                ))}
                {customFonts.length > 0 && (
                  <>
                    <SelectItem value="custom-fonts" disabled className="text-gray-400">
                      Font Custom
                    </SelectItem>
                    {customFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paper">Pilih Kertas</Label>
            <Select value={selectedPaperId} onValueChange={setSelectedPaperId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih template kertas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default-papers" disabled className="text-gray-400">
                  Template Bawaan
                </SelectItem>
                {defaultPapers.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.name}
                  </SelectItem>
                ))}
                {customPapers.length > 0 && (
                  <>
                    <SelectItem value="custom-papers" disabled className="text-gray-400">
                      Template Custom
                    </SelectItem>
                    {customPapers.map((paper) => (
                      <SelectItem key={paper.id} value={paper.id}>
                        {paper.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Kustom Tab */}
        <TabsContent value="kustom" className="space-y-4">
          <FontUploader onFontAdded={handleFontAdded} />
          <PaperUploader onPaperAdded={handlePaperAdded} />
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={onDownload}
          disabled={isDownloading || !content.trim()}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Unduh PNG
        </Button>
      </div>
    </div>
  );
};
