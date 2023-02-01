<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div v-if="eventData.events.length > 0" class="w-11/12 sm:w-4/5">
      <EventList :events="eventData.events" :page="page" @updated="fetchEventList" />
      <div class="relative flex w-full flex-col items-center justify-center gap-2 p-4 md:flex-row">
        <Paginator v-model="page" :page-count="eventData.count / perPage" />
        <div class="flex items-center justify-items-center">
          <label for="my-modal" class="btn btn-primary hover-styled right-0 flex cursor-pointer items-center gap-1 rounded-lg p-2 px-2 shadow-md md:absolute">
            <!--  -->
            <Icon class="h-5 w-5" name="material-symbols:add-circle-rounded" />
            <span>Uus teema</span>
          </label>
        </div>
      </div>
    </div>
    <input id="my-modal" type="checkbox" class="modal-toggle w-3/4" />
    <div class="modal">
      <div class="modal-box max-w-4xl bg-gray-100">
        <label for="my-modal" class="btn btn-sm btn-circle btn-secondary absolute right-2 top-2">✕</label>
        <NewEventForm @new-event="fetchEventList" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type EndpointEvents = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>['events'];

definePageMeta({
  title: 'Teemad',
  layout: 'default',
});

const page = ref(1);
const perPage = ref(8);
const eventData = reactive({
  count: 0,
  events: [] as EndpointEvents,
});

async function fetchEventList() {
  try {
    const rsp = await keskusFetch('/api/events', {
      query: { page: page.value, perPage: perPage.value },
    });
    eventData.count = rsp.count;
    eventData.events = rsp.events;
  } catch (err: any) {
    useToastError(err);
  }
}
await fetchEventList();

watch(
  () => page.value,
  async () => {
    await fetchEventList();
  }
);
</script>
