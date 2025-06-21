<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'

defineOptions({
  name: 'ObjectDetail',
})

const props = defineProps<{
  data: KiwiObject
  asChild?: boolean
}>()

console.log('===== data =', props.data)

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const kiwiSchema = kiwiAppAndSchemaStore.kiwiApp?.getSchemaByQualifiedName(
  props.data.type
)
const columns = kiwiSchema?.tableColumns || []
const row = kiwiSchema?.transformObjectsToTableRows([props.data])[0]

const subObjects = Object.values(props.data?.children || {}).flat()
</script>

<template>
  <div :class="asChild ? 'pl-4' : ''">
    <p v-if="asChild && kiwiSchema" class="pl-4 border-l-4 mt-4 mb-2">
      <span class="font-medium">{{ kiwiSchema.label }}</span>
      <a-divider direction="vertical" />
      <span class="text-muted-foreground">{{ kiwiSchema.name }}</span>
    </p>
    <a-descriptions
      v-if="row"
      bordered
      class="p-4"
      table-layout="fixed"
      layout="vertical"
    >
      <a-descriptions-item
        v-for="column of columns"
        :key="column.dataIndex"
        :label="column.title"
      >
        <span>{{ row[column.dataIndex] ?? '-' }}</span>
      </a-descriptions-item>
    </a-descriptions>
  </div>

  <ObjectDetail
    v-for="subObject of subObjects"
    as-child
    :key="subObject.id"
    :data="subObject"
  />
</template>
