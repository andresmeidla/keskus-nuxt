<template>
  <div class="flex flex-row items-center justify-center p-2">
    <div v-if="user" class="hidden pl-2 sm:block"><Avatar size="lg" :user="user"></Avatar></div>
    <div class="form-control flex w-full flex-col items-center justify-center gap-2 sm:px-10">
      <input
        v-model="eventData.headline"
        tabindex="1"
        type="text"
        placeholder="Mis? *"
        class="input input-bordered w-full"
        :class="{ 'input-error': !headlineValid && showErrors }"
      />
      <div class="input input-bordered flex w-full items-center justify-center gap-2">
        <input v-model="eventData.location" tabindex="2" class="bg-secondary w-full border-0 outline-none focus:border-0" placeholder="Kus?" />
        <GmapLink
          :class="{ 'saturate-0': eventData.location.length === 0, 'animate-[heartBeat_1s_cubic-bezier(0,_0,_0.1,_1)_0.1s]': eventData.location.length > 0 }"
          :address="eventData.location"
        ></GmapLink>
      </div>
      <ClientOnly fallback-tag="div" fallback="Loading editor...">
        <Editor
          :key="editorUpdateKey"
          v-model="eventData.body"
          placeholder="Kirjeldus? *"
          override-tab-index="3"
          :validation-error="showErrors && !bodyValid"
        ></Editor>
      </ClientOnly>
      <div class="modal-action flex w-full items-center justify-center">
        <button class="btn btn-primary" :disabled="loading" @click="saveEvent">Valmis!</button>
        <label ref="modalClose" for="my-modal" class="btn btn-success hidden"></label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { purgeHtml, purifyHtml } from '~/lib/utils';

const { user } = useAuth();
const emit = defineEmits(['eventCreated']);

let editorUpdateKey = 0;

const loading = ref(false);

const eventData = reactive({ headline: '', location: '', body: '' });

const modalClose = ref<HTMLButtonElement | null>(null);
const showErrors = ref(false);

const headlineValid = computed(() => eventData.headline.length >= 3);

const purifiedBody = computed(() => purifyHtml(eventData.body));
const purgedBody = computed(() => purgeHtml(eventData.body));
const bodyValid = computed(() => purgedBody.value.length >= 3);

async function saveEvent() {
  if (!headlineValid.value || !bodyValid.value) {
    showErrors.value = true;
    return;
  }
  try {
    loading.value = true;
    const newEvent = await keskusFetch('/api/events', {
      method: 'POST',
      body: {
        headline: eventData.headline,
        body: purifiedBody.value,
        ...(eventData.location.length > 0 ? { location: eventData.location } : undefined),
      },
    });
    // force the editor to be reloaded because vue-quill does not change the value for some reason
    editorUpdateKey += 1;
    emit('eventCreated', newEvent);
    if (modalClose.value) {
      modalClose.value.click();
    }
    eventData.headline = '';
    eventData.body = '';
    eventData.location = '';
    useRouter().push(`/events/${newEvent.id}`);
  } catch (err: any) {
    useToastError(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
