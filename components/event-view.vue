<template>
  <div v-if="event" class="flex w-full flex-col gap-4">
    <div class="relative flex w-full flex-col items-center md:flex-row">
      <div class="flex w-52 flex-col items-center justify-start gap-2 p-2 pt-6 md:h-full">
        <Avatar :user="event.user" :date="new Date(event.createdAt)" size="xl"></Avatar>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-start gap-1 truncate pt-6">
        <template v-if="!edit">
          <div class="flex w-full items-center justify-center px-2 sm:justify-start sm:p-0">
            <div class="custom-underlined w-full whitespace-normal break-words text-lg font-bold">{{ event.headline }}</div>
          </div>
          <div v-if="event.location" class="mt-2 flex w-full items-center justify-center gap-2 truncate px-2 text-sm sm:justify-start sm:px-0">
            <GmapLink :address="event.location"></GmapLink>
            <span class="truncate">{{ event.location }}</span>
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2 whitespace-normal break-words px-2 sm:px-0">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="w-full pt-3" v-html="purifiedBody"></div>
          </div>
        </template>
        <template v-else>
          <div class="flex w-full items-center justify-center sm:justify-start">
            <input
              v-model="event.headline"
              type="text"
              placeholder="Mis? *"
              class="input input-bordered w-full"
              :class="{ 'input-error': !headlineValid && showErrors }"
            />
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2">
            <div class="input input-bordered flex w-full items-center justify-center gap-2">
              <input v-model="event.location" class="bg-secondary w-full border-0 outline-none focus:border-0" placeholder="Kus?" />
              <GmapLink
                :class="{
                  'saturate-0': event.location?.length === 0,
                  'animate-[heartBeat_1s_cubic-bezier(0,_0,_0.1,_1)_0.1s]': (event.location?.length || 0) > 0,
                }"
                :address="event.location || ''"
              ></GmapLink>
            </div>
          </div>
          <div class="flex w-full flex-col items-center justify-start gap-2">
            <ClientOnly fallback-tag="div" fallback="Loading editor...">
              <Editor v-if="event.body" v-model="event.body" placeholder="Kirjeldus? *" :validation-error="showErrors && !bodyValid" />
            </ClientOnly>
            <button class="btn btn-primary" :disabled="saving" @click="updateEvent">Muuda</button>
          </div>
        </template>
      </div>
      <div class="flex w-32 flex-row items-end justify-center gap-2 sm:px-5 md:h-full md:items-start md:pt-6">
        <template v-if="isUserOwner">
          <div class="">
            <span class="btn btn-sm btn-circle btn-secondary" @click="edit = !edit">
              <Icon class="h-5 w-5 cursor-pointer" :name="edit ? 'tabler:edit-off' : 'tabler:edit'" />
            </span>
          </div>
        </template>
        <EventLike :event-id="event.id" :event-likes="event.eventLikes" size="xl"></EventLike>
      </div>
    </div>
    <div class="divider my-0 mx-8"></div>
    <div class="flex w-full flex-row">
      <EventAttendanceList :event-id="event.id" :event-attendances="event.eventAttendances"></EventAttendanceList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { purgeHtml, purifyHtml } from '@/lib/utils';

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});
const { userId } = useAuth();

const showErrors = ref(false);
const saving = ref(false);
const edit = ref(false);
const { data: event, refresh: refreshEvent } = await useKeskusFetch(`/api/events/${props.eventId}`);

const purifiedBody = computed(() => purifyHtml(event.value?.body || ''));
const isUserOwner = computed(() => event.value?.user.id === userId.value);
const headlineValid = computed(() => (event.value?.headline.length || 0) >= 3);
const purgedBody = computed(() => purgeHtml(purifiedBody.value || ''));
const bodyValid = computed(() => purgedBody.value.length >= 1);

async function updateEvent() {
  if (!headlineValid.value || !bodyValid.value) {
    showErrors.value = true;
    return;
  }
  try {
    saving.value = true;
    await keskusFetch(`/api/events/${props.eventId}`, {
      method: 'PATCH',
      body: {
        headline: event.value?.headline,
        body: event.value?.body,
        location: event.value?.location,
      },
    });
    edit.value = false;
    refreshEvent();
  } catch (err: any) {
    useToastError(err);
  } finally {
    saving.value = false;
  }
}
</script>
<style scoped></style>
