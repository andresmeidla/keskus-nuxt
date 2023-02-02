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
    if (!this.userId) {
      this.userId = getUser(cookie);
    }
    if (this.userId) {
      store.setUserId(this.userId);
      if (!user) {
        try {
          const rsp = await useKeskusFetch(`/api/users/${this.userId}`);
          if (rsp.data.value) {
            store.setUser(rsp.data.value);
          }
          if (rsp.error.value) {
            throw rsp.error.value;
          }
        } catch (err: any) {
          useToastError(err);
        }
      } else {
        store.setUser(user);
      }
    }
  },
  setLoading(loading: boolean) {
    this.loading.value = loading;
  },
});
