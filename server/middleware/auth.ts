import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', useRuntimeConfig().webAddress || 'http://localhost');
  const pathname = parsedUrl.pathname;
  const authCookie = getCookie(event, 'keskusToken');
  if (authCookie) {
    try {
      const decoded = jwt.verify(authCookie, useRuntimeConfig().jwtSecret || '#1241250+u9123i3fghu9');
      if (decoded) {
        console.log('Auth Success', pathname);
        event.context.auth = decoded;
        return;
      }
    } catch (e) {
      console.warn('While verifying token:', e);
      deleteCookie(event, 'keskusToken');
    }
    return;
  }
  if (pathname.startsWith('/login')) {
    console.log('allow', pathname);
    return;
  }
  console.log('Redirect to login', event.node.req.url);
  // redirecting
  return sendRedirect(event, '/login', 307);
});
