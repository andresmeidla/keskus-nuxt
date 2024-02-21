import moment from 'moment';
import type { UnwrapRef } from 'vue';
import { Routes } from '~/lib/routes';
import { parseJwt } from '~/lib/utils';
import type { UserInfo } from '~/server/lib/entity-types';

function setCookie(key: string, value: string, expiryDate: Date): void {
  const expires = expiryDate ? `; expires=${expiryDate.toUTCString()}` : '';
  document.cookie = `${key}=${value}${expires}; path=/`;
}

export function useAuth() {
  const router = useRouter();
  const user = useState<UserInfo | null>('user', () => null);
  const userId = useState<number | null>('userId', () => null);

  async function login(username: string, password: string) {
    try {
      const rsp = await keskusFetch('/api/login', {
        method: 'post',
        body: JSON.stringify({
          username,
          password,
        }),
      });
      // save token as cookie
      const date = moment();
      const route = useRoute();
      const router = useRouter();
      setCookie(KESKUS_TOKEN, rsp.token, date.add(3, 'months').toDate());
      const cookieUser = parseJwt<UnwrapRef<ReturnType<typeof useAuthCookie>>>(rsp.token);
      if (!cookieUser?.id) {
        throw createError({ statusCode: 401, statusMessage: 'Something went wrong with the login.' });
      }
      userId.value = cookieUser.id;

      userId.value = cookieUser.id;
      const userRsp = await keskusFetch(`/api/users/${cookieUser.id}`);
      user.value = userRsp;

      // eslint-disable-next-line no-console
      console.info('Successfully logged in.');
      const nextPath = route.query.to ? String(route.query.to) : Routes.MAIN;
      router.push(nextPath);
    } catch (err: any) {
      useToastError(err);
    }
  }

  function logout() {
    const authCookie = useCookie(KESKUS_TOKEN);
    const router = useRouter();

    authCookie.value = undefined;
    userId.value = null;
    user.value = null;
    router.push({ path: Routes.LOGIN });
  }

  function redirectToLogin() {
    router.push({ path: '/login', query: { to: router.currentRoute.value.path } });
  }

  async function init() {
    const authCookie = useAuthCookie();
    if (!authCookie.value?.id) {
      redirectToLogin();
      throw new Error(`No user id found in auth cookie (${process.server ? 'Server' : 'Client'})`);
    }
    try {
      const rsp = await keskusFetch(`/api/users/${authCookie.value.id}`);
      userId.value = authCookie.value.id;
      user.value = rsp;
      return rsp;
    } catch (err) {
      redirectToLogin();
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized 1: ' + (err as Error).message });
    }
  }

  const isAuthenticated = computed(() => !!userId.value);

  return { userId, user, login, logout, init, isAuthenticated, redirectToLogin };
}
