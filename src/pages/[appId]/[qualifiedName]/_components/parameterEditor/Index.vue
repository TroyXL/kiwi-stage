<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { FormInstance } from '@arco-design/web-vue'
import type { FieldRule } from '@arco-design/web-vue/es/form/interface'
import { ref } from 'vue'
import ClassParamterEditor from './ClassParamterEditor.vue'
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
      <template v-if="!parameter.ignore">
        <PrimitiveParameterEditor
          v-if="parameter.type.kind === 'primitive'"
          :parameter="parameter"
          :value="formModel[parameter.name]"
          @changed="handleParameterChanged"
        />

        <ClassParamterEditor
          v-if="parameter.type.kind === 'class'"
          :parameter="parameter"
          :value="formModel[parameter.name]"
        />
      </template>
    </template>
  </a-form>
</template>
