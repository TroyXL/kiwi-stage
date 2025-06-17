<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import type { KiwiTableRow } from '@/kiwi/schema/field'
import { useEmitter } from '@/lib/emitter'
import { i18nKey } from '@/lib/i18n'

import Scaffold from '@/pages/_components/Scaffold.vue'
import type { TableColumnData } from '@arco-design/web-vue'
import { usePagination } from 'alova/client'
import { computed, ref } from 'vue'
import ObjectEditor from './ObjectEditor.vue'

const props = defineProps<{
  qualifiedName: string
  isSelectMode?: boolean
  selectedId?: string
}>()

const emit = defineEmits<{
  showDetail: [id: string]
  select: [row: KiwiTableRow]
}>()

const ACTION_COLUMN: TableColumnData = {
  dataIndex: '__actions__',
  title: '',
  align: 'right',
  fixed: 'right',
  width: 60,
  slotName: 'actions',
}

const kiwiSchema = computed(() =>
  KiwiApp.current?.getSchemaByQualifiedName(props.qualifiedName)
)

const rowSelection = props.isSelectMode
  ? {
      type: 'radio',
      fixed: true,
      width: 40,
      defaultSelectedRowKeys: props.selectedId ? [props.selectedId] : void 0,
    }
  : void 0

const columns = computed<TableColumnData[]>(() => {
  if (!kiwiSchema.value) return []
  const tableColumns = kiwiSchema.value.tableColumns.map(column => ({
    ...column,
    fixed: column.field.summary ? 'left' : void 0,
    minWidth: 200,
    // width: column.field.summary ? void 0 : 200,
  }))
  return props.isSelectMode ? tableColumns : tableColumns.concat(ACTION_COLUMN)
})

const showObjectEditor = ref(false)

let newlyCreated: string | undefined = void 0

const {
  loading,
  data,
  page,
  pageSize,
  total,
  reload: handleResetObjectList,
  refresh: handleRefreshObjectList,
} = usePagination(
  (page, pageSize) => {
    const requestInstance = KiwiApp.current!.fetchObjects({
      page,
      pageSize,
      type: props.qualifiedName,
      newlyCreated,
    })
    newlyCreated = void 0
    return requestInstance
  },
  {
    total: response => response.total,
    data: response =>
      kiwiSchema.value?.transformObjectsToTableRows(response.items) ?? [],
    initialData: {
      total: 0,
      items: [],
    },
    initialPage: 1,
    initialPageSize: 10,
    watchingStates: [() => props.qualifiedName],
  }
)

function handleSelectRow(_: any, __: any, record: KiwiTableRow) {
  emit('select', record)
}

function handleRefreshObjectListWithNewlyCreated(newlyCreatedId?: string) {
  newlyCreated = newlyCreatedId
  handleRefreshObjectList()
}

useEmitter('refreshObjectList', handleRefreshObjectList)
</script>

<template>
  <Scaffold
    bodyClass="flex flex-col !p-0"
    :title="kiwiSchema?.label"
    :subtitle="qualifiedName"
  >
    <template #actions>
      <a-space>
        <a-button type="primary" @click="showObjectEditor = true">
          <template #icon>
            <icon-plus />
          </template>
          <span>{{ $t(i18nKey.createLabel) }}</span>
        </a-button>
        <a-button @click="handleResetObjectList">
          <template #icon>
            <icon-refresh />
          </template>
          <span>{{ $t(i18nKey.refreshLabel) }}</span>
        </a-button>
      </a-space>
    </template>

    <div class="h-0 flex-1 p-8 overflow-auto">
      <a-table
        stripe
        row-key="__id__"
        class="rounded-none"
        :loading="loading"
        :columns="columns"
        :data="data"
        :pagination="false"
        :sticky-header="-32"
        :row-selection="rowSelection"
        @select="handleSelectRow"
      >
        <template #actions="{ record }">
          <a-button
            type="text"
            class="hover:!bg-blue-100/80"
            @click="emit('showDetail', record.__id__)"
          >
            <template #icon>
              <icon-file />
            </template>
          </a-button>
        </template>
      </a-table>
    </div>

    <div
      class="flex px-8 py-4 border-t"
      :class="isSelectMode ? 'justify-between' : 'justify-end'"
    >
      <a-pagination
        v-model:current="page"
        :page-size="pageSize"
        :total="total"
        show-total
      />

      <slot name="footer" v-if="isSelectMode" />
    </div>
  </Scaffold>

  <ObjectEditor
    v-if="kiwiSchema"
    v-model:visible="showObjectEditor"
    :target-schema="kiwiSchema"
    @refresh="handleRefreshObjectListWithNewlyCreated"
  />
</template>
