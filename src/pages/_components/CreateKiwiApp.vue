<script setup lang="ts">
import { useEditKiwiAppName } from '@/hooks/useEditKiwiAppName'
import { KiwiManager } from '@/kiwi'
import { sleep } from '@/lib/utils'
import { nextTick, ref, useTemplateRef } from 'vue'

const emit = defineEmits<{
  created: []
  modeChanged: [isCreateMode: boolean]
}>()

const $input = useTemplateRef<HTMLInputElement>('$input')
const isCreateMode = ref(false)
const loading = ref(false)
const appName = useEditKiwiAppName()

async function handleClickCreate() {
  isCreateMode.value = true
  await nextTick()
  $input.value?.focus()
  emit('modeChanged', isCreateMode.value)
}

function handleCancelCreate() {
  isCreateMode.value = false
  appName.value = ''
  emit('modeChanged', isCreateMode.value)
}

async function handleConfirmCreate() {
  const comfirmedAppName = appName.value.trim()
  if (comfirmedAppName) {
    loading.value = true
    await KiwiManager.shared
      .createOrUpdateApp({
        name: comfirmedAppName,
      })
      // 延迟1秒，否则列表接口无法立即查询到新创建的应用
      .then(() => sleep(1000))
      .finally(() => {
        loading.value = false
      })
    emit('created')
  }
  handleCancelCreate()
}
</script>

<template>
  <a-button v-if="!isCreateMode" type="primary" @click="handleClickCreate">
    <template #icon>
      <icon-plus />
    </template>
    <span>Create</span>
  </a-button>
  <div v-else class="flex gap-2">
    <a-input
      ref="$input"
      v-model.trim="appName"
      placeholder="App Name"
      class="flex-1 w-0"
    />
    <a-button type="primary" :loading="loading" @click="handleConfirmCreate">
      <template #icon>
        <icon-check />
      </template>
    </a-button>
  </div>
</template>
