<script setup lang="ts">
import { ArrowRightLeft } from 'lucide-vue-next'
import { type PropType } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  appInfo: {
    type: Object as PropType<KiwiAppInfo | null>,
    required: true,
  },
})
const router = useRouter()

function handleSwitchApp() {
  // localStorage.removeItem(KIWI_APP_RECENT)
  router.replace('/')
}
</script>

<template>
  <a-button
    v-if="appInfo"
    class="w-full !justify-between gap-2 !py-4 !bg-blue-50/50 !rounded-md"
    type="outline"
    @click="handleSwitchApp"
  >
    <span class="font-medium">{{ appInfo!.name }}</span>
    <ArrowRightLeft :size="14" />
  </a-button>
</template>
