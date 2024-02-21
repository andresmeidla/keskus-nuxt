import DOMPurify, { type Config } from 'isomorphic-dompurify';
import { format, formatDistanceToNow, setDefaultOptions } from 'date-fns';

import { et } from 'date-fns/locale';

setDefaultOptions({ locale: et });

DOMPurify.addHook('uponSanitizeElement', (node: any, data) => {
  if (data.tagName === 'iframe') {
    const src = node.getAttribute('src') || '';
    if (!src.startsWith('https://www.youtube.com/embed/')) {
      return node.parentNode.removeChild(node);
    }
  }
});

export function dateFromNow(date?: string | Date) {
  return date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : 'never';
}

export function timeRegular(date: Date) {
  return format(new Date(date), 'HH:mm:ss');
}

export function dateFormatted(date: Date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

export function parseJwt<T = unknown>(token: string) {
  const splitStrings = (token || '').split('.');
  const base64Url = (splitStrings.length > 0 ? splitStrings[1] : '') ?? '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(decodeBase64(base64));
  return JSON.parse(jsonPayload) as T;
}

export function encodeBase64(value: string): string {
  if (process.client) {
    return window.btoa(unescape(encodeURIComponent(value)));
  } else {
    return Buffer.from(value, 'ascii').toString('base64');
  }
}

export function decodeBase64(value: string): string {
  if (process.client) {
    return decodeURIComponent(escape(window.atob(value)));
  } else {
    return Buffer.from(value, 'base64').toString('ascii');
  }
}

export function purgeHtml(html: string, config?: Config) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ...config }).toString();
}

export function purifyHtml(html: string, config?: Config) {
  const ret = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'], // or ALLOWED_TAGS
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // or //or ALLOWED_ATR
    ...config,
  }).toString();
  return ret;
}
