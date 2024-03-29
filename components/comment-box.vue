<template>
  <div class="flex w-full flex-row items-center">
    <div v-if="!edit" class="flex w-32 items-center justify-center sm:w-52">
      <Avatar :user="comment.user" :date="new Date(comment.createdAt)"></Avatar>
    </div>
    <template v-if="!edit">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="w-full" v-html="purifiedBody"></div>
    </template>
    <template v-else>
      <div class="flex w-full flex-col justify-center gap-2 px-2">
        <ClientOnly fallback-tag="div" fallback="Loading editor...">
          <Editor v-model="editableCommentBody" :focus="!isMobile" :validation-error="showErrors && !bodyValid"></Editor>
        </ClientOnly>
        <div class="flex justify-center">
          <button class="btn btn-primary" :disabled="saving" @click="updateComment">Muuda</button>
        </div>
      </div>
    </template>
    <div class="w-16 items-center gap-2 px-2 sm:flex sm:w-32 sm:flex-row sm:justify-end sm:pr-5">
      <div v-if="isUserOwner" class="">
        <span class="btn btn-sm btn-circle btn-secondary" @click="edit = !edit">
          <Icon class="h-5 w-5 cursor-pointer" :name="edit ? 'tabler:edit-off' : 'tabler:edit'" />
        </span>
      </div>
      <CommentLike :event-id="comment.eventId" :comment-id="comment.id" :comment-likes="comment.commentLikes" @updated="emit('updated')"></CommentLike>
    </div>
  </div>
</template>

<script setup lang="ts">
import { purgeHtml, purifyHtml } from '~/lib/utils';

type EndpointComment = Awaited<ReturnType<typeof keskusFetch<'/api/events/:eventId/comments'>>>[number];

const props = defineProps({
  comment: {
    type: Object as PropType<EndpointComment>,
    required: true,
  },
});
const { userId } = useAuth();
const { isMobile } = useDevice();
const emit = defineEmits(['updated']);

const edit = ref(false);
const saving = ref(false);
const showErrors = ref(false);

const editableCommentBody = ref(props.comment.body || '');

const isUserOwner = computed(() => props.comment.userId === userId.value);
const purifiedBody = computed(() => purifyHtml(editableCommentBody.value));
const purgedBody = computed(() => purgeHtml(purifiedBody.value || ''));
const bodyValid = computed(() => purgedBody.value.length >= 1);

async function updateComment() {
  if (!bodyValid.value) {
    showErrors.value = true;
    return;
  }
  try {
    saving.value = true;
    await keskusFetch(`/api/events/${props.comment.eventId}/comments/${props.comment.id}`, {
      method: 'PATCH',
      body: {
        body: editableCommentBody.value,
      },
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
