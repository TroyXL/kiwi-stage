<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiApp, KiwiClassSchema, KiwiManager } from '@/kiwi'
import { showConfirm } from '@/lib/showConfirm'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { toInteger } from 'lodash'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import KiwiAppInfo from './[appId]/_components/KiwiAppInfo.vue'

const router = useRouter()
const route = useRoute('/[appId]/[qualifiedName]')

const params = computed(() => route.params)
const loading = ref(true)
const appInfo = ref<KiwiAppInfo | null>(null)
const kiwiClasses = ref<KiwiClassSchema[]>([])

onMounted(async () => {
  const { appId } = params.value
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
  KiwiManager.shared.deleteApp(toInteger(params.value.appId)),
  {
    immediate: false,
    async middleware(_ctx, next) {
      if (await showConfirm('Confirm delete this app?')) {
        await next()
        Message.success(`App <${appInfo.value!.name}> deleted`)
        handleSwitchApp()
      }
    },
  }
)

function handleClickMenuItem(selectedQualifiedName: string) {
  const { appId, qualifiedName } = params.value
  if (qualifiedName === selectedQualifiedName) return
  router.replace(`/${appId}/${selectedQualifiedName}`)
}
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
        <a-button
          type="text"
          status="danger"
          :loading="deleteLoading"
          @click="handleDeleteApp"
        >
          <template #icon>
            <icon-delete />
          </template>
        </a-button>

        <a-button type="text" @click="handleSwitchApp">
          <template #icon>
            <icon-swap />
          </template>
        </a-button>

        <LogoutButton only-icon />
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider class="!w-60 border-r !shadow-none">
        <a-menu
          class="w-full py-1"
          :default-selected-keys="[params.qualifiedName]"
          @menu-item-click="handleClickMenuItem"
        >
          <a-menu-item
            v-for="classSchema in kiwiClasses"
            :key="classSchema.qualifiedName"
            class="flex items-center !rounded-md transition-colors"
          >
            <icon-compass size="18" />
            <div class="leading-snug text-xs py-1.5">
              <p class="font-medium">{{ classSchema.label }}</p>
              <p>{{ classSchema.qualifiedName }}</p>
            </div>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content>
        <router-view />
        <a-empty v-if="!params.qualifiedName" class="mt-48">
          <template #image>
            <icon-compass />
          </template>
          Select an object from the left menu to start
        </a-empty>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
