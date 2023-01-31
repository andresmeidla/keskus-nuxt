<template>
  <div class="flex w-full items-center justify-center justify-items-center">
    <div class="btn-group">
      <button class="btn btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="first">«</button>
      <button class="btn btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="previous">‹</button>
      <button class="btn btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all">Page {{ localValue }} (total {{ totalCount }})</button>
      <button class="btn btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="next">›</button>
      <button class="btn btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="last">»</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  pageCount: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const totalCount = computed(() => Math.ceil(props.pageCount));

const localValue = computed({
  get: () => Math.ceil(props.modelValue),
  set: (value) => emit('update:modelValue', value),
});
const emit = defineEmits(['update:modelValue']);

function first() {
  localValue.value = 1;
}

function previous() {
  if (localValue.value > 1) {
    localValue.value = localValue.value - 1;
  }
}

function next() {
  if (localValue.value < totalCount.value) {
    localValue.value = localValue.value + 1;
  }
}

function last() {
  localValue.value = totalCount.value;
}
</script>

<style scoped></style>
