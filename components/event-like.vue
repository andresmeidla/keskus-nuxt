<template>
  <div class="cursor-pointer" @click.stop="like">
    <Tooltip :disabled="localEventLikes.length === 0">
      <span class="flex items-center gap-1 duration-75 hover:transition-all">
        <Icon
          :name="userLike ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
          :class="{
            ['hover:text-gray-500']: !userLike,
            ['text-red-600']: userLike,
            ['h-4']: size === 'sm',
            ['w-4']: size === 'sm',
            ['h-5']: size === 'md',
            ['w-5']: size === 'md',
            ['h-6']: size === 'lg',
            ['w-6']: size === 'lg',
            ['h-8']: size === 'xl',
            ['w-8']: size === 'xl',
          }"
        />
        <span>{{ localEventLikes.length }}</span>
      </span>
      <template #tooltip>
        {{ likeUsers.join(', ') }}
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
type EventsEndpointRetType = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;
type EventRetType = EventsEndpointRetType['events'][number];
type EventLikeRetType = EventRetType['eventLikes'][number];

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  eventLikes: {
    type: Object as PropType<EventLikeRetType[]>,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
  },
});

const { userId, user } = useAuth();

const localEventLikes = ref(props.eventLikes);
const userLike = computed(() => localEventLikes.value.find((l) => l.userId === userId.value));
const likeUsers = computed(() => localEventLikes.value.map((el) => userDisplayName(el.user)));

async function like() {
  if (userLike.value) {
    const likeIndex = localEventLikes.value.findIndex((l) => l.userId === userId.value);
    if (likeIndex !== -1) {
      localEventLikes.value.splice(likeIndex, 1);
    }
  } else {
    // add a custom like object to the array
    // or remove it if it already exists
    // so that the UI updates immediately, then make a request to the server
    localEventLikes.value.push({
      userId: userId.value as number,
      user: user.value as EventLikeRetType['user'],
      eventId: props.eventId,
      dislike: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  await keskusFetch(`/api/events/${props.eventId}/like`, { method: 'POST', body: {} });
}
</script>
