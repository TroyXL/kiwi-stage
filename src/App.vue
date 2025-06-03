<script setup lang="ts">
import { KiwiApp } from '@/kiwi'

async function handleLoginKiwi() {
  // const kiwiManager = await KiwiManager.create(
  //   {
  //     loginName: 'demo',
  //     password: '123456',
  //   }
  // )

  /**
   * 简单应用 1000001018
   * 复杂应用 1000000010
   */
  const kiwiApp = await KiwiApp.createByAppId(1000000010)
}
</script>

<template>
  <a-button type="primary" @click="handleLoginKiwi">Login Kiwi</a-button>
</template>
