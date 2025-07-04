<script setup lang="ts">
import { KiwiManager } from '@/kiwi'
import { IS_PRODUCTION } from '@/lib/constants'
import { i18nKey } from '@/lib/i18n'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const targetClickContent = 'WELCOMETOKIWI'.split('').reverse().join('')
const welcomeChars = 'Welcome to KIWI'.split('')

async function handleLogin() {
  loading.value = true
  await KiwiManager.shared.loginAsDemo()
  router.replace('/')
}

let clickedChars: string[] = []
function handleLoginByDbClickLogo() {
  const clickedContent = clickedChars.join('').toUpperCase()
  clickedChars = []
  if (clickedContent === targetClickContent) handleLogin()
}
function handleClickChar(char: string) {
  clickedChars.push(char)
}
</script>

<template>
  <div v-if="IS_PRODUCTION" class="fixed-center flex flex-col items-center">
    <img
      src="/logo.png"
      alt="Kiwi Logo"
      class="size-24"
      @dblclick="handleLoginByDbClickLogo"
    />
    <p class="text-3xl font-medium">
      <span
        v-for="(char, index) in welcomeChars"
        :key="index"
        class="px-1"
        @click="handleClickChar(char)"
        >{{ char }}</span
      >
    </p>
  </div>
  <a-button
    v-else
    class="fixed-center"
    type="primary"
    :loading="loading"
    @click="handleLogin"
  >
    {{ $t(i18nKey.loginLabel) }}
  </a-button>
</template>
