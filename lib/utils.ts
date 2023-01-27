// eslint-disable-next-line import/named
import DOMPurify, { Config } from 'isomorphic-dompurify';
import moment from 'moment';

export function dateFromNow(date?: string | Date) {
  return date ? moment(date).fromNow() : 'never';
}

export function dateRegular(date: Date) {
  return moment(date).format('HH:mm:ss');
}

export function popupCenter({ url, title, w, h }: { url: string; title: string; w: number; h: number }) {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    'blank_',
    `
      menubar=yes,
      toolbar=yes,
      resizable=yes,
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left},
      `
  );
  if (newWindow) {
    newWindow.document.title = title;
    if (document.hasFocus()) newWindow.focus();
  }
}

export function purifyHtml(html: string, config?: Config) {
  const ret = DOMPurify.sanitize(html, { ...config }).toString();
  return ret;
}

export function parseStringList(value: string): string[] {
  return value ? value.split(/[\r\n,]+/).filter((i: string) => !!i) : [];
}

export function formatStringList(value: string | string[]) {
  if (value && Array.isArray(value)) {
    return value.join('\n');
  }
  return (
    value &&
    value
      .split(/[\r\n,]+/)
      .filter((i: string) => !!i)
      .join('\n')
  );
}
