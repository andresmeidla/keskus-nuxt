<template>
  <Tooltip position="right">
    <span class="hover-styled rounded-md p-0.5 text-gray-500">{{ fromNow }}</span>
    <template #tooltip>
      <div>{{ formattedData }}</div>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import { dateFormatted, dateFromNow } from '~~/lib/utils';

const fromNow = computed(() => dateFromNow(props.date));
const formattedData = computed(() => dateFormatted(props.date));

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});
</script>

<style scoped></style>
