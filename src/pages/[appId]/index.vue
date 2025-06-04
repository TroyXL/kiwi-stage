<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import SwitchKiwiApp from '@/components/SwitchKiwiApp.vue'
import { KiwiApp, KiwiClassSchema } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { toInteger } from 'lodash'
import { Shapes } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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

function handleClickMenuItem() {}
</script>

<template>
  <a-spin class="fixed-center" v-if="loading" />
  <a-layout class="full-screen" v-else>
    <a-layout-sider>
      <div class="px-2 mb-2">
        <h1 class="!text-xl px-2">Kiwi App</h1>
        <SwitchKiwiApp :app-info="appInfo" />
      </div>
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
