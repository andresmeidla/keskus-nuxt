import { CookieRef } from 'nuxt/dist/app/composables';
import { reactive } from 'vue';

import { UserInfo } from './server/lib/entity-types';

export const store = reactive({
  userId: undefined as number | undefined,
  user: null as UserInfo | null,
  loading: {
    value: false,
  } as {
    value: boolean;
  },

  setUserId(userId: number | undefined) {
    this.userId = userId;
  },
  setUser(user: UserInfo | null) {
    this.user = user;
  },
  async initAuth(cookie: CookieRef<any> | undefined = useAuthCookie(), user?: UserInfo | null) {
    try {
      if (!this.userId) {
        this.userId = getUser(cookie);
      }
      if (this.userId) {
        store.setUserId(this.userId);
        if (!user) {
          const rsp = await useKeskusFetch(`/api/users/${this.userId}`);
          if (rsp.data.value) {
            store.setUser(rsp.data.value);
            return;
          }
          if (rsp.error.value) {
            throw rsp.error.value;
          }
        } else {
          store.setUser(user);
          return;
        }
      }
    } catch (err: any) {
      console.log(err);
      useToastError(err);
    }
    if (useRoute().path.startsWith('/login')) {
      console.log('on login page, skipping redirect');
      return;
    }
    console.log('Failed to log in, redirecting to login page');
    useRouter().push({ path: '/login', query: { initial: useRoute().path, from: 'initAuth' } });
  },
  setLoading(loading: boolean) {
    this.loading.value = loading;
  },
});
