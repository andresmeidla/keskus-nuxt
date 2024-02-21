<template>
  <Tooltip position="right">
    <span class="cursor-default p-0.5 text-gray-500">{{ fromNow }}</span>
    <template #tooltip>
      <div>{{ formattedData }}</div>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import { dateFormatted, dateFromNow } from '~/lib/utils';

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});

const fromNow = computed(() => dateFromNow(props.date));
const formattedData = computed(() => dateFormatted(props.date));
</script>

<style scoped></style>
