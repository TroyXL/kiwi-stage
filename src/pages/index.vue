<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiManager } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import CreateKiwiApp from '@/pages/_components/CreateKiwiApp.vue'
import { usePagination } from 'alova/client'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCreateMode = ref(false)
const searchText = ref('')

const {
  loading,
  data,
  page,
  pageSize,
  total,
  reload: reloadAppList,
} = usePagination(
  (page, pageSize) =>
    KiwiManager.shared.listApps({
      page,
      pageSize,
      searchText: searchText.value,
    }),
  {
    total: response => response.total,
    data: response => response.items,
    initialData: {
      total: 0,
      items: [],
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
      :title="$t(i18nKey.selectKiwiApp)"
      :show-back="false"
    >
      <template #extra>
        <CreateKiwiApp
          @mode-changed="handleCreateModeChange"
          @created="reloadAppList"
        />
        <LogoutButton
          v-if="!isCreateMode"
          small
          class="!ml-2"
          type="secondary"
        />
      </template>

      <a-input-search
        search-button
        allow-clear
        v-model.trim="searchText"
        :placeholder="$t(i18nKey.placeholderSearchKeyword)"
        @clear="reloadAppList"
        @search="reloadAppList"
        @press-enter="reloadAppList"
      />

      <div class="relative min-h-[300px] mt-4">
        <a-spin class="absolute-center" v-if="loading" />
        <a-list v-if="data.length" class="bg-background">
          <a-list-item v-for="item in data" :key="item.id">
            <a-list-item-meta :title="item.name" />
            <template #actions>
              <a-button size="mini" @click="openApp(item.id)">{{
                $t(i18nKey.openLabel)
              }}</a-button>
            </template>
          </a-list-item>
        </a-list>
      </div>

      <div class="flex justify-end mt-4">
        <a-pagination
          v-model:current="page"
          :page-size="pageSize"
          :total="total"
          show-total
          hide-on-single-page
          simple
        />
      </div>
    </a-page-header>
  </div>
</template>
