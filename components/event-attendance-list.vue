<template>
  <div class="attendance flex w-full flex-col text-center sm:flex-row">
    <div v-for="(label, state) of attendanceLabels" :key="state" class="flex w-full flex-col items-center justify-start gap-2">
      <span
        class="badge text-md flex w-fit cursor-pointer select-none flex-row gap-1 p-3 duration-75 hover:drop-shadow-lg hover:saturate-50 hover:transition-all"
        :class="{
          'badge-success': attendanceStyle[state] === 'success',
          'badge-secondary': attendanceStyle[state] === 'secondary',
          'badge-accent': attendanceStyle[state] === 'accent',
        }"
        @click="setAttendance(state)"
      >
        <input v-show="userAttendance?.state === state" type="checkbox" :checked="userAttendance?.state === state" class="checkbox checkbox-xs" />
        {{ label }}
      </span>
      <div class="flex flex-wrap gap-2">
        <div v-for="att of attendanceMap[state]" :key="att.userId" :class="{ ['user-avatar']: att.userId === store.userId }">
          <Avatar :user="att.user"></Avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { store } from '~~/store';

import { AttendanceState } from '../server/lib/entity-types';

type EndpointEventAttendance = NonNullable<NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/`>>>>['event']>['eventAttendances'][number];

const attendanceStyle = {
  [AttendanceState.Going]: 'success',
  [AttendanceState.Maybe]: 'secondary',
  [AttendanceState.Not]: 'accent',
} as const;

const attendanceLabels = {
  [AttendanceState.Going]: 'Osalen',
  [AttendanceState.Maybe]: 'Võibolla?',
  [AttendanceState.Not]: 'Seekord mitte',
} as const;

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  eventAttendances: {
    type: Object as PropType<EndpointEventAttendance[]>,
    required: true,
  },
});

const emit = defineEmits(['updated']);

const userAttendance = computed(() => {
  return props.eventAttendances.find((att) => att.userId === store.userId);
});

const attendanceMap = computed(() => {
  return props.eventAttendances.reduce(
    (acc, cur) => {
      if (!acc[cur.state as AttendanceState]) {
        console.error(`Invalid AttendanceState: "${cur.state}"`);
      } else {
        acc[cur.state as AttendanceState].push(cur);
      }
      return acc;
    },
    {
      [AttendanceState.Not]: [] as EndpointEventAttendance[],
      [AttendanceState.Maybe]: [] as EndpointEventAttendance[],
      [AttendanceState.Going]: [] as EndpointEventAttendance[],
    }
  );
});

async function setAttendance(state: AttendanceState) {
  try {
    await keskusFetch(`/api/events/${props.eventId}/attendance`, { method: 'POST', body: { state } });
    emit('updated');
  } catch (err: any) {
    useToastError(err);
  }
}
</script>

<style scoped>
.attendance > div > div {
  @apply flex items-center justify-center p-2 px-4;
}
:deep(.user-avatar .avatar-name) {
  @apply font-bold;
}
</style>
