<template>
  <form class="flex flex-col gap-4">
    <input id="username" v-model="username" type="text" placeholder="Kasutajanimi" class="input input-bordered input-primary w-full max-w-xs" />
    <input id="password" v-model="password" type="password" placeholder="Parool" class="input input-bordered input-primary w-full max-w-xs" />
    <button class="btn btn-primary" @click.prevent="() => auth.login(username, password)">Sisene</button>
  </form>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

const auth = useAuth();
const username = ref('');
const password = ref('');
</script>
