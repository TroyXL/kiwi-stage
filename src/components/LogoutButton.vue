<script setup lang="ts">
import { gotoKiwiLogin, KiwiApp, KiwiManager } from '@/kiwi'
import { i18nKey, useI18nText } from '@/lib/i18n'
import { showConfirm } from '@/lib/userInterface'
import { useRequest } from 'alova/client'
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'primary' | 'secondary'>,
    default: 'primary',
  },
  onlyIcon: Boolean,
})

const t = useI18nText()

const { loading, send: handleLogout } = useRequest(
  KiwiManager.shared.logout(),
  {
    immediate: false,
    async middleware(_ctx, next) {
      if (await showConfirm(t(i18nKey.logoutTip))) {
        await next()
        KiwiApp.current?.dispose()
        gotoKiwiLogin()
      }
    },
  }
)
</script>

<template>
  <a-button
    v-if="onlyIcon"
    :type="type"
    :loading="loading"
    @click="handleLogout"
  >
    <template #icon>
      <icon-export />
    </template>
  </a-button>
  <a-button v-else :type="type" :loading="loading" @click="handleLogout">
    <template #icon>
      <icon-export />
    </template>
    <span>{{ $t(i18nKey.logoutLabel) }}</span>
  </a-button>
</template>
