<template>
  <div id="keskus">
    <NuxtLayout>
      <LoadingIndicator />
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
try {
  await store.initAuth();
} catch (err: any) {
  useToastError(err);
}
</script>
<style scoped>
#keskus {
  @apply flex w-full flex-col items-start justify-start;
}
</style>
