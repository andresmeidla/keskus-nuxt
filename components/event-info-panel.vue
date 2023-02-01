<template>
  <div v-if="eventDetails" class="flex h-full flex-col items-start justify-center gap-2 pl-10">
    <div class="flex flex-row items-center justify-center">
      <EventLike :event-id="eventDetails.id" :event-likes="eventDetails.eventLikes" @updated="emit('updated')" />
    </div>
    <div class="flex flex-row">
      <div class="indicator">
        <span v-if="newCommentCountIndicatorValue > 0" class="indicator-item indicator-start badge badge-neutral px-1 text-xs">
          +{{ newCommentCountIndicatorValue }}
        </span>
        <div class="flex flex-row items-center justify-center gap-1">
          <Tooltip :disabled="commentUsers.length === 0">
            <span class="flex items-center gap-1">
              <Icon name="mdi:comment-text-multiple-outline" class="h-5 w-5" />
              <span>{{ eventDetails._count.comments }}</span>
            </span>
            <template #tooltip>{{ commentUsers }}</template>
          </Tooltip>
          <div class="indicator">
            <div v-if="lastCommentUsers" class="avatar-group -space-x-1.5">
              <Avatar
                v-for="user in lastCommentUsers.slice(0, lastCommentUsers.length === 4 ? 4 : 3)"
                :key="user.id"
                :user="user"
                size="sm"
                :tooltip="userDisplayName(user)"
                :show-name="false"
                class="border-2 border-white"
              />
              <Tooltip v-if="shouldRenderAdditionalUsersIndicator">
                <span
                  class="indicator-item text-neutral-content flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0E7490] text-xs"
                >
                  +{{ additionalUserCount }}
                </span>
                <template #tooltip>
                  <span>
                    {{ additionalUserNames }}
                  </span>
                </template>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { store } from '~~/store';

export type EventEndpointReturnType = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/`>>>>;

const props = defineProps({
  eventDetails: {
    type: Object as PropType<EventEndpointReturnType['event']>,
    required: true,
  },
  lastCommentUsers: {
    type: Object as PropType<EventEndpointReturnType['lastCommentUsers']>,
    required: true,
  },
  newCommentCount: {
    type: Number as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(['updated']);

const userInteraction = computed(() => {
  return props.eventDetails.eventInteractions.find((interaction) => interaction.userId === store.userId);
});

const shouldRenderAdditionalUsersIndicator = computed(() => (props.lastCommentUsers?.length || 0) > 4);
const additionalUserCount = computed(() => (props.lastCommentUsers?.length || 0) - 3);
const additionalUserNames = computed(() => {
  if (!props.lastCommentUsers) {
    return '';
  }
  return props.lastCommentUsers
    .slice(3)
    .map((u) => userDisplayName(u))
    .join(', ');
});

// if 0 then we wont render the new comment indicator
const newCommentCountIndicatorValue = computed(() => {
  // Check if comments exist.
  if (props.eventDetails._count.comments === 0) {
    return 0;
  }
  // Check if user has interacted with event.
  if (!userInteraction.value) {
    return props.eventDetails._count.comments;
  }
  // Check if there are any comments that are newer than user interaction.
  if (props.newCommentCount === null) {
    return 0;
  }
  return props.newCommentCount;
});

const commentUsers = computed(() => props.lastCommentUsers?.map((u) => userDisplayName(u)).join(', ') || '');
</script>

<style scoped></style>
