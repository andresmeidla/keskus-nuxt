<template>
  <div v-if="event" class="flex h-full flex-col items-start justify-center gap-2 pl-10">
    <!-- <div class="flex flex-row items-center justify-center">
      <EventLike :event-id="event.id" :event-likes="event.eventLikes" />
    </div> -->
    <div class="flex flex-row">
      <div class="indicator">
        <span v-if="newCommentCount > 0" class="indicator-item indicator-start badge badge-neutral px-1 text-xs"> +{{ newCommentCount }} </span>
        <div class="flex flex-row items-center justify-center gap-1">
          <Tooltip :disabled="commentUsers.length === 0">
            <span class="flex items-center gap-1">
              <Icon name="mdi:comment-text-multiple-outline" class="h-5 w-5" />
              <span>{{ event._count.comments }}</span>
            </span>
            <template #tooltip>{{ commentUserNames }}</template>
          </Tooltip>
          <div class="avatar-group -space-x-1.5">
            <Avatar
              v-for="user in commentUsers.slice(0, commentUsers.length === 4 ? 4 : 3)"
              :key="user.id"
              :user="user"
              size="sm"
              :tooltip="userDisplayName(user)"
              :show-name="false"
              class="border-2 border-white"
            />
            <div v-if="shouldRenderAdditionalUsersIndicator" class="avatar placeholder h-[29px] w-[29px] border-2 border-white">
              <Tooltip>
                <div class="bg-neutral-focus text-neutral-content flex h-full w-full items-center justify-center bg-[#0E7490]">
                  <span>+{{ additionalUserCount }}</span>
                </div>
                <template #tooltip>
                  <span>
                    {{ additionalUserNames }}
                  </span>
                </template>
              </Tooltip>
            </div>
            <!-- <Tooltip v-if="shouldRenderAdditionalUsersIndicator">
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
            </Tooltip> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { store } from '~~/store';

type EventsEndpointRetType = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;
type EventRetType = EventsEndpointRetType['events'][number];
type CommentRetType = EventRetType['comments'][number];
type UserRetType = CommentRetType['user'];

const props = defineProps({
  event: {
    type: Object as PropType<EventRetType>,
    required: true,
  },
});

const userInteraction = computed(() => {
  return props.event.eventInteractions.find((interaction) => interaction.userId === store.userId);
});

const shouldRenderAdditionalUsersIndicator = computed(() => commentUsers.value.length > 4);
const additionalUserCount = computed(() => commentUsers.value.length - 3);
const additionalUserNames = computed(() => {
  return commentUsers.value
    .slice(3)
    .map((u) => userDisplayName(u))
    .join(', ');
});

const newCommentCount = computed(() => {
  if (props.event.comments.length === 0) {
    return 0;
  }
  const userInteractionComment = userInteraction.value?.comment;
  if (!userInteraction.value || !userInteractionComment) {
    return props.event.comments.length;
  }
  const unseenComments = props.event.comments.filter((comment) => comment.createdAt > userInteractionComment.createdAt);
  return unseenComments.length;
});

const commentUsers = computed(() =>
  Object.values(
    props.event.comments.reduce((acc, cur) => {
      acc[cur.userId] = cur.user;
      return acc;
    }, {} as Record<number, UserRetType>)
  )
);

const commentUserNames = computed(() => commentUsers.value.map((u) => userDisplayName(u)).join(', ') || '');
</script>

<style scoped></style>
