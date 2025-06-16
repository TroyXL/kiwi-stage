<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiClassType } from '@/kiwi/schema/type'
import text from '@/lib/text'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import type { FieldRule } from '@arco-design/web-vue'
import ParameterEditor from '../ParameterEditor.vue'
import ObjectSelector from './ObjectSelector.vue'

const props = defineProps<{
  parameter: KiwiParameter
  parentFieldName?: string
}>()
const model = defineModel<any>({
  required: true,
})

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const qualifiedName = (props.parameter.type as KiwiClassType).qualifiedName
const kiwiSchema =
  kiwiAppAndSchemaStore.kiwiApp?.getSchemaByQualifiedName(qualifiedName)

const typeAssert = (() => {
  if (!kiwiSchema || kiwiSchema.tag === 'interface') {
    throw new Error('Class not found or invalid')
  }

  const isValue = kiwiSchema.tag === 'value'
  const isClass = kiwiSchema.tag === 'class'
  const isEnum = kiwiSchema.tag === 'enum'

  const hideLabel = isValue || isClass
  const parameter = props.parameter
  const rules: FieldRule[] = hideLabel
    ? []
    : [
        {
          required: parameter.required,
          message: `${parameter.label || parameter.name} ${text.isRequired}`,
        },
      ]

  return {
    isValue,
    isClass,
    isEnum,
    constructorParameters: kiwiSchema.constructorParameters,
    enumOptions: kiwiSchema.enumConstants,
    hideLabel,
    rules,
    fieldName: props.parentFieldName
      ? `${props.parentFieldName}.${parameter.name}`
      : parameter.name,
  }
})()
</script>

<template>
  <a-form-item
    v-if="!parameter.ignore"
    :label="parameter.label"
    :field="typeAssert.fieldName"
    :hide-label="typeAssert.hideLabel"
    :rules="typeAssert.rules"
  >
    <a-space v-if="typeAssert.isValue" class="w-full" direction="vertical">
      <ParameterEditor
        v-model="model"
        :parent-field-name="parameter.name"
        :parameters="typeAssert.constructorParameters"
      />
    </a-space>

    <a-select
      v-else-if="typeAssert.isEnum"
      v-model="model"
      allow-clear
      :placeholder="text.placeholderSelect"
    >
      <a-option
        v-for="option in typeAssert.enumOptions"
        :key="option.name"
        :value="option.name"
      >
        {{ option.label }}
      </a-option>
    </a-select>

    <ObjectSelector
      v-else-if="typeAssert.isClass"
      :qualified-name="(parameter.type as KiwiClassType).qualifiedName"
    />
  </a-form-item>
</template>
