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
  console.log('REQ: ', event.node.req.url, event.node.req.headers);
  const parsedUrl = new URL(event.node.req.url ?? '/', useRuntimeConfig().webAddress);
  const pathname = parsedUrl.pathname;
  if (pathname.startsWith('/login')) {
    console.log('allow /login');
    return;
  }
  if (pathname.startsWith('login')) {
    console.log('allow login');
    return;
  }
  if (event.node.req.url?.startsWith('/login')) {
    console.log('allow url /login');
    return;
  }
  if (event.node.req.url?.startsWith('login')) {
    console.log('allow url login');
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
    console.log('allow route', allowedRoute, 'for', pathname);
    return;
  }
  const authCookie = getCookie(event, 'keskusToken');
  if (authCookie) {
    try {
      const decoded = jwt.verify(authCookie, useRuntimeConfig().jwtSecret);
      if (decoded) {
        event.context.auth = decoded;
        console.log('AUTHED', decoded);
        return;
      }
    } catch (e) {
      console.warn('While verifying token:', e);
    }
  }
  if (pathname.startsWith('/api')) {
    console.log('throwing 401 error');
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  deleteCookie(event, 'keskusToken');
  // redirecting
  console.log('redirecting to login', pathname, event.node.req.url || 'none');
  return sendRedirect(event, `/login?${new URLSearchParams({ initial: pathname, fullUrl: event.node.req.url || 'none' })}`);
});
