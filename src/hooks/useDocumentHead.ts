// ============================================
// NULISIN - DOCUMENT HEAD HOOK
// Lightweight per-route head management for SPA
// ============================================

import { useEffect } from 'react';
import type { PageMeta } from '@/lib/seo/meta';
import { siteConfig } from '@/lib/seo/meta';

/**
 * Sets document title, meta description, canonical, and Open Graph tags
 * for the current route. Cleans up by restoring fallback values on unmount.
 */
export function useDocumentHead(meta: PageMeta) {
  useEffect(() => {
    // Title
    document.title = meta.title;

    // Helper to set or create a <meta> tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', meta.description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonical);

    // Open Graph
    setMeta('property', 'og:title', meta.ogTitle);
    setMeta('property', 'og:description', meta.ogDescription);
    setMeta('property', 'og:type', meta.ogType);
    setMeta('property', 'og:url', meta.canonical);
    setMeta('property', 'og:image', siteConfig.ogImage);
    setMeta('property', 'og:site_name', siteConfig.name);
    setMeta('property', 'og:locale', siteConfig.locale);

    // Twitter
    setMeta('property', 'twitter:title', meta.ogTitle);
    setMeta('property', 'twitter:description', meta.ogDescription);
    setMeta('property', 'twitter:url', meta.canonical);
    setMeta('property', 'twitter:image', siteConfig.ogImage);
  }, [meta]);
}
