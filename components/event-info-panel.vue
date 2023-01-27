<template>
  <div v-if="eventDetails" class="flex h-full flex-col items-start justify-center gap-2 pl-10">
    <div class="flex flex-row items-center justify-center">
      <Like :event-id="eventDetails.id" :like-count="eventDetails.eventLikes.length" />
    </div>
    <div class="flex flex-row">
      <div class="flex flex-row items-center justify-center gap-1">
        <div>
          <Icon name="mdi:comment-text-multiple-outline" class="h-5 w-5" /> <span>{{ eventDetails._count.comments }}</span>
        </div>
        <div v-if="lastCommentUsers" class="avatar-group -space-x-1.5">
          <Avatar
            v-for="user in lastCommentUsers.slice(0, lastCommentUsers.length === 4 ? 4 : 3)"
            :key="user.id"
            :email="user.email || ''"
            :size="5"
            :tooltip="userDisplayName(user)"
            :firstname="user.firstname"
            :lastname="user.lastname"
            class="border-2 border-white"
          />
          <div v-if="lastCommentUsers.length > 4" class="avatar placeholder h-5 border-2 border-white">
            <div class="text-neutral-content w-5 bg-gray-700 text-white">
              <span class="text-xs">+{{ lastCommentUsers.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

export type EventEndpointReturnType = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/`>>>>;

defineProps({
  eventDetails: {
    type: Object as PropType<EventEndpointReturnType['event']>,
    required: true,
  },
  lastCommentUsers: {
    type: Object as PropType<EventEndpointReturnType['lastCommentUsers']>,
    required: true,
  },
});
</script>

<style scoped></style>
