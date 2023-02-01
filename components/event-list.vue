<template>
  <div class="flex w-full flex-col items-center justify-center gap-4">
    <div class="flex w-full flex-col">
      <div class="event-list w-full">
        <div
          v-for="(event, index) of events"
          :key="event.headline"
          class="hover-styled border-b-2 bg-gray-100"
          :class="{ ['rounded-t-lg']: index === 0, ['rounded-b-lg']: index === events.length - 1 }"
        >
          <EventListRow :event-id="event.id" :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';

type EndpointEvents = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;

defineProps({
  events: {
    type: Object as PropType<EndpointEvents['events']>,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    default: 7,
  },
});
</script>
