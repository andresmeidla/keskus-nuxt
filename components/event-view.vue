<template>
  <div class="flex w-full flex-col gap-4">
    <div class="relative flex w-full flex-col items-center justify-center gap-2 p-4 sm:flex-row">
      <template v-if="isUserOwner">
        <div class="absolute top-0 left-0 mt-1 ml-1">
          <span class="btn btn-sm btn-circle btn-secondary" @click="edit = !edit">
            <Icon class="h-5 w-5 cursor-pointer" :name="edit ? 'tabler:edit-off' : 'tabler:edit'" />
          </span>
        </div>
      </template>
      <div class="flex w-52 flex-col items-center justify-center gap-2">
        <Avatar :user="event.user" :date="new Date(event.createdAt)" size="xl"></Avatar>
      </div>
      <div class="mt-4 flex w-full flex-col items-center justify-center gap-1">
        <template v-if="!edit">
          <div class="flex w-full items-center justify-center sm:justify-start">
            <span class="custom-underlined w-fit text-lg font-bold">{{ event.headline }}</span>
          </div>
          <div v-if="event.location" class="mt-2 flex w-full items-center justify-center gap-2 text-sm sm:justify-start">
            <GmapLink :address="event.location"></GmapLink>
            {{ event.location }}
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="w-full pt-4" v-html="purifiedBody"></div>
          </div>
        </template>
        <template v-else>
          <div class="flex w-full items-center justify-center sm:justify-start">
            <input
              v-model="editableEvent.headline"
              type="text"
              placeholder="Mis? *"
              class="input input-bordered w-full"
              :class="{ 'input-error': !headlineValid && showErrors }"
            />
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2">
            <div class="input input-bordered flex w-full items-center justify-center gap-2">
              <input v-model="editableEvent.location" class="bg-secondary w-full border-0 outline-none focus:border-0" placeholder="Kus?" />
              <GmapLink
                :class="{
                  'saturate-0': editableEvent.location?.length === 0,
                  'animate-[heartBeat_1s_cubic-bezier(0,_0,_0.1,_1)_0.1s]': (editableEvent.location?.length || 0) > 0,
                }"
                :address="editableEvent.location || ''"
              ></GmapLink>
            </div>
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2">
            <ClientOnly>
              <Editor v-model="body" placeholder="Kirjeldus? *" />
            </ClientOnly>
            <button class="btn btn-primary" @click="updateEvent">Muuda</button>
          </div>
        </template>
      </div>
      <div class="flex w-32 flex-col items-center gap-2">
        <EventLike :event-id="event.id" :event-likes="event.eventLikes" size="xl" @updated="emit('updated')"></EventLike>
      </div>
    </div>
    <div class="divider my-2 mx-8"></div>
    <div class="flex w-full flex-row">
      <EventAttendanceList :event-id="event.id" :event-attendances="event.eventAttendances" @updated="emit('updated')"></EventAttendanceList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { purifyHtml } from '~~/lib/utils';

type EndpointEvent = NonNullable<NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/`>>>>['event']>;
type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

const props = defineProps({
  event: {
    type: Object as PropType<EndpointEvent>,
    required: true,
  },
});

const emit = defineEmits(['updated']);

const showErrors = ref(false);
const comments = ref<EndpointComment[]>([]);
const edit = ref(false);

const editableEvent = computed({
  get: () => props.event,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set: (value) => {
    // emit('updated', value);
  },
});
const body = computed({
  get: () => editableEvent.value.body || '',
  set: (value) => {
    editableEvent.value.body = value;
  },
});
const purifiedBody = computed(() => purifyHtml(props.event.body || ''));
const isUserOwner = computed(() => props.event.user.id === getUser());
const headlineValid = computed(() => editableEvent.value.headline.length >= 3);
// const purgedBody = computed(() => purgeHtml(purifiedBody.value || ''));
// const bodyValid = computed(() => purgedBody.value.length >= 3);

async function fetchComments() {
  try {
    const rsp = await keskusFetch(`/api/events/${props.event.id}/comments`);
    comments.value = rsp;
  } catch (err: any) {
    useToastError(err);
  }
}

async function updateEvent() {
  if (!headlineValid.value) {
    showErrors.value = true;
    return;
  }
  try {
    await keskusFetch(`/api/events/${props.event.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        headline: editableEvent.value.headline,
        body: body.value,
        location: editableEvent.value.location,
      }),
    });
    edit.value = false;
    emit('updated');
  } catch (err: any) {
    useToastError(err);
  }
}

await fetchComments();
</script>
<style scoped></style>
