<template>
  <div class="flex w-full flex-col items-center gap-2 p-2">
    <div
      class="badge badge-primary flex cursor-pointer select-none items-center gap-1 p-3 duration-75 hover:drop-shadow-lg hover:saturate-50 hover:transition-all"
      @click="isExpanded = !isExpanded"
    >
      <Transition>
        <Icon class="h-5 w-5" :name="isExpanded ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" />
      </Transition>
      <span>Uus kommentaar</span>
    </div>
    <Collapse :when="isExpanded" class="collapse grid w-full grid-cols-1 justify-center p-0 px-2">
      <div class="flex w-full flex-col items-center justify-center gap-2">
        <div class="flex w-full flex-row">
          <div class="hidden w-52 items-center justify-center sm:flex">
            <Avatar v-if="store.user" :user="store.user" />
          </div>
          <ClientOnly>
            <Editor v-if="isExpanded" :key="editorUpdateKey" v-model="newComment"></Editor>
          </ClientOnly>
          <div class="hidden w-32 sm:flex"></div>
        </div>
        <button class="btn btn-primary w-fit" @click="addComment">Lisa</button>
      </div>
    </Collapse>
    <CommentBox v-for="comment of comments" :key="comment.id" :comment="comment" @updated="emit('updated')" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { purifyHtml } from '../lib/utils';
import { store } from '../store';

type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
  comments: {
    type: Object as PropType<EndpointComment[]>,
    required: true,
  },
});
const emit = defineEmits(['updated']);

const isExpanded = ref(false);
const newComment = ref('');
// const showErrors = ref(false);
let editorUpdateKey = 0;

const purifiedBody = computed(() => purifyHtml(newComment.value));
// const purgedBody = computed(() => purgeHtml(purifiedBody.value));
// const bodyValid = computed(() => purgedBody.value.length >= 3);

async function addComment() {
  // if (!bodyValid.value) {
  //   showErrors.value = true;
  //   return;
  // }
  try {
    await keskusFetch(`/api/events/${props.eventId}/comments`, { method: 'POST', body: { body: purifiedBody } });
    newComment.value = '';
    isExpanded.value = false;
    // force the editor to be reloaded because vue-quill does not change the value for some reason
    editorUpdateKey += 1;
    emit('updated');
  } catch (err: any) {
    useToastError(err);
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
