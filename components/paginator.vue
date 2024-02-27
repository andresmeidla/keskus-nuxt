<template>
  <div class="flex w-full items-center justify-center justify-items-center">
    <div class="join">
      <button class="btn join-item btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="first">«</button>
      <button class="btn join-item btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="previous">‹</button>
      <button class="btn join-item btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all">Lk {{ pageNumber }} (Kokku {{ totalCount }})</button>
      <button class="btn join-item btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="next">›</button>
      <button class="btn join-item btn-primary hover:opacity-75 hover:shadow-lg hover:transition-all" @click="last">»</button>
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

const totalCount = ref(Math.ceil(props.pageCount));
const pageNumber = ref(Math.ceil(props.modelValue));
const emit = defineEmits(['update:modelValue']);
watch([pageNumber], () => emit('update:modelValue', pageNumber.value));

function first() {
  pageNumber.value = 1;
}

function previous() {
  if (pageNumber.value > 1) {
    pageNumber.value = pageNumber.value - 1;
  }
}

function next() {
  if (pageNumber.value < totalCount.value) {
    pageNumber.value = pageNumber.value + 1;
  }
}

function last() {
  pageNumber.value = totalCount.value;
}
</script>

<style scoped></style>
