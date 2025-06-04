<script setup lang="ts">
import { KiwiManager } from '@/kiwi'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await KiwiManager.shared.loginAsDemo()
  router.replace('/')
}
</script>

<template>
  <a-button
    class="fixed-center"
    type="primary"
    :loading="loading"
    @click="handleLogin"
    >Login as Demo</a-button
  >
</template>
