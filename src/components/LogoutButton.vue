<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import { showConfirm } from '@/lib/showConfirm'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
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
      if (await showConfirm('Confirm logout?')) {
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
  <a-button
    v-else
    class="space-x-1.5"
    :type="type"
    :loading="loading"
    @click="handleLogout"
  >
    <icon-export />
    <span>Logout</span>
  </a-button>
</template>
