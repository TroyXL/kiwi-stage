<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { computed } from 'vue'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const columns = kiwiAppAndSchemaStore.getKiwiSchema()?.tableColumns || []
const data = computed(() => kiwiAppAndSchemaStore.selectedObject.data)
</script>

<template>
  <a-descriptions v-if="data" class="p-4" :column="2">
    <a-descriptions-item v-for="column of columns" :label="column.title">
      <span>{{ data[column.dataIndex] }}</span>
    </a-descriptions-item>
  </a-descriptions>
</template>
