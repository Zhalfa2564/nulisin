// ============================================
// NULISIN - PAPER UPLOADER COMPONENT
// ============================================

import React, { useState, useRef, useCallback } from 'react';
import { X, Check, AlertCircle, Settings, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { validatePaperFile, checkImageDimensions } from '@/lib/templates/defaultPapers';
import { useCustomPapers } from '@/hooks/useLocalStorage';
import type { PaperTemplate, ZoneConfig } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaperUploaderProps {
  onPaperAdded?: (paper: PaperTemplate) => void;
  onPaperDeleted?: (paperId: string) => void;
}

const defaultZones = {
  name: { x: 100, y: 80, width: 600, height: 40 },
  date: { x: 100, y: 120, width: 600, height: 40 },
  content: { x: 100, y: 180, width: 600, height: 800 },
};

export const PaperUploader: React.FC<PaperUploaderProps> = ({ onPaperAdded, onPaperDeleted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [paperName, setPaperName] = useState('');
  const [zones, setZones] = useState(defaultZones);
  const [lineHeight, setLineHeight] = useState(28);
  const [padding, setPadding] = useState({ top: 40, right: 60, bottom: 40, left: 80 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPaper, removePaper, papers: customPapers } = useCustomPapers();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    const validation = validatePaperFile(file);
    if (!validation.valid) {
      setError(validation.message || 'File tidak valid');
      return;
    }

    setIsLoading(true);
    setError(null);

    const dimensionCheck = await checkImageDimensions(file);
    if (!dimensionCheck.valid) {
      setError(dimensionCheck.message || 'Gambar tidak valid');
      setIsLoading(false);
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const source = e.target?.result as string;
      setPreviewImage(source);
      setImageDimensions({
        width: dimensionCheck.width || 800,
        height: dimensionCheck.height || 1100,
      });
      setPaperName(file.name.replace(/\.[^/.]+$/, ''));
      
      // Adjust zones based on image dimensions
      const width = dimensionCheck.width || 800;
      const height = dimensionCheck.height || 1100;
      setZones({
        name: { x: Math.floor(width * 0.12), y: Math.floor(height * 0.07), width: Math.floor(width * 0.76), height: Math.floor(height * 0.036) },
        date: { x: Math.floor(width * 0.12), y: Math.floor(height * 0.11), width: Math.floor(width * 0.76), height: Math.floor(height * 0.036) },
        content: { x: Math.floor(width * 0.12), y: Math.floor(height * 0.16), width: Math.floor(width * 0.76), height: Math.floor(height * 0.73) },
      });
      
      setShowEditor(true);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

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

  const handleSaveTemplate = useCallback(() => {
    if (!previewImage || !imageDimensions || !paperName.trim()) return;

    if (imageDimensions.width <= 0 || imageDimensions.height <= 0) {
      setError('Dimensi gambar tidak valid.');
      return;
    }

    if (
      zones.content.width < 100 || 
      zones.content.height < 50 || 
      zones.content.x < 0 || 
      zones.content.y < 0 || 
      zones.content.x + zones.content.width > imageDimensions.width || 
      zones.content.y + zones.content.height > imageDimensions.height
    ) {
      setError('Area isi tidak valid atau melampaui batas kertas (lebar atau tinggi terlalu besar).');
      return;
    }

    const paperId = `custom-paper-${Date.now()}`;
    const paperTemplate: PaperTemplate = {
      id: paperId,
      name: paperName.trim(),
      backgroundImage: previewImage,
      width: imageDimensions.width,
      height: imageDimensions.height,
      zones,
      lineHeight,
      padding,
      isCustom: true,
    };

    // Save to localStorage
    addPaper({
      id: paperId,
      name: paperName.trim(),
      backgroundImage: previewImage,
      width: imageDimensions.width,
      height: imageDimensions.height,
      zones,
      lineHeight,
      padding,
    });

    setSuccess(`Template "${paperName.trim()}" berhasil ditambahkan!`);
    onPaperAdded?.(paperTemplate);
    setShowEditor(false);
    setPreviewImage(null);
    setPaperName('');
    setZones(defaultZones);
    setPadding({ top: 40, right: 60, bottom: 40, left: 80 });
  }, [previewImage, imageDimensions, paperName, zones, lineHeight, padding, addPaper, onPaperAdded]);

  const updateZone = (zoneKey: keyof typeof zones, field: keyof ZoneConfig, value: number) => {
    setZones((prev) => ({
      ...prev,
      [zoneKey]: {
        ...prev[zoneKey],
        [field]: value,
      },
    }));
  };

  const updatePadding = (field: keyof typeof padding, value: number) => {
    setPadding((prev) => ({ ...prev, [field]: value }));
  };

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    if (window.confirm(`Hapus template kertas "${name}"?`)) {
      removePaper(id);
      onPaperDeleted?.(id);
      setSuccess(`Template "${name}" berhasil dihapus.`);
      setError(null);
    }
  }, [removePaper, onPaperDeleted]);

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
          accept=".jpg,.jpeg,.png"
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
              <ImageIcon className={`w-4 h-4 ${isDragging ? 'text-amber-600' : 'text-gray-500'}`} />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {isLoading ? 'Memuat gambar...' : 'Unggah Kertas Custom'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Seret file atau klik untuk memilih
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              .jpg, .png (maks. 10MB)
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
          <button onClick={clearMessages} className="text-red-400 hover:text-red-600">
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
          <button onClick={clearMessages} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* List of custom papers */}
      {customPapers.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Kertas Custom Tersimpan:</p>
          <div className="flex flex-col gap-2">
            {customPapers.map((paper) => (
              <div
                key={paper.id}
                className="flex items-center justify-between px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-md border border-amber-200"
              >
                <span className="truncate mr-2 font-medium">{paper.name}</span>
                <button
                  onClick={() => handleDelete(paper.id, paper.name)}
                  className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  title="Hapus template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Atur Template Kertas
            </DialogTitle>
          </DialogHeader>

          {previewImage && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ maxHeight: '250px' }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {/* Zone overlays */}
                <div
                  className="absolute border-2 border-blue-500/50 bg-blue-500/10"
                  style={{
                    left: `${(zones.name.x / (imageDimensions?.width || 800)) * 100}%`,
                    top: `${(zones.name.y / (imageDimensions?.height || 1100)) * 100}%`,
                    width: `${(zones.name.width / (imageDimensions?.width || 800)) * 100}%`,
                    height: `${(zones.name.height / (imageDimensions?.height || 1100)) * 100}%`,
                  }}
                />
                <div
                  className="absolute border-2 border-green-500/50 bg-green-500/10"
                  style={{
                    left: `${(zones.date.x / (imageDimensions?.width || 800)) * 100}%`,
                    top: `${(zones.date.y / (imageDimensions?.height || 1100)) * 100}%`,
                    width: `${(zones.date.width / (imageDimensions?.width || 800)) * 100}%`,
                    height: `${(zones.date.height / (imageDimensions?.height || 1100)) * 100}%`,
                  }}
                />
                <div
                  className="absolute border-2 border-purple-500/50 bg-purple-500/10"
                  style={{
                    left: `${(zones.content.x / (imageDimensions?.width || 800)) * 100}%`,
                    top: `${(zones.content.y / (imageDimensions?.height || 1100)) * 100}%`,
                    width: `${(zones.content.width / (imageDimensions?.width || 800)) * 100}%`,
                    height: `${(zones.content.height / (imageDimensions?.height || 1100)) * 100}%`,
                  }}
                />
              </div>

              {/* Template name */}
              <div>
                <Label htmlFor="paper-name">Nama Template</Label>
                <Input
                  id="paper-name"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  placeholder="Contoh: Kertas Catatanku"
                />
              </div>

              {/* Line height */}
              <div>
                <Label>Tinggi Baris: {lineHeight}px</Label>
                <Slider
                  value={[lineHeight]}
                  onValueChange={([v]) => setLineHeight(v)}
                  min={20}
                  max={50}
                  step={1}
                />
              </div>

              {/* Zone editors */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Area Tulisan (X, Y, Lebar, Tinggi)</h4>
                
                {(['name', 'date', 'content'] as const).map((zoneKey) => (
                  <div key={zoneKey} className="grid grid-cols-4 gap-2">
                    <span className="text-xs text-gray-500 capitalize col-span-4">
                      {zoneKey === 'name' ? 'Area Nama' : zoneKey === 'date' ? 'Area Tanggal' : 'Area Isi'}
                    </span>
                    <Input
                      type="number"
                      placeholder="X"
                      value={zones[zoneKey].x}
                      onChange={(e) => updateZone(zoneKey, 'x', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={zones[zoneKey].y}
                      onChange={(e) => updateZone(zoneKey, 'y', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Lebar"
                      value={zones[zoneKey].width}
                      onChange={(e) => updateZone(zoneKey, 'width', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Tinggi"
                      value={zones[zoneKey].height}
                      onChange={(e) => updateZone(zoneKey, 'height', parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Padding Area Isi (Atas, Kanan, Bawah, Kiri)</h4>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    placeholder="Atas"
                    value={padding.top}
                    onChange={(e) => updatePadding('top', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Kanan"
                    value={padding.right}
                    onChange={(e) => updatePadding('right', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Bawah"
                    value={padding.bottom}
                    onChange={(e) => updatePadding('bottom', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Kiri"
                    value={padding.left}
                    onChange={(e) => updatePadding('left', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500/30 border border-blue-500" />
                  <span>Nama</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/30 border border-green-500" />
                  <span>Tanggal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500/30 border border-purple-500" />
                  <span>Isi</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditor(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={!paperName.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  Simpan Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
