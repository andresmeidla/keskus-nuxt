import jwt from 'jsonwebtoken';

const NO_AUTH_ROUTE_REGEXES = [
  // allow /login with query parameters
  /\/login.*/g,
  /\/api\/login.*/g,
  /\/_ipx\/.*/g,
  /\/__nuxt_error\?.*/g,
];

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
  }
  const allowedRoute = NO_AUTH_ROUTE_REGEXES.find((r) => new RegExp(r).test(pathname));
  if (allowedRoute) {
    console.log('Allow', pathname);
    // no auth needed
    return;
  }
  if (pathname.startsWith('/api')) {
    console.log('API Unauthorized', pathname);
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  console.log('Redirect to login', event.node.req.url);
  // redirecting
  return sendRedirect(event, `/login?${new URLSearchParams({ initial: pathname, fullUrl: event.node.req.url || 'none' })}`, 307);
});
