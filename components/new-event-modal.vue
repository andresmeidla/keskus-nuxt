<template>
  <dialog id="my_modal_3" class="modal">
    <div class="modal-box w-11/12 max-w-5xl bg-gray-100">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <NewEventForm @event-created="eventCreated" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
function eventCreated() {
  // find element by id
  const modal: any = document.getElementById('my_modal_3');
  // hide the modal
  modal.close();
}
</script>
