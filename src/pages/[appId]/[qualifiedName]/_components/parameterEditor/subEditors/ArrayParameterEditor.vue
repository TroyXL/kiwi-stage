<script setup lang="ts">
import type {
  KiwiArrayType,
  KiwiClassType,
  KiwiParameter,
  KiwiPrimitiveType,
} from '@/kiwi'
import { generateRandomString } from '@/lib/utils'
import { ref } from 'vue'
import ClassParameterEditor from './ClassParameterEditor.vue'
import PrimitiveParameterEditor from './PrimitiveParameterEditor.vue'

const props = defineProps<{
  parameter: KiwiParameter
  parentFieldName?: string
}>()
const model = defineModel<any[]>({
  required: true,
})

const elementType = (props.parameter.type as KiwiArrayType).elementType
const modelValues = ref(
  model.value.map(value => ({
    __key__: generateRandomString(),
    value,
  }))
)

function handleAddItem() {
  modelValues.value.push({
    __key__: generateRandomString(),
    value: {
      [props.parameter.name]: void 0,
    },
  })
}
</script>

<template>
  <template v-for="modelItem in modelValues" :key="modelItem.__key__">
    <PrimitiveParameterEditor
      v-if="elementType.kind === 'primitive'"
      v-model="modelItem.value"
      :parent-field-name="parentFieldName"
      :parameter="parameter"
      :type="elementType as KiwiPrimitiveType"
    />
    <ClassParameterEditor
      v-else-if="elementType.kind === 'class'"
      v-model="modelItem.value"
      :parent-field-name="parentFieldName"
      :parameter="parameter"
      :type="elementType as KiwiClassType"
    />
  </template>
  <a-button @click="handleAddItem">Add</a-button>
</template>
