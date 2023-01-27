import jwt from 'jsonwebtoken';

const cfg = useRuntimeConfig();

const NO_AUTH_ROUTES = [
  '/login',
  '/api/login',
  // /\/api\/scrapers\/[a-zA-Z0-9_-]+\/events\/[a-zA-Z0-9_\-=]+/g, // event api route
  /\/_ipx\/.*/g,
  // '/api/scrapers'
];

export default defineEventHandler((event) => {
  const allowedRoute = NO_AUTH_ROUTES.find((r) => {
    if (r instanceof RegExp) {
      return new RegExp(r).test(event.node.req.url ?? '');
    } else if (r === event.node.req.url ?? '') {
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
  // redirecting
  return sendRedirect(event, '/login');
});
