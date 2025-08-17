<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import { useEmitter } from '@/lib/emitter'
import { i18nKey } from '@/lib/i18n'

import Scaffold from '@/pages/_components/Scaffold.vue'
import type { TableColumnData } from '@arco-design/web-vue'
import { usePagination } from 'alova/client'
import { computed, ref } from 'vue'
import ObjectEditor from './objectEditor/Index.vue'

const props = defineProps<{
  qualifiedName: string
  selectMode?: 'single' | 'multiple'
  selectedValue?: string[]
}>()

const emit = defineEmits<{
  showDetail: [id: string]
  select: [ids: string[]]
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

const isMultipleSelect = props.selectMode === 'multiple'
const rowSelection = props.selectMode
  ? {
      type: isMultipleSelect ? 'checkbox' : 'radio',
      fixed: true,
      width: 40,
      defaultSelectedRowKeys: props.selectedValue,
    }
  : void 0

const columns = computed<TableColumnData[]>(() => {
  if (!kiwiSchema.value) return []
  const tableColumns = kiwiSchema.value.tableColumns.map(column => ({
    ...column,
    fixed: column.field.summary ? 'left' : void 0,
    minWidth: 200,
    ellipsis: true,
    tooltip: true,
    // width: column.field.summary ? void 0 : 200,
  }))
  return props.selectMode ? tableColumns : tableColumns.concat(ACTION_COLUMN)
})

const showObjectEditor = ref(false)

let newlyCreatedId: string | undefined = void 0

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
      criteria: {},
      newlyCreatedId,
    })
    newlyCreatedId = void 0
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

function handleSelecionChange(ids: string[]) {
  emit('select', ids)
}

function handleRefreshObjectListWithNewlyCreated(_newlyCreatedId?: string) {
  newlyCreatedId = _newlyCreatedId
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
        @selection-change="handleSelecionChange"
      >
        <template #actions="{ record }">
          <a-button
            type="text"
            class="hover:!bg-blue-100/80 dark:hover:!bg-muted"
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
      :class="selectMode ? 'justify-between' : 'justify-end'"
    >
      <a-pagination
        v-model:current="page"
        :page-size="pageSize"
        :total="total"
        show-total
      />

      <slot name="footer" v-if="selectMode" />
    </div>
  </Scaffold>

  <ObjectEditor
    v-if="kiwiSchema"
    v-model:visible="showObjectEditor"
    :target-schema="kiwiSchema"
    @refresh="handleRefreshObjectListWithNewlyCreated"
  />
</template>
