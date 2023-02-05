<template>
  <div>
    <input id="my-modal" v-model="isOpen" type="checkbox" class="modal-toggle w-3/4" />
    <label for="my-modal" class="modal" @keydown.esc="isOpen = false">
      <label class="modal-box relative w-full bg-gray-100 sm:max-w-4xl" for="">
        <label for="my-modal" class="btn btn-sm btn-circle btn-secondary absolute right-2 top-2">✕</label>
        <NewEventForm v-if="isOpen" />
      </label>
    </label>
  </div>
</template>

<script lang="ts" setup>
const isOpen = ref(false);
</script>
