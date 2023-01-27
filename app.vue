<template>
  <div id="keskus">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'keskus',
  htmlAttrs: { lang: 'en' },
});
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
