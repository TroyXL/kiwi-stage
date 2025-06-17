<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { computed, useTemplateRef } from 'vue'
import ParameterEditor from './parameterEditor/Index.vue'

const props = defineProps<{
  targetSchema: KiwiSchema
  data?: KiwiObject
}>()
const visible = defineModel<boolean>('visible')
const emit = defineEmits<{
  refresh: [newObjectId?: string]
  close: []
}>()

const $parameterEditor =
  useTemplateRef<InstanceType<typeof ParameterEditor>>('$parameterEditor')
const { kiwiApp } = useKiwiAppAndSchemaStore()
const hasParameters = computed(() => {
  if (props.targetSchema?.constructorParameters.length) return true
})

function handleCloseModal() {
  visible.value = false
}

async function handleConfirmEdit() {
  if (!kiwiApp) return false
  const errors = await $parameterEditor.value?.validate()
  if (errors) return false
  const parameters = $parameterEditor.value?.getParameters()
  const payload: KiwiCreateOrUpdateObject = {
    object: {
      id: props.data?.id,
      type: props.targetSchema.qualifiedName,
      fields: parameters,
    },
  }
  try {
    const newObjectId = await kiwiApp?.createOrUpdateObject(payload)
    emit('refresh', newObjectId)
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
    v-model:visible="visible"
    :title-align="hasParameters ? 'start' : void 0"
    :closable="false"
    :mask-closable="false"
    :simple="!hasParameters"
    :ok-text="$t(i18nKey.submitLabel)"
    :on-before-ok="handleConfirmEdit"
    @ok="handleCloseModal"
    @cancel="handleCloseModal"
    @close="emit('close')"
  >
    <template #title>{{
      $t(data?.id ? i18nKey.editRecordTitle : i18nKey.createRecordTitle)
    }}</template>
    <div v-if="!hasParameters">{{ $t(i18nKey.actionUndoTip) }}</div>
    <div v-else>
      <ParameterEditor
        ref="$parameterEditor"
        :parameters="targetSchema!.constructorParameters"
        :data="data"
      />
    </div>
  </a-modal>
</template>
