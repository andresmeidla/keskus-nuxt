import { parseJwt } from '~~/lib/utils';

export const getUser = () => {
  const cookie = useAuthCookie();
  if (cookie.value) {
    const decoded = parseJwt(cookie.value);
    return decoded?.id;
  }
  return undefined;
};
