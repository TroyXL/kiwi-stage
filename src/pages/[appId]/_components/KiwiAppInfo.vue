<script setup lang="ts">
import { useEditKiwiAppName } from '@/hooks/useEditKiwiAppName'
import { KiwiManager } from '@/kiwi'
import { Check, Pencil, Slash } from 'lucide-vue-next'
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
    <Slash :size="14" class="-rotate-[20deg]" />

    <span v-if="!isEditMode" class="font-medium pl-1">{{ appInfo!.name }}</span>
    <a-input
      v-else
      ref="$input"
      placeholder="App Name"
      v-model="appName"
      :disabled="loading"
      @press-enter="handleConfirmEdit"
    />

    <div>
      <template v-if="!isEditMode">
        <a-button
          size="mini"
          type="text"
          class="hover:!bg-blue-100/50"
          @click="handleEditApp"
        >
          <template #icon>
            <Pencil :size="12" />
          </template>
        </a-button>
      </template>

      <a-button
        v-else
        size="mini"
        type="text"
        class="hover:!bg-blue-100/50"
        :loading="loading"
        @click="handleConfirmEdit"
      >
        <template #icon>
          <Check :size="12" />
        </template>
      </a-button>
    </div>
  </div>
</template>
