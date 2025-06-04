<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { KiwiManager } from '@/kiwi'
import { onMounted } from 'vue'

onMounted(async () => {
  const res = await KiwiManager.shared.listApps()
})
</script>

<template>
  <div class="flex justify-center items-center full-screen bg-muted">
    <a-page-header
      class="w-[720px] rounded-md bg-background"
      title="Select a Kiwi App"
      :show-back="false"
    >
      <template #extra>
        <LogoutButton />
      </template>

      <div>123</div>
    </a-page-header>
  </div>
</template>
