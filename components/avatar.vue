<template>
  <div class="flex flex-col items-center justify-center">
    <Tooltip :disabled="!tooltip" position="right" class="flex">
      <div class="avatar" :class="props.class">
        <div
          class="rounded-full"
          :class="{
            ['h-[25px]']: size === 'sm',
            ['w-[25px]']: size === 'sm',
            ['h-[35px]']: size === 'md',
            ['w-[35px]']: size === 'md',
            ['h-[64px]']: size === 'lg',
            ['w-[64px]']: size === 'lg',
          }"
        >
          <img :src="url" :alt="displayName" />
        </div>
      </div>
      <template #tooltip>
        <div>{{ tooltip }}</div>
      </template>
    </Tooltip>
    <div v-if="showName" class="w-full text-center text-base">{{ displayName }}</div>
    <div v-if="date" class="w-full items-center text-center text-xs"><Datetime :date="date" /></div>
  </div>
</template>
<script setup lang="ts">
import gravatarUrl from 'gravatar-url';
import { PropType } from 'vue';

import { UserInfo } from '~~/server/lib/entity-types';

const props = defineProps({
  user: {
    type: Object as PropType<UserInfo>,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: null,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    required: false,
    default: 'md',
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
  showName: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const defaultUrl = computed(
  () =>
    `https://ui-avatars.com/api/${props.user.firstname.length > 0 ? props.user.firstname[0] : 'X'}+${
      props.user.lastname.length ? props.user.lastname[0] : 'X'
    }/64/0E7490/fff`
);
const url = computed(() => gravatarUrl(props.user.email || '', { size: 64, default: defaultUrl.value }));
const displayName = computed(() => userDisplayName(props.user));
</script>

<style scoped></style>
