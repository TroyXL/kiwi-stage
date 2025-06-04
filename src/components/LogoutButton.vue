<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { LogOut } from 'lucide-vue-next'
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'primary' | 'secondary'>,
    default: 'primary',
  },
  onlyIcon: Boolean,
})

async function handleLogout() {
  await KiwiManager.shared.logout()
  KiwiApp.current?.dispose()
  localStorage.removeItem(KIWI_APP_RECENT)
  location.reload()
}
</script>

<template>
  <a-button v-if="onlyIcon" :type="type" @click="handleLogout">
    <template #icon>
      <LogOut :size="14" />
    </template>
  </a-button>
  <a-button v-else class="space-x-1.5" :type="type" @click="handleLogout">
    <LogOut :size="14" />
    <span>Logout</span>
  </a-button>
</template>
