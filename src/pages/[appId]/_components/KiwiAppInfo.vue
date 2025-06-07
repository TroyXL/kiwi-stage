<script setup lang="ts">
import { useEditKiwiAppName } from '@/hooks/useEditKiwiAppName'
import { KiwiManager } from '@/kiwi'
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

async function handleEditApp() {
  isEditMode.value = true
  appName.value = props.appInfo!.name
  await nextTick()
  $input.value?.focus()
}
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

    <div>
      <template v-if="!isEditMode">
        <a-button type="text" @click="handleEditApp">
          <template #icon>
            <icon-pen />
          </template>
        </a-button>
      </template>
    </div>
  </div>
</template>
