import jwt from 'jsonwebtoken';

const NO_AUTH_ROUTE_REGEXES = [
  // allow /login with query parameters
  /\/login.*/g,
  /\/api\/login.*/g,
  /\/_ipx\/.*/g,
  /\/__nuxt_error\?.*/g,
];

export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', useRuntimeConfig().webAddress);
  const pathname = parsedUrl.pathname;
  const allowedRoute = NO_AUTH_ROUTE_REGEXES.find((r) => new RegExp(r).test(pathname));
  if (allowedRoute) {
    // no auth needed
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
      deleteCookie(event, 'keskusToken');
    }
  }
  // send 401 for api requests
  if (pathname.startsWith('/api')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  // redirecting
  return sendRedirect(event, `/login?${new URLSearchParams({ initial: pathname })}`, 307);
});
