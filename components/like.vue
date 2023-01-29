<template>
  <div class="flex flex-row items-center justify-center gap-1">
    <Tooltip :disabled="likeCount === 0">
      <span class="flex items-center gap-1" @click="like">
        <Icon :name="userLike ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'" class="h-5 w-5" :class="{ 'text-red-600': userLike }" />
        <span>{{ likeCount }}</span>
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

export type EventType = NonNullable<NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/`>>>>['event']>;

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
  eventLikes: {
    type: Object as PropType<EventType['eventLikes']>,
    required: true,
  },
});

const emit = defineEmits(['updated']);

const userLike = computed(() => {
  return props.eventLikes.find((l) => l.userId === store.userId);
});

const likeUsers = computed(() => {
  return props.eventLikes.map((el) => userDisplayName(el.user));
});

async function like() {
  await keskusFetch(`/api/events/${props.eventId}/like`, { method: 'POST', body: {} });
  emit('updated');
}
</script>
