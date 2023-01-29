// eslint-disable-next-line import/named
import DOMPurify, { Config } from 'isomorphic-dompurify';
import moment from 'moment';

export function dateFromNow(date?: string | Date) {
  return date ? moment(date).fromNow() : 'never';
}

export function timeRegular(date: Date) {
  return moment(date).format('HH:mm:ss');
}

export function dateFormatted(date: Date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(decodeBase64(base64));
  return JSON.parse(jsonPayload);
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

export function purifyHtml(html: string, config?: Config) {
  const ret = DOMPurify.sanitize(html, { ...config }).toString();
  return ret;
}
