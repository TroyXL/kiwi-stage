<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiClassType } from '@/kiwi/schema/type'
import { i18nKey, useI18nText } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import type { FieldRule } from '@arco-design/web-vue'
import ParameterEditor from '../ParameterEditor.vue'
import ObjectSelector from './ObjectSelector.vue'

const props = defineProps<{
  parameter: KiwiParameter
  type?: KiwiClassType
  parentFieldName?: string
  fieldName?: string
  multiple?: boolean
}>()
const model = defineModel<any>({
  required: true,
})

const t = useI18nText()
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()

const qualifiedName = (props.type || (props.parameter.type as KiwiClassType))
  .qualifiedName
const kiwiSchema =
  kiwiAppAndSchemaStore.kiwiApp?.getSchemaByQualifiedName(qualifiedName)

const typeAssert = (() => {
  if (!kiwiSchema || kiwiSchema.tag === 'interface') {
    throw new Error('Class not found or invalid')
  }

  const isValue = kiwiSchema.tag === 'value'
  const isClass = kiwiSchema.tag === 'class'
  const isEnum = kiwiSchema.tag === 'enum'

  const parameter = props.parameter
  const rules: FieldRule[] =
    isValue || !parameter.required
      ? []
      : [
          {
            required: parameter.required,
            message: t(i18nKey.isRequired, [parameter.label || parameter.name]),
          },
        ]

  const currentFieldName = props.fieldName || parameter.name
  const fullFieldName = props.parentFieldName
    ? `${props.parentFieldName}.${currentFieldName}`
    : currentFieldName

  return {
    isValue,
    isClass,
    isEnum,
    constructorParameters: kiwiSchema.constructorParameters,
    enumOptions: kiwiSchema.enumConstants,
    rules,
    fullFieldName,
  }
})()
</script>

<template>
  <template v-if="!parameter.ignore">
    <ParameterEditor
      v-if="typeAssert.isValue"
      v-model="model"
      :parent-field-name="typeAssert.fullFieldName"
      :parameters="typeAssert.constructorParameters"
    />
    <a-form-item
      v-else
      :label="parameter.label"
      :field="typeAssert.fullFieldName"
      :rules="typeAssert.rules"
      :validate-trigger="typeAssert.isClass ? 'input' : void 0"
    >
      <a-select
        v-if="typeAssert.isEnum"
        v-model="model"
        allow-clear
        :multiple="multiple"
        :placeholder="$t(i18nKey.placeholderSelect)"
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
        v-model="model"
        :multiple="multiple"
        :qualified-name="qualifiedName"
      />
    </a-form-item>
  </template>
</template>
