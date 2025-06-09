<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/controllers/useKiwiAppAndSchemaStore'
import { computed } from 'vue'
import ObjectDetail from './ObjectDetail.vue'
import ObjectActions from './ObjectTriggers.vue'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const showObjectPreview = computed(() => !!kiwiAppAndSchemaStore.selectedObject)
</script>

<template>
  <a-drawer
    hide-cancel
    unmount-on-close
    :width="480"
    :visible="showObjectPreview"
    @cancel="kiwiAppAndSchemaStore.showObjectPreview(null)"
  >
    <template #title> Record Detail </template>

    <template #footer>
      <div class="flex gap-2">
        <ObjectActions />
        <span class="flex-1" />
        <a-button @click="kiwiAppAndSchemaStore.showObjectPreview(null)">
          Cancel
        </a-button>
      </div>
    </template>

    <ObjectDetail v-if="!kiwiAppAndSchemaStore.isEditObject" />
  </a-drawer>
</template>
