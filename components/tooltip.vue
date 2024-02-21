<template>
  <ClientOnly>
    <component :is="!disabled ? 'VTooltip' : 'div'" :class="props.class" @show="emit('show')" @hide="emit('hide')">
      <slot />
      <template #popper>
        <div class="text-sm">
          <slot name="tooltip"></slot>
        </div>
      </template>
    </component>
  </ClientOnly>
</template>

<script setup lang="ts">
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
