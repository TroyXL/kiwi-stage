<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiClassType } from '@/kiwi/schema/type'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import ParameterEditor from './Index.vue'

const props = defineProps<{
  parameter: KiwiParameter
  value: any
}>()

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const kiwiSchema = kiwiAppAndSchemaStore.kiwiApp?.getSchemaByQualifiedName(
  (props.parameter.type as KiwiClassType).qualifiedName
)

const typeAssert = (() => {
  if (!kiwiSchema || kiwiSchema.tag === 'interface') {
    throw new Error('Class not found or invalid')
  }

  const isValue = kiwiSchema.tag === 'value'
  const isClass = kiwiSchema.tag === 'class'
  const isEnum = kiwiSchema.tag === 'enum'

  return {
    isValue,
    isClass,
    isEnum,
    constructorParameters: kiwiSchema.constructorParameters,
  }
})()
</script>

<template>
  <a-form-item
    v-if="!parameter.ignore"
    :label="parameter.label"
    :field="parameter.name"
    :hide-label="typeAssert.isValue || typeAssert.isClass"
  >
    <template v-if="typeAssert.isValue">
      <ParameterEditor :parameters="typeAssert.constructorParameters" />
    </template>
  </a-form-item>
</template>
