<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import { TableColumnData } from '@arco-design/web-vue'
import { usePagination } from 'alova/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute('/[appId]/[qualifiedName]')
const params = computed(() => route.params)

const columns = computed<TableColumnData[]>(() => {
  const kiwiClassSchema = KiwiApp.current!.getSchemaByQualifiedName(
    params.value.qualifiedName
  )
  if (!kiwiClassSchema) return []

  return kiwiClassSchema.transformFieldsToTableColumns()
})

const {
  loading,
  data,
  page,
  pageSize,
  pageCount,
  total,
  reload: reloadObjectList,
} = usePagination(
  (page, pageSize) =>
    KiwiApp.current!.fetchObjects({
      page,
      pageSize,
      type: params.value.qualifiedName,
    }),
  {
    total: response => response.total,
    data: response => response.items,
    initialData: {
      total: 0,
      data: [],
      pageCount: 1,
    },
    initialPage: 1,
    initialPageSize: 20,
    watchingStates: [params],
  }
)
</script>

<template>
  <div class="p-4">
    <div>{{ params.appId }}</div>
    <div>{{ params.qualifiedName }}</div>

    <a-table
      :columns="columns"
      :data="data"
      :pagination="{
        page,
        pageSize,
        total,
      }"
    />
  </div>
</template>
