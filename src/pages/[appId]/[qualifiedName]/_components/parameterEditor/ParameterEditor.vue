<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import ClassParameterEditor from './subEditors/ClassParameterEditor.vue'
import PrimitiveParameterEditor from './subEditors/PrimitiveParameterEditor.vue'

defineProps<{
  parameters: KiwiParameter[]
  parentFieldName?: string
}>()

const model = defineModel<Dict>({
  required: true,
})
</script>

<template>
  <template v-for="parameter in parameters">
    <PrimitiveParameterEditor
      v-if="!parameter.ignore && parameter.type.kind === 'primitive'"
      v-model="model[parameter.name]"
      :parent-field-name="parentFieldName"
      :parameter="parameter"
    />

    <ClassParameterEditor
      v-if="!parameter.ignore && parameter.type.kind === 'class'"
      v-model="model[parameter.name]"
      ref="$classParameterEditors"
      :parent-field-name="parentFieldName"
      :parameter="parameter"
    />
  </template>
</template>
