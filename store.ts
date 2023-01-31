import { CookieRef } from 'nuxt/dist/app/composables';
import { reactive } from 'vue';

import { UserInfo } from './server/lib/entity-types';

export const store = reactive({
  userId: undefined as number | undefined,
  user: null as UserInfo | null,

  setUserId(userId: number | undefined) {
    this.userId = userId;
  },
  setUser(user: UserInfo | null) {
    this.user = user;
  },
  async initAuth(cookie: CookieRef<any> | undefined = useAuthCookie()) {
    if (!this.userId) {
      this.userId = getUser(cookie);
    }
    if (this.userId) {
      store.setUserId(this.userId);
      try {
        store.setUser(await keskusFetch(`/api/users/${this.userId}`));
      } catch (err: any) {
        useToastError(err);
      }
    }
  },
});
