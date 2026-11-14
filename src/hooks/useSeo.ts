import { useEffect } from 'react';

interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(selector: string, attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo({ title, description, keywords, canonicalPath, schema }: SeoConfig) {
  useEffect(() => {
    document.title = title;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${canonicalPath ?? window.location.pathname}`;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords && keywords.length > 0) {
      upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    const existingDynamicSchema = document.getElementById('dynamic-jsonld');
    if (existingDynamicSchema) existingDynamicSchema.remove();

    if (schema) {
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, schema]);
}
