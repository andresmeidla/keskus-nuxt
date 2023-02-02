import jwt from 'jsonwebtoken';

const cfg = useRuntimeConfig();

const NO_AUTH_ROUTE_REGEXES = [
  // allow /login with query parameters
  /login\?.*/g,
  'api/login',
  /_ipx\/.*/g,
];

export default defineEventHandler((event) => {
  let url = event.node.req.url ?? '';
  if (url.length > 0 && url[0] === '/') {
    url = url.slice(1);
  }
  const allowedRoute = NO_AUTH_ROUTE_REGEXES.find((r) => {
    if (r instanceof RegExp) {
      return new RegExp(r).test(url ?? '');
    } else if (r === url ?? '') {
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
  console.warn(`Denying access to ${event.node.req.url}`);
  if (url?.startsWith('api/')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  // redirecting
  return sendRedirect(event, `/login?${new URLSearchParams({ redirect: event.node.req.url ?? '' })}`);
});
