<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import text from '@/lib/text'
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

const { loading, send: handleLogout } = useRequest(
  KiwiManager.shared.logout(),
  {
    immediate: false,
    async middleware(_ctx, next) {
      if (await showConfirm('logoutTip')) {
        await next()
        KiwiApp.current?.dispose()
        localStorage.removeItem(KIWI_APP_RECENT)
        location.reload()
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
    <span>{{ text.logoutLabel }}</span>
  </a-button>
</template>
