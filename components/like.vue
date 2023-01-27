<template>
  <div class="flex flex-row items-center justify-center gap-1">
    <Icon name="mdi:cards-heart-outline" class="h-5 w-5" /> <span>{{ likeCount }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
});
</script>
