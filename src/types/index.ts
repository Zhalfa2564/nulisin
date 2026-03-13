// ============================================
// NULISIN - TYPE DEFINITIONS
// ============================================

// Font Profile Types
export interface FontProfile {
  id: string;
  name: string;
  source: string; // URL or base64 data URL
  defaultSize: number;
  lineHeightMultiplier: number;
  letterSpacing: number;
  jitterSettings: JitterSettings;
  isCustom?: boolean;
}

export interface JitterSettings {
  xJitter: number; // Max horizontal offset in pixels
  yJitter: number; // Max vertical offset in pixels
  rotationJitter: number; // Max rotation in degrees
  spacingJitter: number; // Max spacing variation in pixels
  baselineShift: number; // Max baseline shift in pixels
}

// Paper Template Types
export interface PaperTemplate {
  id: string;
  name: string;
  backgroundImage: string; // URL or base64 data URL
  width: number; // in pixels
  height: number; // in pixels
  zones: PaperZones;
  lineHeight: number;
  padding: Padding;
  isCustom?: boolean;
}

export interface PaperZones {
  name: ZoneConfig;
  date: ZoneConfig;
  content: ZoneConfig;
}

export interface ZoneConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Generator State Types
export interface GeneratorState {
  name: string;
  date: string;
  content: string;
  selectedFontId: string;
  selectedPaperId: string;
  customFonts: FontProfile[];
  customPapers: PaperTemplate[];
}

// Custom Template Editor State
export interface TemplateEditorState {
  nameZone: ZoneConfig;
  dateZone: ZoneConfig;
  contentZone: ZoneConfig;
  lineHeight: number;
  padding: Padding;
}

// Render Options
export interface RenderOptions {
  scale: number;
  seed: number;
  debug?: boolean;
}

// Export Options
export interface ExportOptions {
  format: 'png';
  quality: number;
  scale: number;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// Re-export for convenience
export type { FontProfile as FontProfileType };
export type { PaperTemplate as PaperTemplateType };

// Toast/Notification Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// SEO Types
export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}
