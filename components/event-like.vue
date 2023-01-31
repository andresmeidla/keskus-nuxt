<template>
  <div class="flex w-full cursor-pointer flex-row items-center justify-center gap-1">
    <Tooltip :disabled="eventLikes.length === 0">
      <span class="flex items-center gap-1" @click.prevent="like">
        <Icon
          :name="userLike ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
          :class="{
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
        <span>{{ eventLikes.length }}</span>
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
  eventLikes: {
    type: Object as PropType<EventType['eventLikes']>,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
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
