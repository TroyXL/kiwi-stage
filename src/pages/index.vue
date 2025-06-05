<script setup lang="ts">
import CreateKiwiApp from '@/components/CreateKiwiApp.vue'
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiManager } from '@/kiwi'
import { usePagination } from 'alova/client'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCreateMode = ref(false)
const { loading, data, page, pageSize, pageCount, total, reload } =
  usePagination(
    (page, pageSize) => KiwiManager.shared.listApps(page, pageSize),
    {
      total: response => response.total,
      data: response => response.items,
      initialData: {
        total: 0,
        data: [],
        pageCount: 1,
      },
      initialPage: 1,
      initialPageSize: 5,
    }
  )

onMounted(async () => {
  const {} = await KiwiManager.shared.listApps()
})

function openApp(appId: number) {
  router.replace(`/${appId}`)
}

function handleCreateModeChange(createMode: boolean) {
  isCreateMode.value = createMode
}
</script>

<template>
  <div class="flex justify-center items-center full-screen bg-muted">
    <a-page-header
      class="w-[640px] rounded-md bg-background shadow-2xl !pb-0"
      title="Select a Kiwi App"
      :show-back="false"
    >
      <template #extra>
        <CreateKiwiApp
          @mode-changed="handleCreateModeChange"
          @created="reload"
        />
        <LogoutButton
          v-if="!isCreateMode"
          small
          class="!ml-2"
          type="secondary"
        />
      </template>

      <div class="relative h-[300px]">
        <a-spin class="absolute-center" v-if="loading" />
        <a-list v-if="data.length">
          <a-list-item v-for="item in data" :key="item.id">
            <a-list-item-meta :title="item.name" />
            <template #actions>
              <a-button size="mini" @click="openApp(item.id)">Open</a-button>
            </template>
          </a-list-item>
        </a-list>
      </div>

      <div class="flex justify-end mt-4" v-if="pageCount! > 1">
        <a-pagination
          v-model:current="page"
          :page-size="pageSize"
          :total="total"
          show-total
          simple
        />
      </div>
    </a-page-header>
  </div>
</template>
