<template>
  <div class="flex w-full flex-col items-center">
    <CommentBox
      v-for="(comment, index) of comments"
      :key="comment.id"
      :comment="comment"
      class="py-2"
      :class="{
        ['py-2']: index % 2 === 0,
        ['rounded-b-lg']: index === comments.length - 1,
        ['bg-white']: index % 2 === 0,
        ['bg-gray-100']: index % 2 === 1,
      }"
      @updated="emit('updated')"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  comments: {
    type: Object as PropType<EndpointComment[]>,
    required: true,
  },
});
const emit = defineEmits(['updated']);
</script>
<style scoped></style>
