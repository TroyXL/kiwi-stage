<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import ArrayParameterEditor from './subEditors/ArrayParameterEditor.vue'
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
    <template v-if="!parameter.ignore">
      <PrimitiveParameterEditor
        v-if="parameter.type.kind === 'primitive'"
        v-model="model[parameter.name]"
        :parent-field-name="parentFieldName"
        :parameter="parameter"
      />

      <ClassParameterEditor
        v-if="parameter.type.kind === 'class'"
        v-model="model[parameter.name]"
        ref="$classParameterEditors"
        :parent-field-name="parentFieldName"
        :parameter="parameter"
      />

      <ArrayParameterEditor
        v-if="parameter.type.kind === 'array'"
        v-model="model[parameter.name]"
        ref="$classParameterEditors"
        :parent-field-name="parentFieldName"
        :parameter="parameter"
      />
    </template>
  </template>
</template>
