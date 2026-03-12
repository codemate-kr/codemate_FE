import { useEffect } from 'react';
import { env } from '../config/env';

interface UsePageMetaOptions {
  title?: string;
  description: string;
  path: string;
}

function updateMeta(selector: string, value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute('content', value);
  }
}

export default function usePageMeta({ title, description, path }: UsePageMetaOptions) {
  useEffect(() => {
    const baseTitle = env.APP_TITLE;
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    const canonicalUrl = new URL(path, window.location.origin).toString();

    const previous = {
      title: document.title,
      metaTitle: document.querySelector('meta[name="title"]')?.getAttribute('content') ?? '',
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
      twitterUrl: document.querySelector('meta[name="twitter:url"]')?.getAttribute('content') ?? '',
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ?? '',
      twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ?? '',
    };

    document.title = fullTitle;
    updateMeta('meta[name="title"]', fullTitle);
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:url"]', canonicalUrl);
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:url"]', canonicalUrl);
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }

    return () => {
      document.title = previous.title;
      updateMeta('meta[name="title"]', previous.metaTitle);
      updateMeta('meta[name="description"]', previous.description);
      updateMeta('meta[property="og:url"]', previous.ogUrl);
      updateMeta('meta[property="og:title"]', previous.ogTitle);
      updateMeta('meta[property="og:description"]', previous.ogDescription);
      updateMeta('meta[name="twitter:url"]', previous.twitterUrl);
      updateMeta('meta[name="twitter:title"]', previous.twitterTitle);
      updateMeta('meta[name="twitter:description"]', previous.twitterDescription);

      const previousCanonical = document.querySelector('link[rel="canonical"]');
      if (previousCanonical) {
        previousCanonical.setAttribute('href', previous.canonical);
      }
    };
  }, [description, path, title]);
}
