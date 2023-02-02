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
type EndpointEvents = Awaited<ReturnType<typeof keskusFetch<'/api/events'>>>;

definePageMeta({
  title: 'Teemad',
  layout: 'default',
});

const page = ref(useRoute().query.page ? parseInt(useRoute().query.page as string) : 1);
const perPage = ref(8);
const eventData = ref<EndpointEvents>({
  count: 0,
  events: [],
});

async function fetchEventList() {
  try {
    const rsp = await useKeskusFetch<EndpointEvents>('/api/events', {
      method: 'GET',
      query: { page: page.value, perPage: perPage.value },
    });
    if (rsp.data.value) {
      eventData.value.count = rsp.data.value.count;
      eventData.value.events = rsp.data.value.events;
    }
  } catch (err: any) {
    useToastError(err);
  }
}

await fetchEventList();

watch(
  () => page.value,
  async () => {
    useRouter().push({ query: { page: page.value } });
    await fetchEventList();
  }
);
</script>
