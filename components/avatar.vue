<template>
  <div class="flex flex-col items-center justify-center">
    <Tooltip :disabled="!tooltip" position="right" class="flex">
      <div class="avatar" :class="props.class">
        <div class="h-8 w-8 rounded-full" :class="[`h-${size} w-${size}`]">
          <img :src="url" :alt="name" />
        </div>
      </div>
      <template #tooltip>
        <div>{{ tooltip }}</div>
      </template>
    </Tooltip>
    <div v-if="name" class="w-full text-center text-base">{{ name }}</div>
    <div v-if="date" class="w-full items-center text-center text-xs"><Datetime :date="date" /></div>
  </div>
</template>
<script setup lang="ts">
import gravatarUrl from 'gravatar-url';

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: null,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: null,
  },
  size: {
    type: Number,
    required: false,
    default: 14,
  },
  tooltip: {
    type: String,
    required: false,
    default: null,
  },
  class: {
    type: String,
    required: false,
    default: null,
  },
});
const defaultUrl = computed(
  () => `https://ui-avatars.com/api/${props.firstname.length > 0 ? props.firstname[0] : 'X'}+${props.lastname.length ? props.lastname[0] : 'X'}/64/0E7490/fff`
);
const url = computed(() => gravatarUrl(props.email || '', { size: 50, default: defaultUrl.value }));
</script>

<style scoped></style>
