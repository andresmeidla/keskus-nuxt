<template>
  <div class="w-full">
    <div class="editor flex w-full flex-col" :class="[props.class, { 'validation-error': validationError }]">
      <QuillEditor v-model:content="localValue" theme="snow" content-type="html" :options="{ placeholder }" :toolbar="toolbar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type QuillEditor } from '@vueup/vue-quill';

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['link', 'image', 'video', 'formula'],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  class: {
    type: [String, Object],
    default: '',
  },
  validationError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const localValue = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>
<style scoped>
:deep(.ql-tooltip input) {
  @apply border-none bg-inherit outline-none;
}
:deep(.ql-toolbar) {
  @apply input input-bordered h-[4rem] rounded-b-none;
}
:deep(.ql-container) {
  @apply input input-bordered rounded-t-none border-t-0 pb-2;
}
:deep(.ql-container) {
  min-height: 6rem;
  max-height: 20rem;
  /* height: 100%; */
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.ql-editor) {
  height: 100%;
  flex: 1;
  overflow-y: auto;
  width: 100%;
}
:deep(.validation-error .ql-toolbar) {
  @apply input-error;
}
:deep(.validation-error .ql-container) {
  @apply input-error;
}
</style>