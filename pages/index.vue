<template>
  <div class="flex w-full justify-center py-4 text-black">
    <div v-if="data && data.events.length > 0" class="w-full sm:w-4/5">
      <EventList :events="data.events" :page="page" />
      <div class="relative flex w-full flex-col items-center justify-center gap-2 p-4 md:flex-row">
        <Paginator v-model="page" :page-count="data.count / perPage" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: 'Teemad',
  layout: 'default',
});

const page = ref(useRoute().query.page ? parseInt(useRoute().query.page as string) : 1);
const perPage = ref(8);
const { data } = await useKeskusFetch('/api/events', { query: { page, perPage } });

// change the URL ato reflect the current page
watch([page], () => useRouter().push({ query: page.value > 1 ? { page: page.value } : {} }));
</script>
