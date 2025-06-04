<script setup lang="ts">
import { KiwiApp, KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'

async function handleLogout() {
  await KiwiManager.shared.logout()
  KiwiApp.current?.dispose()
  localStorage.removeItem(KIWI_APP_RECENT)
  location.reload()
}
</script>

<template>
  <a-button type="primary" @click="handleLogout"> Logout </a-button>
</template>
