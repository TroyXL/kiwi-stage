<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { computed, inject, ref, useTemplateRef, watch } from 'vue'
import ParameterEditor from './parameterEditor/Index.vue'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const targetMethod = computed(() => kiwiAppAndSchemaStore.willInvokeMethod)
const hasParameters = computed(() => !!targetMethod.value?.parameters.length)
// 使用 visible 是为了保证在弹窗彻底关闭后，清空 willInvokeMethod
// 由于弹窗存在动画，如果在关闭时立刻清空 willInvokeMethod，会导致弹窗 UI 产生抖动
const visible = ref(false)
const $parameterEditor =
  useTemplateRef<InstanceType<typeof ParameterEditor>>('$parameterEditor')
const handleRefreshObjectList = inject<() => void>('refreshObjectList')

watch(targetMethod, () => {
  visible.value = !!targetMethod.value
})

function handleCloseModal() {
  visible.value = false
}

async function handleExcuteMethod() {
  const objectId = kiwiAppAndSchemaStore.selectedObject.id
  const methodName = targetMethod.value?.name
  if (!objectId || !methodName) return false
  const parameters = $parameterEditor.value?.getParameters()
  try {
    await kiwiAppAndSchemaStore
      .getKiwiSchema()
      ?.invokeMethod(objectId, methodName, parameters)
    Message.success('Done')
    kiwiAppAndSchemaStore.refreshObjectPreview()
    handleRefreshObjectList?.()
    return true
  } catch (error) {
    return false
  }
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
    :on-before-ok="handleExcuteMethod"
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
    <div v-else>
      <ParameterEditor
        ref="$parameterEditor"
        :parameters="targetMethod!.parameters"
      />
    </div>
  </a-modal>
</template>
