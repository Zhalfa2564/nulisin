// ============================================
// NULISIN - SENTRY ERROR MONITORING
// Only active when VITE_SENTRY_DSN is set.
// Privacy-aware: filters breadcrumbs with long text.
// ============================================

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const IS_PROD = import.meta.env.PROD;

/**
 * Initialize Sentry. Safe to call even without DSN — will no-op.
 * Must be called before React renders (in main.tsx).
 */
export function initSentry(): void {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_PROD ? 'production' : 'development',
    release: `nulisin@${import.meta.env.VITE_APP_VERSION || '0.0.0'}`,

    // Conservative sampling for a small project
    tracesSampleRate: 0.1,

    // Session replay: only capture on error, never regular sessions
    replaysOnErrorSampleRate: 0.1,
    replaysSessionSampleRate: 0,

    integrations: [
      Sentry.replayIntegration({
        // Privacy: mask all text and block all media by default
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Privacy: filter breadcrumbs that might contain user-generated text
    beforeBreadcrumb(breadcrumb) {
      // Block input events completely as they contain keystrokes/values
      if (breadcrumb.category === 'ui.input') {
        return null;
      }
      
      // Scrub text content from click breadcrumbs to prevent capturing user text
      if (breadcrumb.category === 'ui.click' && breadcrumb.data) {
        if ('textContent' in breadcrumb.data) delete breadcrumb.data.textContent;
        if ('value' in breadcrumb.data) delete breadcrumb.data.value;
      }

      // Truncate long messages in any breadcrumb to prevent accidental data leaks
      if (breadcrumb.message && breadcrumb.message.length > 100) {
        breadcrumb.message = breadcrumb.message.slice(0, 100) + '…[scrubbed]';
      }
      
      return breadcrumb;
    },

    // Privacy: scrub potentially sensitive data from events
    beforeSend(event) {
      // Remove any request body data that might contain user text
      if (event.request?.data) {
        delete event.request.data;
      }
      
      // Prevent long exception messages from leaking data
      if (event.exception?.values) {
        event.exception.values.forEach(exception => {
          if (exception.value && exception.value.length > 200) {
            exception.value = exception.value.slice(0, 200) + '…[scrubbed]';
          }
        });
      }

      return event;
    },
  });
}

/**
 * Manually capture an error with optional context.
 * Safe to call even if Sentry is not initialized.
 */
export function captureError(
  error: unknown,
  context?: Record<string, string | number | boolean>
): void {
  if (!SENTRY_DSN) return;

  if (error instanceof Error) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    Sentry.captureMessage(String(error), {
      level: 'error',
      extra: context,
    });
  }
}
