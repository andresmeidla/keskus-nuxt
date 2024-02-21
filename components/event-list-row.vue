<template>
  <div class="flex h-[5.1rem] w-full cursor-pointer flex-row gap-2 py-1" @click="eventLink?.click()">
    <div class="flex w-40 items-center justify-center">
      <Avatar :user="event.user" :date="new Date(event.createdAt)"></Avatar>
    </div>
    <div class="flex flex-1 flex-col justify-center truncate">
      <div class="flex w-full flex-row items-center text-lg">
        <div class="w-full truncate" :class="{ ['font-semibold']: isNewEvent }">
          {{ event.headline }}
        </div>
      </div>
      <span v-if="event.location" class="flex flex-row gap-1 text-sm font-light hover:saturate-50">
        <GmapLink :address="event.location" size="sm"></GmapLink><span class="truncate">{{ event.location }}</span>
      </span>
    </div>
    <div class="hidden w-52 lg:block">
      <EventInfoPanel :event="event" />
    </div>
    <NuxtLink class="hidden" :to="`/events/${event.id}`"><span ref="eventLink">a</span></NuxtLink>
  </div>
</template>

<script setup lang="ts">
type EventsEndpointRetType = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;

const props = defineProps({
  event: {
    type: Object as PropType<EventsEndpointRetType['events'][number]>,
    required: true,
  },
});
const { userId } = useAuth();

const eventLink = ref<HTMLSpanElement | null>(null);

const userInteraction = computed(() => props.event.eventInteractions.find((interaction) => interaction.userId === userId.value));
const isNewEvent = computed(() => !userInteraction.value);
</script>
