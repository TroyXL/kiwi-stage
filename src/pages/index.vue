<script setup lang="ts">
import KiwiLogo from '@/components/KiwiLogo.vue'
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiManager } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import CreateKiwiApp from '@/pages/_components/CreateKiwiApp.vue'
import { usePagination } from 'alova/client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCreateMode = ref(false)
const searchText = ref('')
let newlyCreatedId: string | undefined = void 0

const {
  loading,
  data,
  page,
  pageSize,
  total,
  reload: reloadAppList,
} = usePagination(
  (page, pageSize) => {
    const request = KiwiManager.shared.listApps({
      page,
      pageSize,
      searchText: searchText.value.trim(),
      newlyCreatedId,
    })
    newlyCreatedId = void 0
    return request
  },
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

function openApp(appId: number) {
  router.replace(`/${appId}`)
}

function handleCreateModeChange(createMode: boolean) {
  isCreateMode.value = createMode
}

function handleCreatedKiwiApp(_newlyCreatedId?: string) {
  newlyCreatedId = _newlyCreatedId
  reloadAppList()
}
</script>

<template>
  <div class="flex justify-center items-center full-screen bg-muted">
    <a-page-header
      class="w-[640px] rounded-md bg-background shadow-2xl !pb-0"
      :show-back="false"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <KiwiLogo />
          <h1 class="!text-xl pl-2 leading-none">
            {{ $t(i18nKey.selectKiwiApp) }}
          </h1>
        </div>
      </template>
      <template #extra>
        <CreateKiwiApp
          @mode-changed="handleCreateModeChange"
          @created="handleCreatedKiwiApp"
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
        v-model="searchText"
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
