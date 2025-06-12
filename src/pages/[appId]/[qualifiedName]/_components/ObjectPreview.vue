<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import ObjectDetail from './ObjectDetail.vue'
import ObjectTriggers from './ObjectTriggers.vue'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
</script>

<template>
  <a-page-header
    v-if="kiwiAppAndSchemaStore.selectedObject.id"
    class="fixed z-10 left-60 top-14 right-0 bottom-0 bg-background"
    title="Record Detail"
    @back="kiwiAppAndSchemaStore.showObjectPreview('')"
  >
    <template #extra>
      <div class="flex gap-2">
        <ObjectTriggers />
      </div>
    </template>

    <div
      v-if="kiwiAppAndSchemaStore.selectedObject.loading"
      class="flex justify-center"
    >
      <a-spin />
    </div>

    <ObjectDetail v-if="!kiwiAppAndSchemaStore.selectedObject.isEdit" />
  </a-page-header>
</template>
