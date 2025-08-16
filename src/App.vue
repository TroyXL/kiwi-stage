<script setup lang="ts">
import { KiwiManager } from '@/kiwi'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import { isPlainObject, mapValues } from 'lodash'
import { onMounted, ref } from 'vue'
;(function replaceOkInEnLang(obj: Record<string, any>) {
  mapValues(obj, (value, key) => {
    if (isPlainObject(value)) {
      replaceOkInEnLang(value)
    } else if (value === 'Ok') {
      obj[key] = 'OK'
    }
  })
})(enUS)

const loading = ref(true)

onMounted(async () => {
  await KiwiManager.shared.loginByCode()
  loading.value = false
})
</script>

<template>
  <a-config-provider global :locale="enUS">
    <a-spin v-if="loading" class="fixed-center" />
    <router-view v-else />
  </a-config-provider>
</template>
