<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { KiwiApp, KiwiManager } from './lib/kiwi'

async function handleLoginKiwi() {
  const kiwiManager = await KiwiManager.create(
    {
      appId: 2,
      loginName: 'demo',
      password: '123456',
    },
    {
      autoFetchApps: false,
    }
  )

  /**
   * 简单应用 1000001018
   * 复杂应用 1000000010
   */
  const kiwiApp = await KiwiApp.createByAppId(1000000010)
}
</script>

<template>
  <Button size="sm" @click="handleLoginKiwi">Button</Button>
</template>
