<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { computed, ref, watch } from 'vue'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const targetMethod = computed(() => kiwiAppAndSchemaStore.willInvokeMethod)
const hasParameters = computed(() => !!targetMethod.value?.parameters.length)
const visible = ref(false)
watch(targetMethod, () => {
  visible.value = !!targetMethod.value
})

function handleCloseModal() {
  visible.value = false
}
</script>

<template>
  <a-modal
    :visible="visible"
    :title-align="hasParameters ? 'start' : void 0"
    :closable="false"
    :mask-closable="false"
    :simple="!hasParameters"
    ok-text="Excute"
    @ok="handleCloseModal"
    @cancel="handleCloseModal"
    @close="kiwiAppAndSchemaStore.invokeMethod(null)"
  >
    <template #title>
      {{ targetMethod?.label || targetMethod?.name }}
    </template>
    <div v-if="!hasParameters" class="text-center mb-6">
      This action cannot be undo.
    </div>
  </a-modal>
</template>
