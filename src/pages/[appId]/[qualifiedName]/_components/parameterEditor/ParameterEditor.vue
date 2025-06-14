<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import ClassParameterEditor from './subEditors/ClassParameterEditor.vue'
import PrimitiveParameterEditor from './subEditors/PrimitiveParameterEditor.vue'

defineProps<{
  parameters: KiwiParameter[]
  prefixFieldName?: string
  model: Dict
}>()

const emit = defineEmits<{
  change: [value: any, name: string]
}>()

function handleParameterChanged(value: any, name: string) {
  emit('change', value, name)
}
</script>

<template>
  <template v-for="parameter in parameters">
    <PrimitiveParameterEditor
      v-if="!parameter.ignore && parameter.type.kind === 'primitive'"
      :prefix-field-name="prefixFieldName"
      :parameter="parameter"
      :value="model[parameter.name]"
      @change="handleParameterChanged"
    />

    <ClassParameterEditor
      v-if="!parameter.ignore && parameter.type.kind === 'class'"
      ref="$classParameterEditors"
      :prefix-field-name="prefixFieldName"
      :parameter="parameter"
      :value="model[parameter.name]"
      @change="handleParameterChanged"
    />
  </template>
</template>
