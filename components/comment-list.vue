<template>
  <div class="flex w-full flex-col items-center">
    <template v-if="comments">
      <CommentBox
        v-for="(comment, index) of comments"
        :key="comment.id"
        :comment="comment"
        class="py-2"
        :class="{
          ['py-2']: index % 2 === 0,
          ['rounded-b-lg']: index === comments.length - 1,
          ['bg-gray-100']: index % 2 === 0,
          ['bg-gray-200']: index % 2 === 1,
        }"
        @updated="refreshComments"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});
const { data: comments, refresh: refreshComments } = await useKeskusFetch(`/api/events/${props.eventId}/comments`);
</script>
<style scoped></style>
