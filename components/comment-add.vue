<template>
  <div class="add-comment flex w-full flex-col items-center justify-center gap-2 p-2 pb-2 bg-gray-200">
    <div
      class="badge flex cursor-pointer select-none items-center justify-center gap-1 p-4 duration-75 hover:drop-shadow-lg hover:saturate-50 hover:transition-all"
      :class="{ 'badge-secondary': isExpanded, 'badge-primary': !isExpanded }"
      @click="toggleExpansion"
    >
      <div class="flex flex-row items-center justify-center gap-1"><Icon class="h-5 w-5" name="material-symbols:add-circle-rounded" /> Lisa kommentaar</div>
    </div>
    <Collapse :when="isExpanded" class="collapse grid w-full grid-cols-1 justify-center p-0 px-2">
      <div class="flex w-full flex-col items-center justify-center gap-2">
        <div class="flex w-full flex-row">
          <div class="hidden w-52 items-center justify-center sm:flex">
            <Avatar v-if="user" :user="user" />
          </div>
          <ClientOnly fallback-tag="div" fallback="Loading editor...">
            <Editor :key="editorUpdateKey" v-model="newComment" override-tab-index="4" :focus="!isMobile" :validation-error="showErrors && !bodyValid"></Editor>
          </ClientOnly>
          <div class="hidden w-32 sm:flex"></div>
        </div>
        <button class="btn btn-primary w-fit" :disabled="loading" @click="addComment">Lisa</button>
      </div>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
import { purgeHtml, purifyHtml } from '@/lib/utils';

const props = defineProps({
  eventId: { type: Number, required: true },
});
const { user } = useAuth();
const emit = defineEmits(['commentAdded']);
const isExpanded = ref(false);
const loading = ref(false);
const newComment = ref('');
const showErrors = ref(false);
const { isMobile } = useDevice();
let editorUpdateKey = 0;

const purifiedBody = computed(() => purifyHtml(newComment.value));
const purgedBody = computed(() => purgeHtml(purifiedBody.value));
const bodyValid = computed(() => purgedBody.value.length >= 1);

async function addComment() {
  if (!bodyValid.value) {
    showErrors.value = true;
    return;
  }
  try {
    loading.value = true;
    await keskusFetch(`/api/events/${props.eventId}/comments`, { method: 'POST', body: { body: purifiedBody.value } });
    newComment.value = '';
    isExpanded.value = false;
    // force the editor to be reloaded because vue-quill does not change the value for some reason
    editorUpdateKey += 1;
    emit('commentAdded');
  } catch (err: any) {
    useToastError(err);
  } finally {
    loading.value = false;
  }
}

function toggleExpansion() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    setTimeout(() => {
      const editor = document.querySelector('.add-comment .ql-editor');
      if (editor) {
        (editor as HTMLElement).focus();
      }
    }, 100);
  }
}
</script>
<style scoped>
.collapse {
  transition: height var(--vc-auto-duration) cubic-bezier(0.37, 0, 0.63, 1);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
