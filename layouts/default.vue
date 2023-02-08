<template>
  <div class="main bg-secondary flex min-h-screen w-full flex-col items-center justify-start">
    <Menu />
    <NewEventModal v-if="store.user" />
    <div v-if="store.user" class="container h-full">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { store } from '~~/store';

try {
  // await store.initAuth();
} catch (err: any) {
  // useToastError(err);
}
</script>
<style scoped></style>
