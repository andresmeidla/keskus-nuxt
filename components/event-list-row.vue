<template>
  <div class="grid h-[5.1rem] w-full cursor-pointer grid-cols-12 gap-2" @click="eventLink?.click()">
    <div v-if="event.user" class="col-span-4 flex items-center justify-center sm:col-span-2">
      <Avatar :user="event.user" :date="new Date(event.createdAt)"></Avatar>
    </div>
    <div class="col-span-7 flex flex-col justify-center xl:col-span-8">
      <div class="flex flex-row items-center text-lg">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap" :class="{ ['font-semibold']: !(userInteraction ?? userInteraction !== null) }">
          {{ event.headline }}
        </span>
      </div>
      <span v-if="event.location" class="flex flex-row gap-1 text-sm font-light hover:saturate-50"
        ><GmapLink :address="event.location" size="sm"></GmapLink>{{ event.location }}</span
      >
    </div>
    <div v-if="eventDetails && lastCommentUsers" class="col-span-3 hidden overflow-clip lg:block xl:col-span-2">
      <EventInfoPanel :event-details="eventDetails" :last-comment-users="lastCommentUsers" @updated="getEvent" />
    </div>
    <NuxtLink class="hidden" :to="`/events/${eventId}`"><span ref="eventLink">a</span></NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type EndpointEvent = Awaited<ReturnType<typeof keskusFetch<'/api/events/:stringId'>>>;
type EndpointEvents = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  event: {
    type: Object as PropType<EndpointEvents['events'][number]>,
    required: true,
  },
});

const eventDetails = ref<EndpointEvent['event'] | undefined>();
const userInteraction = ref<EndpointEvent['userInteraction'] | undefined>();
const lastCommentUsers = ref<EndpointEvent['lastCommentUsers'] | undefined>();

const eventLink = ref<HTMLSpanElement | null>(null);

async function getEvent() {
  try {
    const rsp = await keskusFetch(`/api/events/${props.eventId}`, { query: { lastCommentUsers: true } });
    eventDetails.value = rsp.event;
    userInteraction.value = rsp.userInteraction;
    lastCommentUsers.value = rsp.lastCommentUsers;
  } catch (err: any) {
    useToastError(err);
  }
}

getEvent();
</script>
