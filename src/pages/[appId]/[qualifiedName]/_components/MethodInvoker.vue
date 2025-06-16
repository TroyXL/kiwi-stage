<script setup lang="ts">
import type { KiwiMethod } from '@/kiwi/schema/method'
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import ParameterEditor from './parameterEditor/Index.vue'

const props = defineProps<{
  targetMethod: KiwiMethod | null
  data: KiwiObject
}>()
const emit = defineEmits<{
  refresh: []
  close: []
}>()

const $parameterEditor =
  useTemplateRef<InstanceType<typeof ParameterEditor>>('$parameterEditor')
const route = useRoute('/[appId]/[qualifiedName]/[objectId]/')
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const hasParameters = computed(() => !!props.targetMethod?.parameters.length)
// 使用 visible 是为了保证在弹窗彻底关闭后，清空 willInvokeMethod
// 由于弹窗存在动画，如果在关闭时立刻清空 willInvokeMethod，会导致弹窗 UI 产生抖动
const visible = ref(false)
watch(props, nextProps => {
  visible.value = !!nextProps.targetMethod
})

function handleCloseModal() {
  visible.value = false
}

async function handleExcuteMethod() {
  const objectId = route.params.objectId
  const methodName = props.targetMethod?.name
  if (!objectId || !methodName) return false
  const errors = await $parameterEditor.value?.validate()
  if (errors) return false
  const parameters = $parameterEditor.value?.getParameters()

  try {
    await kiwiAppAndSchemaStore.kiwiSchema?.invokeMethod(
      objectId,
      methodName,
      parameters
    )
    emit('refresh')
    Message.success('Done')
    return true
  } catch (error) {
    return false
  }
}
</script>

<template>
  <a-modal
    unmount-on-close
    :visible="visible"
    :title-align="hasParameters ? 'start' : void 0"
    :closable="false"
    :mask-closable="false"
    :simple="!hasParameters"
    :ok-text="$t(i18nKey.excuteLabel)"
    :on-before-ok="handleExcuteMethod"
    @ok="handleCloseModal"
    @cancel="handleCloseModal"
    @close="emit('close')"
  >
    <template #title>
      {{ targetMethod?.label || targetMethod?.name }}
    </template>
    <div v-if="!hasParameters">{{ $t(i18nKey.actionUndoTip) }}</div>
    <div v-else>
      <ParameterEditor
        ref="$parameterEditor"
        :parameters="targetMethod!.parameters"
        :data="data"
      />
    </div>
  </a-modal>
</template>
