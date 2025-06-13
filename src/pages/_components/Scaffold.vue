<script setup lang="ts">
defineProps({
  title: {
    type: String,
    reqired: true,
  },
  subtitle: String,
  showBack: {
    type: Boolean,
    default: false,
  },
  bodyClass: String,
})

const emit = defineEmits(['back'])
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <a-page-header
      :show-back="showBack"
      :title="title"
      :subtitle="subtitle"
      @back="emit('back')"
    >
      <template #extra>
        <slot name="actions" />
      </template>
    </a-page-header>

    <div class="h-0 flex-1 p-8 border-t overflow-auto" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>
