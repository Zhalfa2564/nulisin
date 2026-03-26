// ============================================
// NULISIN - HANDWRITING RENDERING ENGINE
// ============================================

import type { FontProfile, PaperTemplate, RenderOptions } from '@/types';

// Generate a deterministic seed from a text string
export const generateDeterministicSeed = (text: string): number => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) || 12345;
};

// Seeded random number generator for consistent rendering.
// Uses a Linear Congruential Generator with well-tested parameters.
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    // Mix the seed to avoid correlated sequences when seeds differ by small amounts
    this.seed = ((seed ^ 0xdeadbeef) >>> 0) % 233280 || 1;
  }

  // Linear Congruential Generator
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Random number between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Random integer between min and max (inclusive)
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  measureCtx: CanvasRenderingContext2D; // Scale-independent context for text measurement
  font: FontProfile;
  paper: PaperTemplate;
  seed: number;
  scale: number;
  random: SeededRandom;
  globalCharIndex: number; // For table random seeds
}

// Initialize canvas for rendering
export const initializeCanvas = (
  canvas: HTMLCanvasElement,
  paper: PaperTemplate,
  scale: number = 1
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Set canvas dimensions
  canvas.width = Math.floor(paper.width * scale);
  canvas.height = Math.floor(paper.height * scale);

  // Scale context
  ctx.scale(scale, scale);

  return ctx;
};

// Draw paper background
export const drawPaperBackground = (
  ctx: CanvasRenderingContext2D,
  paper: PaperTemplate
): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, paper.width, paper.height);
      resolve();
    };
    
    img.onerror = () => {
      // Fallback to white background if image fails
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paper.width, paper.height);
      resolve();
    };
    
    img.src = paper.backgroundImage;
  });
};

// Create a scale-independent canvas for text measurement.
// This guarantees measureText() returns identical values regardless
// of the render canvas scale, preventing line-break differences
// between preview (0.5x) and export (2x).
const createMeasureCanvas = (): CanvasRenderingContext2D => {
  const c = document.createElement('canvas');
  c.width = 1;
  c.height = 1;
  const ctx = c.getContext('2d')!;
  return ctx;
};

// Get character width
const getCharWidth = (
  ctx: CanvasRenderingContext2D,
  char: string
): number => {
  return ctx.measureText(char).width;
};

// Hard-wrap a single word that exceeds maxWidth by splitting character-by-character
const hardWrapWord = (
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number,
  letterSpacing: number
): string[] => {
  const fragments: string[] = [];
  let current = '';
  for (const char of word) {
    const test = current + char;
    const testWidth = ctx.measureText(test).width + (test.length - 1) * letterSpacing;
    if (testWidth > maxWidth && current) {
      fragments.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) fragments.push(current);
  return fragments;
};

// Wrap text into lines that fit within maxWidth
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  letterSpacing: number
): string[] => {
  const lines: string[] = [];
  
  // Split by existing newlines first
  const paragraphs = text.split('\n');
  
  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      // Handle single word wider than maxWidth
      const wordWidth = ctx.measureText(word).width + (word.length - 1) * letterSpacing;
      if (wordWidth > maxWidth) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        const fragments = hardWrapWord(ctx, word, maxWidth, letterSpacing);
        // Push all fragments except the last as complete lines
        for (let i = 0; i < fragments.length - 1; i++) {
          lines.push(fragments[i]);
        }
        currentLine = fragments[fragments.length - 1] || '';
        continue;
      }

      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * letterSpacing;
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  
  return lines;
};

// -----------------------------------------------------------
// Jitter tuning constant: 0.65 produces neat, legible
// handwriting while retaining natural imperfection.
// Raise towards 1.0 for messier writing; lower towards 0 for
// almost-typed appearance.  This multiplier is applied ON TOP
// of each font profile's jitter settings.
// -----------------------------------------------------------
const JITTER_MULTIPLIER = 0.65;

// Render a single character with natural jitter effects
const renderCharacter = (
  context: RenderContext,
  char: string,
  x: number,
  y: number,
  fontSize: number
): number => {
  const { ctx, font } = context;
  const { jitterSettings } = font;

  // Combine global seed with character index using a hash-style mix
  // to avoid correlated sequences when globalCharIndex is large
  const charSeed = context.globalCharIndex++;
  const mixedSeed = ((context.seed * 2654435761 + charSeed * 40503) >>> 0);
  const localRandom = new SeededRandom(mixedSeed);

  // Scale jitter proportionally to font size so small fonts get
  // less absolute jitter and large fonts get proportionally more.
  // Base reference size is 26px (the most common default).
  const sizeRatio = fontSize / 26;
  const m = JITTER_MULTIPLIER * sizeRatio;

  const xOffset = localRandom.range(-jitterSettings.xJitter, jitterSettings.xJitter) * m;
  const yOffset = localRandom.range(-jitterSettings.yJitter, jitterSettings.yJitter) * m;
  const rotation = localRandom.range(-jitterSettings.rotationJitter, jitterSettings.rotationJitter) * JITTER_MULTIPLIER;
  const baselineShift = localRandom.range(-jitterSettings.baselineShift, jitterSettings.baselineShift) * m;

  // Save context for transformation
  ctx.save();

  // Apply transformations
  ctx.translate(x + xOffset, y + yOffset + baselineShift);
  ctx.rotate((rotation * Math.PI) / 180);

  // Draw character
  ctx.fillText(char, 0, 0);

  // Restore context
  ctx.restore();

  // Return character width with spacing jitter.
  // Clamp spacing jitter so effective advance never goes negative
  // (which would cause characters to overlap/reverse).
  const charWidth = getCharWidth(ctx, char);
  const rawSpacingJitter = localRandom.range(-jitterSettings.spacingJitter, jitterSettings.spacingJitter) * JITTER_MULTIPLIER;
  const advance = charWidth + font.letterSpacing + rawSpacingJitter;
  return Math.max(advance, charWidth * 0.3); // floor at 30% of char width
};

// Render a line of text character by character
const renderLine = (
  context: RenderContext,
  line: string,
  startX: number,
  startY: number,
  fontSize: number
): void => {
  let currentX = startX;

  for (const char of line) {
    if (char === ' ') {
      // Handle space with slight variation
      const spaceWidth = context.ctx.measureText(' ').width;
      currentX += spaceWidth + context.font.letterSpacing;
      context.globalCharIndex++; // Bumping index for spaces ensures consistent word seeds
    } else {
      currentX += renderCharacter(context, char, currentX, startY, fontSize);
    }
  }
};

// Render text block with overflow detection
const renderTextBlock = (
  context: RenderContext,
  text: string,
  zone: { x: number; y: number; width: number; height: number },
  fontSize: number,
  isContentZone: boolean = false
): { rendered: boolean; overflow: boolean } => {
  const { ctx, measureCtx, font, paper } = context;

  // Set font on BOTH the render context and the scale-independent
  // measurement context.  Using measureCtx for wrapping guarantees
  // identical line breaks at any canvas scale (Part B fix).
  const fontString = `${fontSize}px "${font.name}"`;
  ctx.font = fontString;
  ctx.fillStyle = '#2c3e50';
  ctx.textBaseline = 'alphabetic';
  measureCtx.font = fontString;

  // Apply padding for content zone bounds
  const effectivePadding = isContentZone ? paper.padding || { top: 0, right: 0, bottom: 0, left: 0 } : { top: 0, right: 0, bottom: 0, left: 0 };
  const effectiveWidth = Math.max(0, zone.width - (effectivePadding.left + effectivePadding.right));
  const effectiveHeight = Math.max(0, zone.height - (effectivePadding.top + effectivePadding.bottom));
  const startX = zone.x + effectivePadding.left;
  const startY = zone.y + effectivePadding.top;

  // Wrap text using the scale-independent measurement context (Part B)
  const lines = wrapText(measureCtx, text, effectiveWidth, font.letterSpacing)
    .filter((line) => line.length > 0); // Filter empty lines to prevent blank rendering artifacts
  
  // Enforce paper.lineHeight for content, fallback to font profile spacing for headers.
  // Clamp to minimum 8px to prevent zero/negative values from crashing layout.
  const rawLineHeight = isContentZone && paper.lineHeight ? paper.lineHeight : (fontSize * font.lineHeightMultiplier);
  const lineHeight = Math.max(8, rawLineHeight);

  // Compute maximum visible lines and detect overflow accurately (Part C)
  const maxVisibleLines = Math.max(1, Math.floor(effectiveHeight / lineHeight));
  const overflow = lines.length > maxVisibleLines;

  // First line baseline: use lineHeight-based offset so text aligns
  // with the paper grid lines instead of using a magic fontSize multiplier
  let currentY = startY + lineHeight * 0.85;
  
  ctx.save();
  // Clip to the effective padded area, not the raw zone, so text
  // that would exceed padding boundaries is truly invisible (Part C)
  if (isContentZone) {
    ctx.beginPath();
    ctx.rect(startX, startY, effectiveWidth, effectiveHeight);
    ctx.clip();
  } else {
    ctx.beginPath();
    ctx.rect(zone.x, zone.y, zone.width, zone.height);
    ctx.clip();
  }

  for (const line of lines) {
    if (currentY > startY + effectiveHeight) {
      break; // Stop if exceeding effective zone height
    }
    
    renderLine(context, line, startX, currentY, fontSize);
    currentY += lineHeight;
  }
  ctx.restore();

  return { rendered: true, overflow };
};

// Main render function
export const renderHandwriting = async (
  canvas: HTMLCanvasElement,
  options: {
    name: string;
    date: string;
    content: string;
    font: FontProfile;
    paper: PaperTemplate;
    renderOptions: RenderOptions;
  }
): Promise<{ success: boolean; overflow?: boolean; error?: string }> => {
  const { name, date, content, font, paper, renderOptions } = options;
  const { scale, seed } = renderOptions;

  try {
    // Initialize canvas
    const ctx = initializeCanvas(canvas, paper, scale);
    if (!ctx) {
      return { success: false, error: 'Failed to initialize canvas' };
    }

    // Draw background
    await drawPaperBackground(ctx, paper);

    // Create a scale-independent canvas for text measurement (Part B)
    const measureCtx = createMeasureCanvas();

    // Create render context
    const context: RenderContext = {
      ctx,
      measureCtx,
      font,
      paper,
      seed,
      scale,
      random: new SeededRandom(seed),
      globalCharIndex: 0,
    };

    let hasOverflow = false;

    // Render name
    if (name.trim()) {
      const nameResult = renderTextBlock(
        context,
        name,
        paper.zones.name,
        font.defaultSize,
        false
      );
      hasOverflow = hasOverflow || nameResult.overflow;
    }

    // Render date
    if (date.trim()) {
      const dateResult = renderTextBlock(
        context,
        date,
        paper.zones.date,
        font.defaultSize * 0.9,
        false
      );
      hasOverflow = hasOverflow || dateResult.overflow;
    }

    // Render content
    if (content.trim()) {
      const contentResult = renderTextBlock(
        context,
        content,
        paper.zones.content,
        font.defaultSize,
        true
      );
      hasOverflow = hasOverflow || contentResult.overflow;
    }

    return { success: true, overflow: hasOverflow };
  } catch (error) {
    console.error('Rendering error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown rendering error',
    };
  }
};

// Export canvas to PNG
export const exportToPNG = (
  canvas: HTMLCanvasElement,
  filename: string = 'nulisin-hasil.png'
): void => {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Gagal mengekspor gambar');
  }
};

// Generate preview (lower quality for performance)
export const generatePreview = async (
  canvas: HTMLCanvasElement,
  options: Omit<Parameters<typeof renderHandwriting>[1], 'renderOptions'> & {
    previewScale?: number;
  }
): Promise<{ success: boolean; overflow?: boolean; error?: string }> => {
  const previewScale = options.previewScale || 0.5;
  const deterministicSeed = generateDeterministicSeed(options.name + options.date + options.content);
  return renderHandwriting(canvas, {
    ...options,
    renderOptions: {
      scale: previewScale,
      seed: deterministicSeed, // Consistent seed
    },
  });
};

// Generate export (high quality)
export const generateExport = async (
  canvas: HTMLCanvasElement,
  options: Omit<Parameters<typeof renderHandwriting>[1], 'renderOptions'> & {
    exportScale?: number;
  }
): Promise<{ success: boolean; overflow?: boolean; error?: string }> => {
  const exportScale = options.exportScale || 2;
  const deterministicSeed = generateDeterministicSeed(options.name + options.date + options.content);
  return renderHandwriting(canvas, {
    ...options,
    renderOptions: {
      scale: exportScale,
      seed: deterministicSeed, // Consistent seed matches preview
    },
  });
};

// Preload font for rendering
export const preloadFontForRender = async (font: FontProfile): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if font is already loaded
    if (document.fonts.check(`${font.defaultSize}px "${font.name}"`)) {
      resolve(true);
      return;
    }

    // Wait for font to load
    document.fonts
      .load(`${font.defaultSize}px "${font.name}"`)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
};
