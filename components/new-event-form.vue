<template>
  <div class="flex flex-row items-center justify-center p-2">
    <div v-if="user" class="pl-2"><Avatar size="lg" :user="user"></Avatar></div>
    <div class="form-control flex w-full flex-col items-center justify-center gap-2 px-10">
      <input v-model="eventData.headline" type="text" placeholder="Mis? *" class="input input-bordered w-full" />
      <input v-model="eventData.location" type="text" placeholder="Kus?" class="input input-bordered w-full" />
      <textarea v-model="eventData.body" class="textarea textarea-bordered h-24 w-full" placeholder="Kirjeldus? *"></textarea>
      <div class="modal-action flex w-full items-center justify-center">
        <button class="btn btn-success" @click="saveEvent">Valmis!</button>
        <label ref="modalClose" for="my-modal" class="btn btn-success hidden"></label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from '~~/store';

const emit = defineEmits(['newEvent']);

const user = computed(() => store.user);

const eventData = reactive({ headline: '', location: '', body: '' });

const modalClose = ref<HTMLButtonElement | null>(null);

async function saveEvent() {
  const newEvent = await keskusFetch('/api/events', { method: 'POST', body: eventData });
  emit('newEvent', newEvent);
  if (modalClose.value) {
    modalClose.value.click();
  }
  eventData.headline = '';
  eventData.body = '';
  eventData.location = '';
}
</script>

<style></style>
