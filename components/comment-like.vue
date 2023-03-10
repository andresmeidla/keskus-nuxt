<template>
  <div class="cursor-pointer">
    <Tooltip :disabled="localCommentLikes.length === 0">
      <span class="flex items-center gap-1" @click.prevent="like">
        <Icon
          :name="userLike ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
          :class="{
            ['hover:text-gray-500']: !userLike,
            ['text-red-600']: userLike,
            ['h-4']: size === 'sm',
            ['w-4']: size === 'sm',
            ['h-5']: size === 'md',
            ['w-5']: size === 'md',
            ['h-6']: size === 'lg',
            ['w-6']: size === 'lg',
            ['h-8']: size === 'xl',
            ['w-8']: size === 'xl',
          }"
        />
        <span>{{ localCommentLikes.length }}</span>
      </span>
      <template #tooltip>
        {{ likeUsers.join(', ') }}
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { store } from '~~/store';

type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];
type EndpointCommentLike = EndpointComment['commentLikes'][number];

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
  },
  commentLikes: {
    type: Object as PropType<EndpointCommentLike[]>,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
  },
});

const localCommentLikes = computed({
  get: () => props.commentLikes,
  set: () => {},
});

const userLike = computed(() => {
  return localCommentLikes.value.find((l) => l.userId === store.userId);
});

const likeUsers = computed(() => {
  return localCommentLikes.value.map((el) => userDisplayName(el.user));
});

async function like() {
  if (userLike.value) {
    const likeIndex = localCommentLikes.value.findIndex((l) => l.userId === store.userId);
    if (likeIndex !== -1) {
      localCommentLikes.value.splice(likeIndex, 1); // = localCommentLikes.value.filter((l) => l.userId !== store.userId);
    }
  } else {
    // add a custom like object to the array
    // or remove it if it already exists
    // so that the UI updates immediately, then make a request to the server
    localCommentLikes.value.push({
      id: 0,
      userId: store.userId,
      user: store.user,
      eventId: props.eventId,
      commentId: props.commentId,
      dislike: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as EndpointCommentLike);
  }
  await keskusFetch(`/api/events/${props.eventId}/comments/${props.commentId}/like`, { method: 'POST', body: {} });
  // localCommentLikes.value = await keskusFetch(`/api/events/${props.eventId}/comments/${props.commentId}/likes`);
}
</script>
