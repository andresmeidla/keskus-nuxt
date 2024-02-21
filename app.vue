<template>
  <div id="keskus">
    <NuxtLayout>
      <LoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
useHead({
  title: 'keskus',
  htmlAttrs: { lang: 'et' },
});
onMounted(() => {
  const theme = 'mytheme';
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
});
</script>
<style scoped>
#keskus {
  @apply flex w-full flex-col items-start justify-start;
}
</style>
