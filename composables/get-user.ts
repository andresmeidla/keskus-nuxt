import { parseJwt } from '~~/lib/utils';

export const getUser = (cookie = useAuthCookie()) => {
  if (cookie.value) {
    const decoded = parseJwt(cookie.value);
    return decoded?.id as number;
  }
  return undefined;
};
