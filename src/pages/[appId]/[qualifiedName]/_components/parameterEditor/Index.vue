<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import type { FormInstance } from '@arco-design/web-vue'
import type { FieldRule } from '@arco-design/web-vue/es/form/interface'
import { ref } from 'vue'
import PrimitiveParameterEditor from './PrimitiveParameterEditor.vue'

const props = defineProps<{
  parameters: KiwiParameter[]
  model?: Dict
}>()

const formModel = ref(
  props.parameters.reduce((acc, cur) => {
    acc[cur.name] = props.model?.[cur.name]
    return acc
  }, {} as Dict)
)

const formRules = ref(
  props.parameters.reduce((acc, cur) => {
    acc[cur.name] = {
      required: cur.required,
      message: `${cur.label || cur.name} is required`,
    }
    return acc
  }, {} as Dict<FieldRule>)
)

const $form = ref<FormInstance>()

function handleParameterChanged(value: any, name: string) {
  formModel.value[name] = value
}

async function getParameters() {
  const errors = await $form.value?.validate()
  if (errors) return

  return formModel.value
}

defineExpose({
  getParameters,
})
</script>

<template>
  <a-form
    ref="$form"
    :model="formModel"
    :rules="formRules"
    :wrapper-col-props="{ span: 16 }"
  >
    <template v-for="parameter in parameters">
      <a-form-item
        v-if="!parameter.ignore"
        :label="parameter.label"
        :field="parameter.name"
      >
        <PrimitiveParameterEditor
          v-if="parameter.type.kind === 'primitive'"
          :name="parameter.name"
          :value="formModel[parameter.name]"
          :type="parameter.type as KiwiPrimitiveType"
          @changed="handleParameterChanged"
        />
      </a-form-item>
    </template>
  </a-form>
</template>
