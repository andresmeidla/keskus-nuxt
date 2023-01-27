<template>
  <component :is="!disabled ? 'VTooltip' : 'div'" :class="props.class" @show="emit('show')" @hide="emit('hide')">
    <slot />
    <template #popper>
      <slot name="tooltip"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  position: {
    type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['show', 'hide']);
</script>
