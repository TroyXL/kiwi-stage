<script setup lang="ts">
import { KiwiManager } from '@/kiwi'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import { isInteger, isPlainObject, mapValues, toInteger } from 'lodash'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage } from './lib/storage'
;(function replaceOkInEnLang(obj: Record<string, any>) {
  mapValues(obj, (value, key) => {
    if (isPlainObject(value)) {
      replaceOkInEnLang(value)
    } else if (value === 'Ok') {
      obj[key] = 'OK'
    }
  })
})(enUS)

const router = useRouter()
const loading = ref(true)

function getRecentAppIdFromUrlOrStorage() {
  const pathname = location.pathname
  const urlAppId = toInteger(pathname.split('/')[1])
  if (isInteger(urlAppId)) return urlAppId
  const storageAppId = toInteger(getStorage('kiwi:app:recent'))
  if (isInteger(storageAppId)) return storageAppId
}

onMounted(async () => {
  const hasLogin = await KiwiManager.shared.hasLogin()
  loading.value = false
  if (!hasLogin) router.replace('/login')
  else {
    const recentAppId = getRecentAppIdFromUrlOrStorage()
    if (!recentAppId) {
      router.replace('/')
      return
    }
    if (location.pathname === '/') router.replace(`/${recentAppId}`)
  }
})
</script>

<template>
  <a-config-provider global :locale="enUS">
    <a-spin v-if="loading" class="fixed-center" />
    <router-view v-else />
  </a-config-provider>
</template>
