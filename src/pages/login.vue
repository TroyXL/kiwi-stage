<script setup lang="ts">
import Beian from '@/components/Beian.vue'
import { KIWI_CHAT_URL } from '@/kiwi/lib/constants'
import { i18nKey } from '@/lib/i18n'

const WELCOME_TO_KIWI = 'Welcome to KIWI'

async function handleLogin() {
  window.location.href =
    KIWI_CHAT_URL +
    `login?redirectUrl=${encodeURIComponent(window.location.origin)}`
}
</script>

<template>
  <div class="fixed-center flex flex-col items-center gap-4">
    <img src="/logo.png" alt="Kiwi Logo" class="size-24" />
    <p class="text-3xl font-medium">
      {{ WELCOME_TO_KIWI }}
    </p>
    <a-button class="!mt-4" type="primary" long @click="handleLogin">
      {{ $t(i18nKey.loginLabel) }}
    </a-button>
  </div>
  <Beian class="fixed bottom-4 left-1/2 -translate-x-1/2" />
</template>
