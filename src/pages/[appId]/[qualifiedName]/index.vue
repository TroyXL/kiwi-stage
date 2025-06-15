<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import { useEmitter } from '@/lib/emitter'
import text from '@/lib/text'
import Scaffold from '@/pages/_components/Scaffold.vue'
import {
  useKiwiAppAndSchemaStore,
  useKiwiSchemaByRouteAndGetParams,
} from '@/stores/useKiwiAppAndSchemaStore'
import { TableColumnData } from '@arco-design/web-vue'
import { usePagination } from 'alova/client'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'KiwiObjectsPage',
})

const ACTION_COLUMN: TableColumnData = {
  dataIndex: '__actions__',
  title: '',
  align: 'right',
  fixed: 'right',
  width: 60,
  slotName: 'actions',
}

const router = useRouter()
const params = useKiwiSchemaByRouteAndGetParams()
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const kiwiSchema = computed(() => kiwiAppAndSchemaStore.kiwiSchema)
const qualifiedName = computed(() => kiwiAppAndSchemaStore.qualifiedName)

const columns = computed<TableColumnData[]>(() => {
  if (!kiwiSchema.value) return []
  return kiwiSchema.value.tableColumns
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
  reload: handleResetObjectList,
  send: handleRefreshObjectList,
} = usePagination(
  (page, pageSize) =>
    KiwiApp.current!.fetchObjects({
      page,
      pageSize,
      type: qualifiedName.value,
    }),
  {
    total: response => response.total,
    data: response =>
      kiwiAppAndSchemaStore.kiwiSchema?.transformObjectsToTableRows(
        response.items
      ) ?? [],
    initialData: {
      total: 0,
      items: [],
    },
    initialPage: 1,
    initialPageSize: 10,
    watchingStates: [qualifiedName],
  }
)

function handleShowObjectDetail(objectId: string) {
  router.replace({
    name: '/[appId]/[qualifiedName]/[objectId]/',
    params: {
      ...params.value,
      objectId,
    },
  })
}

function handlePageChange(nextPage: number) {
  page.value = nextPage
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
        <a-button type="primary">
          <template #icon>
            <icon-plus />
          </template>
          <span>{{ text.createLabel }}</span>
        </a-button>

        <a-button @click="handleResetObjectList">
          <template #icon>
            <icon-refresh />
          </template>
          <span>{{ text.refreshLabel }}</span>
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
        @page-change="handlePageChange"
      >
        <template #actions="{ record }">
          <a-button
            type="text"
            class="hover:!bg-blue-100/80"
            @click="handleShowObjectDetail(record.__id__)"
          >
            <template #icon>
              <icon-file />
            </template>
          </a-button>
        </template>
      </a-table>
    </div>

    <div class="flex justify-end px-8 py-4 border-t">
      <a-pagination
        v-model:current="page"
        :page-size="pageSize"
        :total="total"
        show-total
      />
    </div>
  </Scaffold>
</template>
