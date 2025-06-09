<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const columns = kiwiAppAndSchemaStore.getKiwiSchema()?.tableColumns || []
const data = kiwiAppAndSchemaStore.selectedObject
</script>

<template>
  <a-descriptions v-if="data" class="p-4" :column="2">
    <a-descriptions-item v-for="column of columns" :label="column.title">
      <span>{{ data[column.dataIndex] }}</span>
    </a-descriptions-item>
  </a-descriptions>
</template>
