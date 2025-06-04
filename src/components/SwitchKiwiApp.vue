<script setup lang="ts">
import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { ArrowRightLeft, Check, Pencil } from 'lucide-vue-next'
import { nextTick, ref, useTemplateRef, type PropType } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  appInfo: {
    type: Object as PropType<KiwiAppInfo | null>,
    required: true,
  },
})

const router = useRouter()
const isEditMode = ref(false)
const $input = useTemplateRef<HTMLInputElement>('$input')

function handleSwitchApp() {
  localStorage.removeItem(KIWI_APP_RECENT)
  router.replace('/')
}

async function handleEditApp() {
  isEditMode.value = true
  await nextTick()
  $input.value?.focus()
}
function handleConfirmEdit() {
  isEditMode.value = false
}
</script>

<template>
  <div
    v-if="appInfo"
    class="flex justify-between items-center gap-2 p-2 pl-4 bg-blue-50/50 rounded-md border border-blue-600 text-blue-600"
  >
    <span v-if="!isEditMode" class="font-medium">{{ appInfo!.name }}</span>
    <input
      v-else
      ref="$input"
      class="flex-1 w-0 outline-0"
      placeholder="App Name"
      v-model="appInfo!.name"
    />

    <div v-if="!isEditMode">
      <a-button
        size="mini"
        type="text"
        class="hover:!bg-blue-100/50"
        @click="handleEditApp"
      >
        <template #icon>
          <Pencil :size="14" />
        </template>
      </a-button>

      <a-button
        size="mini"
        type="text"
        class="hover:!bg-blue-100/50"
        @click="handleSwitchApp"
      >
        <template #icon>
          <ArrowRightLeft :size="14" />
        </template>
      </a-button>
    </div>
    <a-button
      v-else
      size="mini"
      type="text"
      class="hover:!bg-blue-100/50"
      @click="handleConfirmEdit"
    >
      <template #icon>
        <Check :size="14" />
      </template>
    </a-button>
  </div>
</template>
