<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { i18nKey, useI18nText } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { computed, useTemplateRef } from 'vue'
import ObjectEditor from './ObjectEditor.vue'

const props = defineProps<{
  targetSchema: KiwiSchema
  data?: KiwiObject
}>()
const visible = defineModel<boolean>('visible')
const emit = defineEmits<{
  refresh: [newObjectId?: string]
  close: []
}>()

const t = useI18nText()
const $objectEditor =
  useTemplateRef<InstanceType<typeof ObjectEditor>>('$objectEditor')
const { kiwiApp } = useKiwiAppAndSchemaStore()
const hasParameters = computed(
  () => !!props.targetSchema?.constructorParameters.length
)

function handleCloseModal() {
  visible.value = false
}

async function handleConfirmEdit() {
  if (!kiwiApp) return false
  try {
    const payload = await $objectEditor.value?.getObjectPaylod()
    if (!payload) return false
    const newObjectId = await kiwiApp?.createOrUpdateObject(
      payload as KiwiCreateOrUpdateObject
    )
    emit('refresh', newObjectId)
    Message.success(t(i18nKey.successTip))
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
    :body-class="
      cn('max-h-[640px] overflow-auto', data ? 'relative !pt-16' : void 0)
    "
    :title-align="hasParameters ? 'start' : void 0"
    :width="720"
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
    <!-- <div v-if="!hasParameters">{{ $t(i18nKey.actionUndoTip) }}</div> -->
    <a-alert
      v-if="data"
      class="absolute top-0 left-0 right-0 !rounded-none"
      type="warning"
      banner
      center
    >
      {{ $t(i18nKey.actionUndoTip) }}
    </a-alert>

    <ObjectEditor
      v-if="hasParameters"
      ref="$objectEditor"
      :schema="targetSchema"
      :data="data"
    />
  </a-modal>
</template>
