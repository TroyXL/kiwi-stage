<script setup lang="ts">
import { useEditKiwiAppName } from '@/hooks/useEditKiwiAppName'
import { useSwitchKiwiApp } from '@/hooks/useSwitchKiwiApp'
import { KiwiManager } from '@/kiwi'
import { showConfirm } from '@/lib/userInterface'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { nextTick, ref, useTemplateRef, type PropType } from 'vue'

const props = defineProps({
  appInfo: {
    type: Object as PropType<KiwiAppInfo | null>,
    required: true,
  },
})
const emits = defineEmits(['update:appInfo'])

const isEditMode = ref(false)
const loading = ref(false)
const $input = useTemplateRef<HTMLInputElement>('$input')
const appName = useEditKiwiAppName()

const handleSwitchApp = useSwitchKiwiApp()

const { loading: deleteLoading, send: handleDeleteApp } = useRequest(
  KiwiManager.shared.deleteApp(props.appInfo!.id),
  {
    immediate: false,
    async middleware(_ctx, next) {
      if (await showConfirm('Confirm delete this app?')) {
        await next()
        Message.success(`App <${props.appInfo!.name}> deleted`)
        handleSwitchApp()
      }
    },
  }
)

async function handleEditApp() {
  isEditMode.value = true
  appName.value = props.appInfo!.name
  await nextTick()
  $input.value?.focus()
}

// async function handleSyncApp() {}

async function handleConfirmEdit() {
  const newName = appName.value.trim()
  if (newName && newName !== props.appInfo?.name) {
    loading.value = true
    await KiwiManager.shared
      .createOrUpdateApp({
        id: props.appInfo!.id,
        name: newName,
      })
      .finally(() => {
        loading.value = false
      })
    emits('update:appInfo', {
      ...props.appInfo!,
      name: newName,
    })
  }

  isEditMode.value = false
  appName.value = ''
}
</script>

<template>
  <div v-if="appInfo" class="flex items-center gap-2">
    <icon-oblique-line />

    <span v-if="!isEditMode" class="font-medium pl-1">{{ appInfo!.name }}</span>
    <a-input-search
      v-else
      search-button
      ref="$input"
      placeholder="App Name"
      v-model="appName"
      :disabled="loading"
      @search="handleConfirmEdit"
      @press-enter="handleConfirmEdit"
    >
      <template #button-icon>
        <icon-check />
      </template>
    </a-input-search>

    <div v-if="!isEditMode">
      <a-button type="text" @click="handleEditApp">
        <template #icon>
          <icon-pen />
        </template>
      </a-button>
      <!-- <a-button type="text" @click="handleSyncApp">
        <template #icon>
          <icon-sync />
        </template>
      </a-button> -->
      <a-button type="text" @click="handleSwitchApp">
        <template #icon>
          <icon-swap />
        </template>
      </a-button>
      <a-button
        type="text"
        status="danger"
        :loading="deleteLoading"
        @click="handleDeleteApp"
      >
        <template #icon>
          <icon-delete />
        </template>
      </a-button>
    </div>
  </div>
</template>
