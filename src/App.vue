<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import { isInteger, toInteger } from 'lodash'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { KIWI_APP_RECENT } from './lib/storageKeys'

const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  const hasLogin = await KiwiManager.shared.hasLogin()
  if (!hasLogin) router.replace('/login')
  else {
    const recentAppId = toInteger(localStorage.getItem(KIWI_APP_RECENT))
    if (recentAppId && isInteger(recentAppId)) {
      await KiwiApp.createByAppId(recentAppId)
      router.replace(`/${recentAppId}`)
    } else {
      router.replace('/')
    }
  }
  loading.value = false
})
</script>

<template>
  <a-config-provider :locale="enUS">
    <a-spin v-if="loading" class="fixed-center" />
    <router-view v-else />
  </a-config-provider>
</template>
