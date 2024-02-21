<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div class="flex w-full flex-col gap-2 rounded-lg bg-gray-100 sm:w-4/5">
      <EventView v-if="event" :event="eventObj" />
      <div class="w-full">
        <CommentAdd v-if="eventId" :event-id="eventId" @comment-added="commentAdded"></CommentAdd>
      </div>
      <div class="w-full">
        <CommentList v-if="eventId && comments" :event-id="eventId" :comments="comments"></CommentList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    if (Array.isArray(route.params.eventId)) {
      return false;
    }
    if (!/^\d+$/.test(route.params.eventId)) {
      return false;
    }
    return !isNaN(parseInt(route.params.eventId, 10));
  },
});
const interact = () => keskusFetch(`/api/events/${eventId.value}/interact`, { method: 'post', body: {} });
const eventId = computed(() => parseInt(useRoute().params.eventId as string));

const { data: event, error: eventError } = await useKeskusFetch(`/api/events/${eventId.value}`);
const { data: comments, refresh: refreshComments } = await useKeskusFetch(`/api/events/${eventId.value}/comments`);
interact();

const eventObj = computed<any>(() => {
  if (event.value) {
    return event.value;
  }
  return null;
});

useErrorHandling(eventError.value);

async function commentAdded() {
  await Promise.all([refreshComments(), interact()]);
}
</script>
