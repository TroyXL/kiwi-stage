<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'

const props = defineProps<{
  data: KiwiObject
}>()

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const columns = kiwiAppAndSchemaStore.kiwiSchema?.tableColumns || []
const row = kiwiAppAndSchemaStore.kiwiSchema?.transformObjectsToTableRows([
  props.data,
])[0]
</script>

<template>
  <a-descriptions v-if="row" class="p-4" :column="3">
    <a-descriptions-item v-for="column of columns" :label="column.title">
      <span>{{ row[column.dataIndex] ?? '-' }}</span>
    </a-descriptions-item>
  </a-descriptions>
</template>
