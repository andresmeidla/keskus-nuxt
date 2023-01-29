<template>
  <div id="keskus">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { store } from './store';

useHead({
  title: 'keskus',
  htmlAttrs: { lang: 'en' },
});

const userId = getUser();
if (userId) {
  store.setUserId(userId);

  try {
    store.setUser(await keskusFetch(`/api/users/${userId}`));
  } catch (err: any) {
    useToastError(err);
  }
}
</script>
<style scoped>
#keskus {
  @apply flex w-full flex-col items-start justify-start;
}
.layout-enter-active {
  transition: all 0.2s;
}
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: blur(2px);
}
</style>
