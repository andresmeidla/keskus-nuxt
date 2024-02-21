<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div v-if="eventData.events.length > 0" class="w-full sm:w-4/5">
      <EventList :events="eventData.events" :page="page" @updated="fetchEventList" />
      <div class="relative flex w-full flex-col items-center justify-center gap-2 p-4 md:flex-row">
        <Paginator v-model="page" :page-count="eventData.count / perPage" />
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
  const rsp = await useKeskusFetch('/api/events', {
    query: { page: page.value, perPage: perPage.value },
  });
  if (rsp.data.value) {
    eventData.value.count = rsp.data.value.count;
    eventData.value.events = rsp.data.value.events;
  }
}

await fetchEventList();

watch(
  () => page.value,
  async () => {
    useRouter().push({ query: { page: page.value } });
    await fetchEventList();
  },
);
</script>
