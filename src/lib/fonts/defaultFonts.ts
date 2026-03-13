// ============================================
// NULISIN - DEFAULT FONT PROFILES
// ============================================

import type { FontProfile } from '@/types';

export const defaultFonts: FontProfile[] = [
  {
    id: 'caveat',
    name: 'Caveat',
    source: 'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIipYS3x.woff2',
    defaultSize: 28,
    lineHeightMultiplier: 1.6,
    letterSpacing: 0.5,
    jitterSettings: {
      xJitter: 1.5,
      yJitter: 2,
      rotationJitter: 1.2,
      spacingJitter: 1,
      baselineShift: 2,
    },
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    source: 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2',
    defaultSize: 26,
    lineHeightMultiplier: 1.7,
    letterSpacing: 0.3,
    jitterSettings: {
      xJitter: 1.2,
      yJitter: 1.8,
      rotationJitter: 1,
      spacingJitter: 0.8,
      baselineShift: 1.5,
    },
  },
  {
    id: 'satisfy',
    name: 'Satisfy',
    source: 'https://fonts.gstatic.com/s/satisfy/v21/rP2Hp2yn6lkG50LoCZOIHQ.woff2',
    defaultSize: 27,
    lineHeightMultiplier: 1.65,
    letterSpacing: 0.4,
    jitterSettings: {
      xJitter: 1.8,
      yJitter: 2.2,
      rotationJitter: 1.5,
      spacingJitter: 1.2,
      baselineShift: 2.5,
    },
  },
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    source: 'https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN9XFiaQoDmlr.woff2',
    defaultSize: 30,
    lineHeightMultiplier: 1.5,
    letterSpacing: 0.6,
    jitterSettings: {
      xJitter: 2,
      yJitter: 2.5,
      rotationJitter: 1.8,
      spacingJitter: 1.5,
      baselineShift: 3,
    },
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand',
    source: 'https://fonts.gstatic.com/s/patrickhand/v23/LDI1apSQOAYtSuYWp8ZhfYeMWcjKm7sp8g.woff2',
    defaultSize: 25,
    lineHeightMultiplier: 1.8,
    letterSpacing: 0.2,
    jitterSettings: {
      xJitter: 1,
      yJitter: 1.5,
      rotationJitter: 0.8,
      spacingJitter: 0.6,
      baselineShift: 1.2,
    },
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower',
    source: 'https://fonts.gstatic.com/s/indieflower/v21/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2',
    defaultSize: 26,
    lineHeightMultiplier: 1.75,
    letterSpacing: 0.3,
    jitterSettings: {
      xJitter: 1.5,
      yJitter: 2,
      rotationJitter: 1.3,
      spacingJitter: 1,
      baselineShift: 2,
    },
  },
];

// Font loading helper
export const loadFont = async (font: FontProfile): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const fontFace = new FontFace(font.name, `url(${font.source})`);
      fontFace
        .load()
        .then(() => {
          document.fonts.add(fontFace);
          resolve(true);
        })
        .catch(() => {
          console.error(`Failed to load font: ${font.name}`);
          resolve(false);
        });
    } catch (error) {
      console.error(`Error loading font: ${font.name}`, error);
      resolve(false);
    }
  });
};

// Load all default fonts
export const loadDefaultFonts = async (): Promise<void> => {
  const loadPromises = defaultFonts.map((font) => loadFont(font));
  await Promise.all(loadPromises);
};

// Get font by ID
export const getFontById = (id: string, customFonts: FontProfile[] = []): FontProfile | undefined => {
  const allFonts = [...defaultFonts, ...customFonts];
  return allFonts.find((font) => font.id === id);
};

// Validate font file
export const validateFontFile = (file: File): { valid: boolean; message?: string } => {
  const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
  const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      message: 'Format file belum didukung. Gunakan .ttf, .otf, .woff, atau .woff2',
    };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      message: 'Ukuran file terlalu besar. Maksimal 5MB.',
    };
  }
  
  return { valid: true };
};
