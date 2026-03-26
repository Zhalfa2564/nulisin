// ============================================
// NULISIN - DEFAULT PAPER TEMPLATES
// ============================================

import type { PaperTemplate } from '@/types';

// Generate paper backgrounds using SVG data URLs
const createLinedPaper = (color: string = '#fef9e7'): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100">
      <rect width="800" height="1100" fill="${color}"/>
      <line x1="80" y1="0" x2="80" y2="1100" stroke="#ff6b6b" stroke-width="2"/>
      ${Array.from({ length: 55 }, (_, i) => {
        const y = 60 + i * 20;
        return `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="#a8d5e5" stroke-width="1"/>`;
      }).join('')}
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createGridPaper = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100">
      <rect width="800" height="1100" fill="#ffffff"/>
      ${Array.from({ length: 81 }, (_, i) => {
        const x = i * 10;
        return `<line x1="${x}" y1="0" x2="${x}" y2="1100" stroke="#e0e0e0" stroke-width="0.5"/>`;
      }).join('')}
      ${Array.from({ length: 111 }, (_, i) => {
        const y = i * 10;
        return `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="#e0e0e0" stroke-width="0.5"/>`;
      }).join('')}
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createBlankPaper = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100">
      <rect width="800" height="1100" fill="#ffffff"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createOldPaper = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100">
      <rect width="800" height="1100" fill="#f5f0e1"/>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
        <feDiffuseLighting in="noise" lighting-color="#f5f0e1" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="60"/>
        </feDiffuseLighting>
      </filter>
      <rect width="800" height="1100" fill="#f5f0e1" opacity="0.9"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createDotPaper = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100">
      <rect width="800" height="1100" fill="#ffffff"/>
      ${Array.from({ length: 80 }, (_, row) =>
        Array.from({ length: 60 }, (_, col) => {
          const x = 20 + col * 13;
          const y = 20 + row * 13;
          return `<circle cx="${x}" cy="${y}" r="1" fill="#c0c0c0"/>`;
        }).join('')
      ).join('')}
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const defaultPapers: PaperTemplate[] = [
  {
    id: 'lined-cream',
    name: 'Kertas Bergaris Krem',
    backgroundImage: createLinedPaper('#fef9e7'),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 100, y: 80, width: 600, height: 40 },
      date: { x: 100, y: 120, width: 600, height: 40 },
      content: { x: 100, y: 180, width: 600, height: 800 },
    },
    lineHeight: 28,
    padding: { top: 60, right: 80, bottom: 60, left: 100 },
  },
  {
    id: 'lined-white',
    name: 'Kertas Bergaris Putih',
    backgroundImage: createLinedPaper('#ffffff'),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 100, y: 80, width: 600, height: 40 },
      date: { x: 100, y: 120, width: 600, height: 40 },
      content: { x: 100, y: 180, width: 600, height: 800 },
    },
    lineHeight: 28,
    padding: { top: 60, right: 80, bottom: 60, left: 100 },
  },
  {
    id: 'blank-white',
    name: 'Kertas Polos Putih',
    backgroundImage: createBlankPaper(),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 80, y: 60, width: 640, height: 40 },
      date: { x: 80, y: 110, width: 640, height: 40 },
      content: { x: 80, y: 170, width: 640, height: 850 },
    },
    lineHeight: 32,
    padding: { top: 40, right: 60, bottom: 40, left: 80 },
  },
  {
    id: 'grid-paper',
    name: 'Kertas Kotak-kotak',
    backgroundImage: createGridPaper(),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 80, y: 60, width: 640, height: 40 },
      date: { x: 80, y: 110, width: 640, height: 40 },
      content: { x: 80, y: 170, width: 640, height: 850 },
    },
    lineHeight: 30,
    padding: { top: 40, right: 60, bottom: 40, left: 80 },
  },
  {
    id: 'dot-paper',
    name: 'Kertas Titik-titik',
    backgroundImage: createDotPaper(),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 80, y: 60, width: 640, height: 40 },
      date: { x: 80, y: 110, width: 640, height: 40 },
      content: { x: 80, y: 170, width: 640, height: 850 },
    },
    lineHeight: 30,
    padding: { top: 40, right: 60, bottom: 40, left: 80 },
  },
  {
    id: 'old-paper',
    name: 'Kertas Lama',
    backgroundImage: createOldPaper(),
    width: 800,
    height: 1100,
    zones: {
      name: { x: 80, y: 60, width: 640, height: 40 },
      date: { x: 80, y: 110, width: 640, height: 40 },
      content: { x: 80, y: 170, width: 640, height: 850 },
    },
    lineHeight: 32,
    padding: { top: 40, right: 60, bottom: 40, left: 80 },
  },
];

// Get paper by ID
export const getPaperById = (id: string, customPapers: PaperTemplate[] = []): PaperTemplate | undefined => {
  const allPapers = [...defaultPapers, ...customPapers];
  return allPapers.find((paper) => paper.id === id);
};

// Validate paper image file
export const validatePaperFile = (file: File): { valid: boolean; message?: string } => {
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      message: 'Format file belum didukung. Gunakan .jpg, .jpeg, atau .png',
    };
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      message: 'Ukuran file terlalu besar. Maksimal 10MB.',
    };
  }
  
  return { valid: true };
};

// Check image dimensions
export const checkImageDimensions = (
  file: File,
  minWidth: number = 400,
  minHeight: number = 600
): Promise<{ valid: boolean; message?: string; width?: number; height?: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          message: `Ukuran gambar terlalu kecil. Minimal ${minWidth}x${minHeight} piksel.`,
          width: img.width,
          height: img.height,
        });
      } else {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
        });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        message: 'Gagal membaca gambar. Pastikan file tidak corrupt.',
      });
    };
    img.src = objectUrl;
  });
};
