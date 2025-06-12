<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import { ref } from 'vue'
import PrimitiveParamterEditor from './PrimitiveParamterEditor.vue'

const props = defineProps<{
  parameters: KiwiParameter[]
  model?: Dict
}>()

const formModel = ref<Dict>(
  props.parameters.reduce((acc, cur) => {
    acc[cur.name] = props.model?.[cur.name]
    return acc
  }, {} as Dict)
)

function handleParameterChanged(value: any, name: string) {
  formModel.value[name] = value
}

function getParameters() {
  return formModel.value
}

defineExpose({
  getParameters,
})
</script>

<template>
  <a-form :model="formModel" :wrapper-col-props="{ span: 16 }">
    <template v-for="parameter in parameters">
      <a-form-item :label="parameter.label">
        <PrimitiveParamterEditor
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
