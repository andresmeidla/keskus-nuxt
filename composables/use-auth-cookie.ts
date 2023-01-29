import { CookieOptions } from 'nuxt/dist/app/composables';

export const KESKUS_TOKEN = 'keskusToken';

export const useAuthCookie = (options?: CookieOptions) => useCookie(KESKUS_TOKEN, options);
