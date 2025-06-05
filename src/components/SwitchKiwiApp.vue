<script setup lang="ts">
import { KiwiManager } from '@/kiwi'
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { ArrowRightLeft, Check, Pencil } from 'lucide-vue-next'
import { nextTick, ref, useTemplateRef, type PropType } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  appInfo: {
    type: Object as PropType<KiwiAppInfo | null>,
    required: true,
  },
})
const emits = defineEmits(['update:appInfo'])

const router = useRouter()
const isEditMode = ref(false)
const appName = ref('')
const loading = ref(false)
const $input = useTemplateRef<HTMLInputElement>('$input')

function handleSwitchApp() {
  localStorage.removeItem(KIWI_APP_RECENT)
  router.replace('/')
}

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
  <div
    v-if="appInfo"
    class="flex-col p-2 pb-1 bg-blue-50/50 rounded-md border border-blue-600 text-blue-600"
  >
    <span v-if="!isEditMode" class="font-medium pl-1">{{ appInfo!.name }}</span>
    <input
      v-else
      ref="$input"
      class="outline-0"
      placeholder="App Name"
      v-model="appName"
    />

    <div class="text-right pt-2">
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

        <a-button
          size="mini"
          type="text"
          class="hover:!bg-blue-100/50"
          @click="handleSwitchApp"
        >
          <template #icon>
            <ArrowRightLeft :size="12" />
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
