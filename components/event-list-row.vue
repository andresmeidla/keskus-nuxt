<template>
  <div class="grid h-[5.1rem] w-full cursor-pointer grid-cols-12 gap-2 py-1" :class="{ 'bg-white': isNewEvent }" @click="eventLink?.click()">
    <div class="col-span-4 flex items-center justify-center sm:col-span-2">
      <Avatar :user="event.user" :date="new Date(event.createdAt)"></Avatar>
    </div>
    <div class="col-span-7 flex flex-col justify-center xl:col-span-8">
      <div class="flex flex-row items-center text-lg">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap" :class="{ ['font-semibold']: isNewEvent }">
          {{ event.headline }}
        </span>
      </div>
      <span v-if="event.location" class="flex flex-row gap-1 text-sm font-light hover:saturate-50"
        ><GmapLink :address="event.location" size="sm"></GmapLink>{{ event.location }}</span
      >
    </div>
    <div class="col-span-3 hidden overflow-clip lg:block xl:col-span-2">
      <EventInfoPanel :event="event" />
    </div>
    <NuxtLink class="hidden" :to="`/events/${event.id}`"><span ref="eventLink">a</span></NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { store } from '~~/store';

type EventsEndpointRetType = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;

const props = defineProps({
  event: {
    type: Object as PropType<EventsEndpointRetType['events'][number]>,
    required: true,
  },
});

const eventLink = ref<HTMLSpanElement | null>(null);

const userInteraction = computed(() => props.event.eventInteractions.find((interaction) => interaction.userId === store.userId));
const isNewEvent = computed(() => !userInteraction.value);
</script>
