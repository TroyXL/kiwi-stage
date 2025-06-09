<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { TableColumnData } from '@arco-design/web-vue'
import { usePagination } from 'alova/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MethodInvoker from './[qualifiedName]/_components/MethodInvoker.vue'
import ObjectPreview from './[qualifiedName]/_components/ObjectPreview.vue'

const ACTION_COLUMN: TableColumnData = {
  dataIndex: '__actions__',
  title: '',
  align: 'right',
  fixed: 'right',
  width: 100,
  slotName: 'actions',
}

const route = useRoute('/[appId]/[qualifiedName]')
const params = computed(() => route.params)
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const kiwiClassSchema = computed(() =>
  kiwiAppAndSchemaStore.switchKiwiClassSchema(params.value.qualifiedName)
)
const columns = computed<TableColumnData[]>(() => {
  if (!kiwiClassSchema.value) return []
  return kiwiClassSchema.value.tableColumns
    .map(column => ({
      ...column,
      fixed: column.field.summary ? 'left' : void 0,
      minWidth: 200,
      // width: column.field.summary ? void 0 : 200,
    }))
    .concat(ACTION_COLUMN)
})

const {
  loading,
  data,
  page,
  pageSize,
  total,
  reload: handleReloadObjectList,
} = usePagination(
  (page, pageSize) =>
    KiwiApp.current!.fetchObjects({
      page,
      pageSize,
      type: params.value.qualifiedName,
    }),
  {
    total: response => response.total,
    data: response =>
      kiwiClassSchema.value?.transformObjectsToTableRows(response.items) ?? [],
    initialData: {
      total: 0,
      items: [],
    },
    initialPage: 1,
    initialPageSize: 20,
    watchingStates: [params],
  }
)
</script>

<template>
  <a-page-header
    :show-back="false"
    :title="kiwiClassSchema?.label"
    :subtitle="params.qualifiedName"
  >
    <template #extra>
      <a-space>
        <a-button type="primary">
          <template #icon>
            <icon-plus />
          </template>
          <span>Add</span>
        </a-button>

        <a-button @click="handleReloadObjectList">
          <template #icon>
            <icon-refresh />
          </template>
          <span>Refresh</span>
        </a-button>
      </a-space>
    </template>

    <a-table
      stripe
      row-key="__id__"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pagination="{
        page,
        pageSize,
        total,
      }"
    >
      <template #actions="{ record }">
        <a-button
          type="text"
          class="hover:!bg-blue-100/80"
          @click="kiwiAppAndSchemaStore.showObjectPreview(record)"
        >
          <template #icon>
            <icon-file />
          </template>
        </a-button>
        <a-button type="text" class="hover:!bg-blue-100/80">
          <template #icon>
            <icon-pen />
          </template>
        </a-button>
      </template>
    </a-table>
  </a-page-header>
  <ObjectPreview />
  <MethodInvoker />
</template>
