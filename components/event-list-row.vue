<template>
  <div class="grid h-[4.5rem] w-full cursor-pointer grid-cols-12 gap-2">
    <div v-if="eventDetails?.user" class="col-span-4 flex items-center justify-center sm:col-span-2">
      <Avatar :user="eventDetails.user" :date="new Date(eventDetails.createdAt)"></Avatar>
    </div>
    <div v-if="eventDetails" class="col-span-7 flex flex-col justify-center xl:col-span-8">
      <div class="flex flex-row items-center text-lg">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap" :class="{ ['font-semibold']: !userInteraction }">
          {{ eventDetails.headline }}
        </span>
      </div>
      <span v-if="eventDetails.location" class="">@ {{ eventDetails.location }}</span>
    </div>
    <div v-if="eventDetails && lastCommentUsers" class="col-span-3 hidden overflow-clip lg:block xl:col-span-2">
      <EventInfoPanel :event-details="eventDetails" :last-comment-users="lastCommentUsers" @updated="getEvent" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);

type EventEndpointType = Awaited<ReturnType<typeof keskusFetch<'/api/events/:stringId'>>>;

const eventDetails = ref<EventEndpointType['event'] | undefined>();
const userInteraction = ref<EventEndpointType['userInteraction'] | undefined>();
const lastCommentUsers = ref<EventEndpointType['lastCommentUsers'] | undefined>();

async function getEvent() {
  try {
    const rsp = await keskusFetch(`/api/events/${props.eventId}`, { query: { lastCommentUsers: true } });
    eventDetails.value = rsp.event;
    userInteraction.value = rsp.userInteraction;
    lastCommentUsers.value = rsp.lastCommentUsers;
  } catch (err: any) {
    useToastError(err);
  } finally {
    loading.value = false;
  }
}
getEvent();
</script>
