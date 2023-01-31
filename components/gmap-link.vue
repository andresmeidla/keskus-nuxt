<template>
  <NuxtLink class="link" :href="gMapUrl" target="_blank"
    ><Icon
      name="logos:google-maps"
      class="hover:saturate-50"
      :class="{
        ['h-4']: size === 'sm',
        ['w-4']: size === 'sm',
        ['h-5']: size === 'md',
        ['w-5']: size === 'md',
        ['h-6']: size === 'lg',
        ['w-6']: size === 'lg',
        ['h-8']: size === 'xl',
        ['w-8']: size === 'xl',
      }"
  /></NuxtLink>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
  },
});

const gMapUrl = computed(() => {
  return `https://maps.google.com/?q=${encodeURIComponent(props.address)}`;
});
</script>
