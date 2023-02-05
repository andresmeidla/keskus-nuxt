<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div class="flex w-full flex-col gap-2 rounded-lg bg-gray-100 sm:w-4/5">
      <EventView v-if="event" :event="event" />
      <div class="divider my-0 mx-8"></div>
      <div class="w-full">
        <CommentAdd v-if="eventId" :event-id="eventId" @comment-added="commentAdded"></CommentAdd>
      </div>
      <div class="w-full">
        <CommentList v-if="eventId" :event-id="eventId" :comments="comments"></CommentList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from '~~/lib/routes';

type EndpointEvent = Awaited<ReturnType<typeof keskusFetch<'/api/events/:stringId'>>>;
type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

const eventId = computed(() => {
  const str = useRoute().params.eventId;
  const parsed = Number.parseInt(str.toString());
  return isNaN(parsed) ? undefined : parsed;
});

const event = ref<EndpointEvent>();

async function getEvent(options?: { redirectOnError?: boolean }) {
  const rsp = await useKeskusFetch<EndpointEvent>(`/api/events/${eventId.value}`, { method: 'get', ...options });
  if (rsp.data.value) {
    event.value = rsp.data.value;
  }
  if (rsp.error.value) {
    throw rsp.error.value;
  }
}

const comments = ref<EndpointComment[]>([]);
async function fetchComments(options?: { redirectOnError?: boolean }) {
  const rsp = await useKeskusFetch<EndpointComment[]>(`/api/events/${eventId.value}/comments`, { ...options });
  if (rsp.data.value) {
    comments.value = rsp.data.value;
  }
  if (rsp.error.value) {
    throw rsp.error.value;
  }
}

async function saveInteraction(options?: { redirectOnError?: boolean }) {
  await keskusFetch(`/api/events/${eventId.value}/interact`, { method: 'POST', body: {}, ...options });
}

try {
  await Promise.all([
    getEvent({ redirectOnError: false }), //
    fetchComments({ redirectOnError: false }),
    saveInteraction({ redirectOnError: false }),
  ]);
} catch (err: any) {
  console.error(err);
  // useToastError(err);
  useRouter().push(Routes.MAIN);
}

async function commentAdded() {
  await Promise.all([fetchComments(), saveInteraction()]);
}
</script>
