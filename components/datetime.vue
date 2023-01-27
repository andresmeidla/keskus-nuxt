<template>
  <Tooltip position="right">
    <span class="hover-styled rounded-md p-0.5 text-gray-500">{{ fromNow }}</span>
    <template #tooltip>
      <div>{{ formattedData }}</div>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import moment from 'moment';

const fromNow = computed(() => moment(props.date).fromNow());

const formattedData = computed(() => moment(props.date).format('YYYY-MM-DD HH:mm'));

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});
</script>

<style scoped></style>
