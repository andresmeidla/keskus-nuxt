<template>
  <div class="attendance flex w-full flex-col text-center sm:flex-row">
    <div v-for="(label, state) of attendanceLabels" :key="state" class="flex w-full flex-col items-center justify-start gap-4">
      <span
        class="badge text-md flex w-fit cursor-pointer select-none flex-row gap-1 p-4 duration-75 hover:drop-shadow-lg hover:saturate-50 hover:transition-all"
        :class="{
          // 'badge-success': attendanceStyle[state] === 'success',
          'badge-secondary': attendanceStyle[state] === 'secondary',
          // 'badge-accent': attendanceStyle[state] === 'accent',
        }"
        @click="setAttendance(state)"
      >
        <input v-show="userAttendance?.state === state" type="checkbox" :checked="userAttendance?.state === state" class="checkbox checkbox-xs" />
        {{ label }}
      </span>
      <div class="flex flex-wrap gap-2">
        <div v-for="att of attendanceMap[state]" :key="att.userId" :class="{ ['user-avatar']: att.userId === userId }">
          <Avatar :user="att.user"></Avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AttendanceState } from '~/server/lib/entity-types';

type EndpointEventAttendance = Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}`>>>['eventAttendances'][number];

const attendanceStyle = {
  [AttendanceState.Going]: 'secondary',
  [AttendanceState.Maybe]: 'secondary',
  [AttendanceState.Not]: 'secondary',
} as const;

const attendanceLabels = {
  [AttendanceState.Going]: 'Osalen',
  [AttendanceState.Maybe]: 'Võib-olla?',
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

const { userId, user } = useAuth();

const localEventAttendees = computed({
  get: () => props.eventAttendances,
  set: () => {},
});

const userAttendance = computed(() => {
  return localEventAttendees.value.find((att) => att.userId === userId.value);
});

const attendanceMap = computed(() => {
  return localEventAttendees.value.reduce(
    (acc, cur) => {
      if (!acc[cur.state as AttendanceState]) {
        throw new Error(`Invalid AttendanceState: "${cur.state}"`);
      } else {
        acc[cur.state as AttendanceState].push(cur);
      }
      return acc;
    },
    {
      [AttendanceState.Not]: [] as EndpointEventAttendance[],
      [AttendanceState.Maybe]: [] as EndpointEventAttendance[],
      [AttendanceState.Going]: [] as EndpointEventAttendance[],
    },
  );
});

async function setAttendance(state: AttendanceState) {
  // add a custom like object to the array
  // or remove it if it already exists
  // so that the UI updates immediately, then make a request to the server
  if (userAttendance.value) {
    if (userAttendance.value.state === state) {
      const likeIndex = localEventAttendees.value.findIndex((ea) => ea.userId === userId.value);
      if (likeIndex !== -1) {
        localEventAttendees.value.splice(likeIndex, 1);
      }
    } else {
      userAttendance.value.state = state;
    }
  } else {
    localEventAttendees.value.push({
      userId: userId.value,
      user: user.value,
      eventId: props.eventId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      state,
    } as EndpointEventAttendance);
  }
  try {
    await keskusFetch(`/api/events/${props.eventId}/attendance`, { method: 'POST', body: { state } });
  } catch (err: any) {
    useToastError(err);
  }
}
</script>

<style scoped>
.attendance > div > div {
  @apply flex items-center justify-center px-4;
}
:deep(.user-avatar .avatar-name) {
  @apply font-bold;
}
</style>
