<template>
  <div v-if="eventDetails?.user" class="col-span-4 sm:col-span-2">
    <Avatar
      :firstname="eventDetails.user.firstname"
      :lastname="eventDetails.user.lastname"
      :name="userDisplayName(eventDetails.user)"
      :email="eventDetails.user.email ?? ''"
      :date="new Date(eventDetails.createdAt)"
    ></Avatar>
  </div>
  <div v-if="eventDetails" class="col-span-8 flex flex-col justify-center">
    <div class="flex flex-row items-center text-lg">
      <span class="overflow-hidden text-ellipsis whitespace-nowrap" :class="{ ['font-semibold']: !userInteraction }">
        {{ eventDetails.headline }}
      </span>
    </div>
    <span v-if="eventDetails.location" class="">@ {{ eventDetails.location }}</span>
  </div>
  <div v-if="eventDetails && lastCommentUsers" class="col-span-2 hidden sm:block">
    <EventInfoPanel :event-details="eventDetails" :last-comment-users="lastCommentUsers" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});

type EventEndpointType = Awaited<ReturnType<typeof keskusFetch<'/api/events/:stringId'>>>;

const eventDetails = ref<EventEndpointType['event'] | undefined>();
const userInteraction = ref<EventEndpointType['userInteraction'] | undefined>();
const lastCommentUsers = ref<EventEndpointType['lastCommentUsers'] | undefined>();

try {
  const rsp = await keskusFetch(`/api/events/${props.eventId}`, { query: { lastCommentUsers: true } });
  eventDetails.value = rsp.event;
  userInteraction.value = rsp.userInteraction;
  lastCommentUsers.value = rsp.lastCommentUsers;
} catch (err: any) {
  useToastError(err);
}
</script>
