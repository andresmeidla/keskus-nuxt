<template>
  <div class="avatar-wrapper flex flex-col items-center justify-center">
    <Tooltip :disabled="!tooltip" position="right" class="flex">
      <div class="avatar" :class="props.class">
        <div
          class="rounded-full"
          :class="{
            ['h-[25px]']: size === 'sm',
            ['w-[25px]']: size === 'sm',
            ['h-[35px]']: size === 'md',
            ['w-[35px]']: size === 'md',
            ['h-[50px]']: size === 'lg',
            ['w-[50px]']: size === 'lg',
            ['h-[64px]']: size === 'xl',
            ['w-[64px]']: size === 'xl',
          }"
        >
          <NuxtImg :src="url" :alt="displayName" />
        </div>
      </div>
      <template #tooltip>
        <div class="avatar-tooltip">{{ tooltip }}</div>
      </template>
    </Tooltip>
    <div v-if="showName" class="avatar-name w-full text-center text-base">{{ displayName }}</div>
    <div v-if="date" class="avatar-date w-full items-center text-center text-xs"><Datetime :date="date" /></div>
  </div>
</template>
<script setup lang="ts">
import gravatarUrl from 'gravatar-url';
import { type UserInfo } from '@/server/lib/entity-types';

const props = defineProps({
  user: {
    type: Object as PropType<UserInfo>,
    required: true,
  },
  date: {
    type: Date,
    default: null,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
  },
  tooltip: {
    type: String,
    default: null,
  },
  class: {
    type: [String, Object],
    default: null,
  },
  showName: {
    type: Boolean,
    default: true,
  },
});
const defaultUrl = computed(
  () =>
    `https://ui-avatars.com/api/${props.user.firstname.length > 0 ? props.user.firstname[0] : 'X'}+${
      props.user.lastname.length ? props.user.lastname[0] : 'X'
    }/64/0E7490/fff`,
);
const url = computed(() => gravatarUrl(props.user.email || '', { size: 64, default: defaultUrl.value }));
const displayName = computed(() => userDisplayName(props.user));
</script>

<style scoped></style>
