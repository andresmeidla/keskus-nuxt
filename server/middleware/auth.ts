import jwt from 'jsonwebtoken';

const cfg = useRuntimeConfig();

const NO_AUTH_ROUTE_REGEXES = [
  // allow /login with query parameters
  /\/login.*/g,
  '/api/login',
  /\/_ipx\/.*/g,
  /\/__nuxt_error\?.*/g,
];

export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', useRuntimeConfig().webAddress);
  const pathname = parsedUrl.pathname;

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
      const decoded = jwt.verify(authCookie, cfg.jwtSecret);
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
  // redirecting
  return sendRedirect(event, `/login?${new URLSearchParams({ initial: pathname, fromServer: 'true' })}`);
});
