<template>
  <form class="flex flex-col gap-4">
    <input id="username" v-model="username" type="text" placeholder="Kasutajanimi" class="input input-bordered input-primary w-full max-w-xs" />
    <input id="password" v-model="password" type="password" placeholder="Parool" class="input input-bordered input-primary w-full max-w-xs" />
    <button class="btn btn-primary" @click.prevent="login">Sisse</button>
  </form>
</template>
<script setup lang="ts">
import { Routes } from '@/lib/routes';
import { store } from '~~/store';

definePageMeta({
  layout: 'login',
});

const username = ref('');
const password = ref('');

async function login() {
  try {
    const rsp = await keskusFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    // save token as cookie
    const date = new Date();
    const cookie = useAuthCookie({ expires: new Date(date.setMonth(date.getMonth() + 2)) });
    cookie.value = String(rsp.token);
    const user = await keskusFetch(`/api/users/${getUser(cookie)}`);
    await store.initAuth(cookie, user);
    const router = useRouter();
    // eslint-disable-next-line no-console
    console.info('Successfully logged in.');
    if (useRoute().query.redirect) {
      return router.push(String(useRoute().query.redirect));
    }
    router.push(Routes.MAIN);

    // useRouter().push('/');
  } catch (err: any) {
    useToastError(err);
  }
}
</script>
