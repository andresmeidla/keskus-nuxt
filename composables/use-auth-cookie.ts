import { parseJwt } from '~/lib/utils';

export const KESKUS_TOKEN = 'keskusToken';

export const useAuthCookie = () => {
  const c = useCookie<{ id: number; iat: number; exp: number } | undefined>(KESKUS_TOKEN, {
    decode: (str) => (str ? parseJwt(str) : undefined),
  });
  return c;
};
