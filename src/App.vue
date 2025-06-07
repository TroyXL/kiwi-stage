<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import { isInteger, isPlainObject, mapValues, toInteger } from 'lodash'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { KIWI_APP_RECENT } from './lib/storageKeys'
;(function replaceOkInEnLang(obj: Record<string, any>) {
  mapValues(obj, (value, key) => {
    if (isPlainObject(value)) {
      replaceOkInEnLang(value)
    } else if (value === 'Ok') {
      obj[key] = 'OK'
    }
  })
})(enUS)
// console.log('enUS', enUS)

const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  const hasLogin = await KiwiManager.shared.hasLogin()
  if (!hasLogin) router.replace('/login')
  else {
    const recentAppId = toInteger(localStorage.getItem(KIWI_APP_RECENT))

    if (!recentAppId || !isInteger(recentAppId)) {
      router.replace('/')
      return
    }

    await KiwiApp.createByAppId(recentAppId)
    if (location.pathname === '/') router.replace(`/${recentAppId}`)
  }
  loading.value = false
})
</script>

<template>
  <a-config-provider global :locale="enUS">
    <a-spin v-if="loading" class="fixed-center" />
    <router-view v-else />
  </a-config-provider>
</template>
