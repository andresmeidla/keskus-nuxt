<template>
  <div v-if="eventData?.events" class="flex w-4/5 flex-col items-center justify-center gap-4 py-4">
    <div class="flex w-full flex-col">
      <div class="event-list w-full rounded-lg bg-gray-100">
        <div v-for="evt of eventData.events" :key="evt.headline" class="hover-styled grid cursor-pointer grid-cols-12 gap-2 rounded-lg border-b-2 p-2">
          <EventListRow :event-id="evt.id" />
        </div>
      </div>
      <div class="relative flex w-full flex-col items-center justify-center gap-2 p-4 md:flex-row">
        <Paginator v-model="page" :page-count="eventData.count / perPage" />
        <div class="flex items-center justify-items-center">
          <label for="my-modal" class="hover-styled right-0 flex cursor-pointer items-center gap-1 rounded-xl bg-gray-100 p-2 px-2 shadow-md md:absolute">
            <!--  -->
            <Icon class="h-5 w-5" name="material-symbols:add-circle-rounded" />
            <span> Uus teema </span>
          </label>
        </div>
      </div>
    </div>
    <input id="my-modal" type="checkbox" class="modal-toggle w-3/4" />
    <div class="modal">
      <div class="modal-box max-w-4xl bg-gray-100">
        <label for="my-modal" class="btn btn-sm btn-circle btn-primary absolute right-2 top-2">✕</label>
        <NewEventForm />
        <div class="modal-action flex w-full justify-center">
          <label for="my-modal" class="btn btn-success">Valmis!</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const page = ref(1);
const perPage = ref(7);
const eventData = reactive(await fetchEventList());

async function fetchEventList() {
  try {
    const rsp = await keskusFetch('/api/events', {
      query: { page: page.value, perPage: perPage.value },
    });
    return rsp;
  } catch (err: any) {
    fetchErrorHandling(err);
    return {
      count: 0,
      events: [] as Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>['events'],
    };
  }
}

watch(
  () => page.value,
  async () => {
    const { events, count } = await fetchEventList();
    eventData.events = events;
    eventData.count = count;
  }
);
</script>
<style scoped>
.event-list {
  min-height: 630px;
}
</style>
