<script setup lang="ts">
import KiwiLogo from '@/components/KiwiLogo.vue'
import LogoutButton from '@/components/LogoutButton.vue'
import { useSwitchKiwiApp } from '@/hooks/useSwitchKiwiApp'
import { KiwiSchema } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { toInteger } from 'lodash'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AiGenerateButton from './[appId]/_components/AiGenerateButton.vue'
import KiwiAppInfo from './[appId]/_components/KiwiAppInfo.vue'

const router = useRouter()
const route = useRoute('/[appId]/[qualifiedName]/')
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const gotoKiwiAppList = useSwitchKiwiApp()

const params = computed(() => route.params)
const loading = ref(true)
const appInfo = ref<KiwiAppInfo | null>(null)
const kiwiClasses = ref<KiwiSchema[]>([])

onMounted(async () => {
  const { appId } = params.value
  try {
    const kiwiApp = await kiwiAppAndSchemaStore.switchKiwiApp(toInteger(appId))
    appInfo.value = kiwiApp.appInfo
    kiwiClasses.value = kiwiApp.rootClassSchemas
    loading.value = false
  } catch (error) {
    gotoKiwiAppList()
    console.error(error)
  }
})

onUnmounted(() => {
  kiwiAppAndSchemaStore.disposeKiwiApp()
})

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
        <KiwiLogo />
        <h1 class="!text-xl pl-2">Kiwi App</h1>
        <KiwiAppInfo v-model:app-info="appInfo" />
      </div>
      <a-space>
        <AiGenerateButton />
        <LogoutButton only-icon />
      </a-space>
    </a-layout-header>
    <a-layout class="h-0">
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
        <router-view v-slot="{ Component }">
          <keep-alive include="KiwiObjectsPage">
            <component :is="Component" />
          </keep-alive>
        </router-view>
        <a-empty v-if="!params.qualifiedName" class="mt-48">
          <template #image>
            <icon-compass />
          </template>
          {{ $t(i18nKey.selectObjectTip) }}
        </a-empty>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
