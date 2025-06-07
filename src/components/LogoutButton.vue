<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { Modal } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { LogOut } from 'lucide-vue-next'
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
      Modal.confirm({
        title: 'Confirm logout?',
        content: '',
        async onOk() {
          await next()
          KiwiApp.current?.dispose()
          localStorage.removeItem(KIWI_APP_RECENT)
          location.reload()
        },
      })
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
      <LogOut :size="14" />
    </template>
  </a-button>
  <a-button
    v-else
    class="space-x-1.5"
    :type="type"
    :loading="loading"
    @click="handleLogout"
  >
    <LogOut :size="14" />
    <span>Logout</span>
  </a-button>
</template>
