import { CookieOptions } from 'nuxt/dist/app/composables';

export const useAuthCookie = (options?: CookieOptions) => useCookie('keskusToken', options);
