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
  parentFieldName?: string
}>()
const model = defineModel<any>({
  required: true,
})

const t = useI18nText()
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

  const parameter = props.parameter
  const rules: FieldRule[] = isValue
    ? []
    : [
        {
          required: parameter.required,
          message: t(i18nKey.isRequired, [parameter.label || parameter.name]),
        },
      ]

  return {
    isValue,
    isClass,
    isEnum,
    constructorParameters: kiwiSchema.constructorParameters,
    enumOptions: kiwiSchema.enumConstants,
    rules,
    fieldName: props.parentFieldName
      ? `${props.parentFieldName}.${parameter.name}`
      : parameter.name,
  }
})()
</script>

<template>
  <template v-if="!parameter.ignore">
    <ParameterEditor
      v-if="typeAssert.isValue"
      v-model="model"
      :parent-field-name="parameter.name"
      :parameters="typeAssert.constructorParameters"
    />
    <a-form-item
      v-else
      :label="parameter.label"
      :field="typeAssert.fieldName"
      :rules="typeAssert.rules"
    >
      <a-select
        v-if="typeAssert.isEnum"
        v-model="model"
        allow-clear
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
        :qualified-name="(parameter.type as KiwiClassType).qualifiedName"
      />
    </a-form-item>
  </template>
</template>
