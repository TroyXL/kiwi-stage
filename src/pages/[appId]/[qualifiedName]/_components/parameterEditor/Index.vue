<script setup lang="ts">
import { KiwiApp } from '@/kiwi'
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { FormInstance } from '@arco-design/web-vue'
import { ref, useTemplateRef } from 'vue'
import ParameterEditor from './ParameterEditor.vue'

const props = defineProps<{
  parameters: KiwiParameter[]
  // model?: Dict
}>()
const emit = defineEmits(['change'])

const formModel = ref(
  KiwiApp.current?.transformParametersToFormData(props.parameters) ?? {}
)
const $form = useTemplateRef<FormInstance>('$form')

defineExpose({
  async validate() {
    return await $form.value?.validate()
  },
  getParameters() {
    return (
      KiwiApp.current?.transformFormDataToFormattedParameters(
        props.parameters,
        formModel.value
      ) ?? {}
    )
  },
})
</script>

<template>
  <a-form ref="$form" :model="formModel" :wrapper-col-props="{ span: 16 }">
    <ParameterEditor v-model="formModel" :parameters="parameters" />
  </a-form>
</template>
