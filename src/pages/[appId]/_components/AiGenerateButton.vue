<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import { i18nKey, useI18nText } from '@/lib/i18n'
import { Message, Notification } from '@arco-design/web-vue'
import { Sparkles } from 'lucide-vue-next'
import { nextTick, ref, useTemplateRef, watch } from 'vue'

const t = useI18nText()
const $textarea = useTemplateRef<HTMLTextAreaElement>('$textarea')
const visible = ref(false)
const prompt = ref('')

watch(visible, async value => {
  if (!value) {
    prompt.value = ''
  } else {
    await nextTick()
    $textarea.value?.focus()
  }
})

async function handleExcuteAiGenerate() {
  const promptValue = prompt.value.trim()
  if (!promptValue) {
    Message.warning(t(i18nKey.placeholderPrompt))
    return false
  }
  await KiwiApp.current?.generateByAI(promptValue)
  Notification.success(t(i18nKey.generateCompletedTip))
  setTimeout(() => location.reload(), 2000)
  return true
}
</script>

<template>
  <div class="p-2">
    <a-button
      class="w-full gap-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-80"
      type="primary"
      @click="visible = true"
    >
      <template #icon>
        <Sparkles :size="16" />
      </template>
      <span>{{ $t(i18nKey.aiGenerateLabel) }}</span>
    </a-button>
  </div>

  <a-modal
    v-model:visible="visible"
    width="560px"
    :mask-closable="false"
    :title="$t(i18nKey.aiGenerateLabel)"
    :ok-text="$t(i18nKey.generateLabel)"
    :on-before-ok="handleExcuteAiGenerate"
  >
    <a-alert type="info">
      {{ $t(i18nKey.generateLongTimeTip) }}
    </a-alert>

    <a-textarea
      v-model="prompt"
      ref="$textarea"
      class="mt-4"
      :auto-size="{
        minRows: 4,
        maxRows: 10,
      }"
      :placeholder="$t(i18nKey.placeholderPrompt)"
    />
  </a-modal>
</template>
