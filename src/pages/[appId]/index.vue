<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiApp, KiwiClassSchema, KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { sleep } from '@/lib/utils'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { toInteger } from 'lodash'
import { ArrowRightLeft, Shapes, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import KiwiAppInfo from './_components/KiwiAppInfo.vue'

const router = useRouter()
const route = useRoute()

const { appId } = route.params as { appId: string }

const loading = ref(true)
const appInfo = ref<KiwiAppInfo | null>(null)
const kiwiClasses = ref<KiwiClassSchema[]>([])

onMounted(async () => {
  localStorage.setItem(KIWI_APP_RECENT, appId)
  const kiwiApp = await KiwiApp.createByAppId(toInteger(appId))
  appInfo.value = await kiwiApp.fetchAppInfo()
  await kiwiApp.setupSchemaPool()
  kiwiClasses.value = kiwiApp.rootClassSchemas
  loading.value = false
})

function handleSwitchApp() {
  localStorage.removeItem(KIWI_APP_RECENT)
  router.replace('/')
}

const { loading: deleteLoading, send: handleDeleteApp } = useRequest(
  KiwiManager.shared.deleteApp(toInteger(appId)),
  {
    immediate: false,
    async middleware(_ctx, next) {
      await next()
      Message.success('App deleted')
      await sleep(1000)
      handleSwitchApp()
    },
  }
)

function handleClickMenuItem() {}
</script>

<template>
  <a-spin class="fixed-center" v-if="loading" />
  <a-layout class="full-screen" v-else>
    <a-layout-header
      class="h-14 border-b flex justify-between items-center px-4"
    >
      <div class="flex items-center gap-2">
        <h1 class="!text-xl">Kiwi App</h1>
        <KiwiAppInfo v-model:app-info="appInfo" />
      </div>
      <div class="flex items-center gap-2">
        <a-popconfirm
          type="warning"
          content="Confirm delete this app?"
          @ok="handleDeleteApp"
        >
          <a-button type="text" status="danger" :loading="deleteLoading">
            <template #icon>
              <Trash2 :size="14" />
            </template>
          </a-button>
        </a-popconfirm>

        <a-button type="text" @click="handleSwitchApp">
          <template #icon>
            <ArrowRightLeft :size="14" />
          </template>
        </a-button>

        <LogoutButton only-icon />
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider class="!w-60 border-r !shadow-none">
        <a-menu class="w-full" @menu-item-click="handleClickMenuItem">
          <a-menu-item
            v-for="classSchema in kiwiClasses"
            :key="classSchema.qualifiedName"
            class="flex gap-2 items-center !rounded-md transition-colors"
          >
            <Shapes :size="16" />
            <div class="leading-snug text-xs py-1.5">
              <p class="font-medium">{{ classSchema.label }}</p>
              <p>{{ classSchema.qualifiedName }}</p>
            </div>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
