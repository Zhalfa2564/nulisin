// ============================================
// NULISIN - GOOGLE ANALYTICS 4
// Centralized analytics utility.
// Only active in production when VITE_GA_MEASUREMENT_ID is set.
// ============================================

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const IS_PROD = import.meta.env.PROD;

// Extend window for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

/**
 * Inject the Google Analytics gtag.js script.
 * Called once at app startup. No-ops if GA_ID is missing or not in production.
 */
export function initAnalytics(): void {
  if (initialized || !IS_PROD || !GA_ID) return;
  initialized = true;

  // Inject gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  // Disable automatic page_view — we send them manually on route changes
  window.gtag('config', GA_ID, { send_page_view: false });
}

/**
 * Track a page view. Called on every SPA route change.
 */
export function trackPageView(path: string, title: string): void {
  if (!initialized || !GA_ID) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

/**
 * Track a custom event. Never include user-generated text content.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!initialized || !GA_ID) return;
  window.gtag('event', eventName, params);
}
