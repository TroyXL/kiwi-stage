<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { FormInstance } from '@arco-design/web-vue'
import { ref, useTemplateRef } from 'vue'
import ParameterEditor from './ParameterEditor.vue'

const props = defineProps<{
  parameters: KiwiParameter[]
  model?: Dict
}>()
const emit = defineEmits(['change'])

const formModel = ref(
  props.parameters.reduce((acc, cur) => {
    acc[cur.name] = props.model?.[cur.name]
    return acc
  }, {} as Dict)
)

const $form = useTemplateRef<FormInstance>('$form')

function handleParameterChanged(value: any, name: string) {
  formModel.value[name] = value
  emit('change', formModel.value)
}

defineExpose({
  async validate() {
    return await $form.value?.validate()
  },
  getParameters() {
    return formModel.value
  },
})
</script>

<template>
  <a-form ref="$form" :model="formModel" :wrapper-col-props="{ span: 16 }">
    <ParameterEditor
      :parameters="parameters"
      :model="formModel"
      @change="handleParameterChanged"
    />
  </a-form>
</template>
