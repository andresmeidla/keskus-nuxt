<template>
  <div>
    <input id="my-modal" v-model="isOpen" type="checkbox" class="modal-toggle w-3/4" />
    <div class="modal">
      <div class="modal-box w-full bg-gray-100 sm:max-w-4xl">
        <label for="my-modal" class="btn btn-sm btn-circle btn-secondary absolute right-2 top-2">✕</label>
        <NewEventForm v-if="isOpen" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const isOpen = ref(false);
</script>
