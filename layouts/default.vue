<template>
  <div class="main bg-secondary flex min-h-screen w-full flex-col items-center justify-start">
    <Menu />
    <NewEventModal />
    <div class="container h-full">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
const { init } = useAuth();
await init();
</script>

<style scoped></style>
