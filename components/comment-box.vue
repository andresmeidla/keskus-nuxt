<template>
  <div class="relative flex w-full flex-row items-center">
    <div v-if="isUserOwner" class="absolute top-0 left-0 mt-1 ml-1">
      <span class="btn btn-sm btn-circle btn-secondary">
        <Icon class="h-5 w-5 cursor-pointer" :name="edit ? 'tabler:edit-off' : 'tabler:edit'" @click="edit = !edit" />
      </span>
    </div>
    <div class="flex w-32 items-center justify-center sm:w-52">
      <Avatar :user="comment.user" :date="new Date(comment.createdAt)"></Avatar>
    </div>
    <template v-if="!edit">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="w-full" v-html="purifiedBody"></div>
    </template>
    <template v-else>
      <div class="flex w-full flex-col justify-center gap-2">
        <Editor v-model="body"></Editor>
        <div class="flex justify-center">
          <button class="btn btn-primary" :disabled="saving" @click="updateComment">Muuda</button>
        </div>
      </div>
    </template>
    <div class="hidden w-32 sm:block">
      <CommentLike :event-id="comment.eventId" :comment-id="comment.id" :comment-likes="comment.commentLikes" @updated="emit('updated')"></CommentLike>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { purifyHtml } from '~~/lib/utils';

type EndpointComment = NonNullable<Awaited<ReturnType<typeof keskusFetch<`/api/events/${string}/comments/`>>>>[number];

const props = defineProps({
  comment: {
    type: Object as PropType<EndpointComment>,
    required: true,
  },
});
const emit = defineEmits(['updated']);

const edit = ref(false);
const saving = ref(false);
// const showErrors = ref(false);

const editableComment = computed({
  get: () => props.comment,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set: (value) => {
    // emit('updated', value);
  },
});

const body = computed({
  get: () => props.comment.body || '',
  set: (value) => {
    editableComment.value.body = value;
  },
});

const isUserOwner = computed(() => props.comment.userId === getUser());
const purifiedBody = computed(() => purifyHtml(body.value));
// const purgedBody = computed(() => purgeHtml(purifiedBody.value || ''));
// const bodyValid = computed(() => purgedBody.value.length >= 3);

async function updateComment() {
  // if (!bodyValid.value) {
  //   showErrors.value = true;
  //   return;
  // }
  try {
    saving.value = true;
    await keskusFetch(`/api/events/${props.comment.eventId}/comments/${props.comment.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        body: body.value,
      }),
    });
    edit.value = false;
    emit('updated');
  } catch (err: any) {
    useToastError(err);
  } finally {
    saving.value = false;
  }
}
</script>
