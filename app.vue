<template>
  <div id="keskus">
    <NuxtLayout>
      <LoadingIndicator />
      Hello KEskus
      <!-- <NuxtPage /> -->
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'keskus',
  htmlAttrs: { lang: 'et' },
});
</script>
<style scoped>
#keskus {
  @apply flex w-full flex-col items-start justify-start;
}
</style>
