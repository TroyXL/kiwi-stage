<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiApp, KiwiClassSchema } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { toInteger } from 'lodash'
import { ArrowRightLeft, Shapes } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

function handleClickMenuItem() {}
</script>

<template>
  <a-spin class="fixed-center" v-if="loading" />
  <a-layout class="full-screen" v-else>
    <a-layout-sider>
      <div class="px-2 mb-2">
        <h1 class="!text-xl">Kiwi</h1>
        <a-button
          class="w-full !justify-between gap-2"
          type="outline"
          @click="handleSwitchApp"
        >
          <span class="font-medium">{{ appInfo!.name }}</span>
          <ArrowRightLeft :size="14" />
        </a-button>
      </div>
      <a-menu class="w-full" @menu-item-click="handleClickMenuItem">
        <a-menu-item
          v-for="classSchema in kiwiClasses"
          :key="classSchema.qualifiedName"
          class="flex gap-2 items-center"
        >
          <Shapes :size="16" />
          <div class="leading-snug py-1">
            <p class="font-bold">{{ classSchema.label }}</p>
            <p class="text-xs">{{ classSchema.qualifiedName }}</p>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="h-11 border-b flex justify-between items-center px-4"
      >
        <div></div>
        <div class="flex items-center gap-2">
          <LogoutButton only-icon />
        </div>
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
