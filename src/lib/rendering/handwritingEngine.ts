// ============================================
// NULISIN - HANDWRITING RENDERING ENGINE
// ============================================

import type { FontProfile, PaperTemplate, RenderOptions } from '@/types';

// Seeded random number generator for consistent rendering
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
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
  font: FontProfile;
  paper: PaperTemplate;
  seed: number;
  scale: number;
  random: SeededRandom;
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

// Get character width
const getCharWidth = (
  ctx: CanvasRenderingContext2D,
  char: string
): number => {
  return ctx.measureText(char).width;
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

// Render a single character with natural jitter effects
const renderCharacter = (
  context: RenderContext,
  char: string,
  x: number,
  y: number,
  _fontSize: number
): number => {
  const { ctx, font } = context;
  const { jitterSettings } = font;

  // Generate seeded random values for this character position
  // This ensures same character at same position gets same jitter
  const charSeed = Math.floor(x * 1000 + y);
  const localRandom = new SeededRandom(context.seed + charSeed);

  // Apply jitter effects - more natural variation
  const xOffset = localRandom.range(-jitterSettings.xJitter, jitterSettings.xJitter);
  const yOffset = localRandom.range(-jitterSettings.yJitter, jitterSettings.yJitter);
  const rotation = localRandom.range(-jitterSettings.rotationJitter, jitterSettings.rotationJitter);
  const baselineShift = localRandom.range(-jitterSettings.baselineShift, jitterSettings.baselineShift);

  // Save context for transformation
  ctx.save();

  // Apply transformations
  ctx.translate(x + xOffset, y + yOffset + baselineShift);
  ctx.rotate((rotation * Math.PI) / 180);

  // Draw character
  ctx.fillText(char, 0, 0);

  // Restore context
  ctx.restore();

  // Return character width with spacing jitter
  const charWidth = getCharWidth(ctx, char);
  const spacingJitter = localRandom.range(-jitterSettings.spacingJitter, jitterSettings.spacingJitter);
  return charWidth + font.letterSpacing + spacingJitter;
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
  fontSize: number
): { rendered: boolean; overflow: boolean } => {
  const { ctx, font } = context;

  // Set font
  ctx.font = `${fontSize}px "${font.name}"`;
  ctx.fillStyle = '#2c3e50';
  ctx.textBaseline = 'alphabetic';

  // Wrap text
  const lines = wrapText(ctx, text, zone.width, font.letterSpacing);
  const lineHeight = fontSize * font.lineHeightMultiplier;

  // Check for overflow
  const totalHeight = lines.length * lineHeight;
  const overflow = totalHeight > zone.height;

  // Render lines
  let currentY = zone.y + fontSize;
  
  for (const line of lines) {
    if (currentY > zone.y + zone.height) {
      break; // Stop if exceeding zone height
    }
    
    renderLine(context, line, zone.x, currentY, fontSize);
    currentY += lineHeight;
  }

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

    // Create render context
    const context: RenderContext = {
      ctx,
      font,
      paper,
      seed,
      scale,
      random: new SeededRandom(seed),
    };

    let hasOverflow = false;

    // Render name
    if (name.trim()) {
      const nameResult = renderTextBlock(
        context,
        name,
        paper.zones.name,
        font.defaultSize
      );
      hasOverflow = hasOverflow || nameResult.overflow;
    }

    // Render date
    if (date.trim()) {
      const dateResult = renderTextBlock(
        context,
        date,
        paper.zones.date,
        font.defaultSize * 0.9
      );
      hasOverflow = hasOverflow || dateResult.overflow;
    }

    // Render content
    if (content.trim()) {
      const contentResult = renderTextBlock(
        context,
        content,
        paper.zones.content,
        font.defaultSize
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
  return renderHandwriting(canvas, {
    ...options,
    renderOptions: {
      scale: previewScale,
      seed: 12345, // Fixed seed for preview consistency
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
  return renderHandwriting(canvas, {
    ...options,
    renderOptions: {
      scale: exportScale,
      seed: Date.now(), // Different seed for each export
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
