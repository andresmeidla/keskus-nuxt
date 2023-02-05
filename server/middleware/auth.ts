import jwt from 'jsonwebtoken';

const NO_AUTH_ROUTE_REGEXES = [
  // allow /login with query parameters
  /\/login.*/g,
  '/api/login',
  'api/login',
  /\/_ipx\/.*/g,
  /\/__nuxt_error\?.*/g,
];

export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', useRuntimeConfig().webAddress);
  const pathname = parsedUrl.pathname;
  if (pathname.startsWith('/login')) {
    return;
  }
  if (pathname.startsWith('login')) {
    return;
  }
  if (event.node.req.url?.startsWith('/login')) {
    return;
  }
  if (event.node.req.url?.startsWith('login')) {
    return;
  }
  /* if (!pathname.startsWith('/api')) {
    return;
  } */
  const allowedRoute = NO_AUTH_ROUTE_REGEXES.find((r) => {
    if (r instanceof RegExp) {
      return new RegExp(r).test(pathname);
    } else if (r === pathname) {
      return true;
    }
    return false;
  });
  if (allowedRoute) {
    return;
  }
  const authCookie = getCookie(event, 'keskusToken');
  if (authCookie) {
    try {
      const decoded = jwt.verify(authCookie, useRuntimeConfig().jwtSecret);
      if (decoded) {
        event.context.auth = decoded;
        return;
      }
    } catch (e) {
      console.warn('While verifying token:', e);
    }
  }
  if (pathname.startsWith('/api')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  deleteCookie(event, 'keskusToken');
  // redirecting
  return sendRedirect(event, `/login?${new URLSearchParams({ initial: pathname, fullUrl: event.node.req.url || 'none' })}`);
});
