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
});
