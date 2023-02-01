<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div class="flex w-11/12 flex-col rounded-lg bg-gray-100 sm:w-4/5">
      <EventView v-if="eventDetails" :event="eventDetails" @updated="getEvent()" />
      <div class="divider my-2 mx-8"></div>
      <div class="w-full">
        <CommentList v-if="eventId" :event-id="eventId" :comments="comments" @updated="fetchComments"></CommentList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

import { Routes } from '~~/lib/routes';

type EndpointEvent = Awaited<ReturnType<typeof keskusFetch<'/api/events/:stringId'>>>;
type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

const eventDetails = ref<EndpointEvent['event'] | undefined>();
const userInteraction = ref<EndpointEvent['userInteraction'] | undefined>();

const eventId = computed(() => {
  const str = useRoute().params.eventId;
  const parsed = Number.parseInt(str.toString());
  return isNaN(parsed) ? undefined : parsed;
});

async function getEvent() {
  try {
    const rsp = await keskusFetch(`/api/events/${eventId.value}`);
    if (rsp.event) {
      eventDetails.value = rsp.event;
    }
    userInteraction.value = rsp.userInteraction;
  } catch (err: any) {
    if (err instanceof FetchError) {
      if (err.statusCode === 404) {
        return useRouter().push(Routes.MAIN);
      }
    }
    useToastError(err);
  }
}

const comments = ref<EndpointComment[]>([]);
async function fetchComments() {
  try {
    const rsp = await keskusFetch(`/api/events/${eventId.value}/comments`);
    comments.value = rsp;
  } catch (err: any) {
    useToastError(err);
  }
}

async function saveInteraction() {
  try {
    await keskusFetch(`/api/events/${eventId.value}/interact`, { method: 'POST', body: { interaction: userInteraction.value } });
  } catch (err: any) {
    // useToastError(err);
    console.warn('Interaction save failed', err.message);
  }
}

await Promise.all([getEvent(), fetchComments(), saveInteraction()]).catch((err) => {
  console.error('UNCAUGHT', err);
});
</script>
