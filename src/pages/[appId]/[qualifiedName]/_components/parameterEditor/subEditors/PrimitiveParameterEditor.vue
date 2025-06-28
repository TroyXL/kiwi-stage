<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import { i18nKey, useI18nText } from '@/lib/i18n'
import type { FieldRule } from '@arco-design/web-vue'

const FLOAT_TYPES: KiwiPrimitiveTypeEnum[] = ['long', 'float', 'double']

const props = defineProps<{
  parameter: KiwiParameter
  type?: KiwiPrimitiveType
  parentFieldName?: string
  fieldName?: string
  hideLabel?: boolean
}>()
const model = defineModel<any>({
  required: true,
})

const t = useI18nText()
const typeAsserts = (() => {
  const parameter = props.parameter
  const typeName = (props.type || (parameter.type as KiwiPrimitiveType)).name
  const isInteger = typeName === 'int'
  const isFloat = FLOAT_TYPES.includes(typeName)
  const isBoolean = typeName === 'boolean'
  const isString = typeName === 'string'

  const rules: FieldRule[] = [
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
    isInteger,
    isFloat,
    isBoolean,
    isString,
    rules,
    fullFieldName,
  }
})()
</script>

<template>
  <a-form-item
    :label="parameter.label"
    :field="typeAsserts.fullFieldName"
    :rules="typeAsserts.rules"
  >
    <a-input-number
      v-if="typeAsserts.isInteger"
      v-model="model"
      mode="button"
      :placeholder="$t(i18nKey.placeholderEnter)"
      :step="1"
      :precision="0"
    />
    <a-input-number
      v-else-if="typeAsserts.isFloat"
      v-model="model"
      mode="button"
      :placeholder="$t(i18nKey.placeholderEnter)"
    />
    <a-switch
      v-else-if="typeAsserts.isBoolean"
      v-model="model"
      :placeholder="$t(i18nKey.placeholderEnter)"
    />
    <a-input
      v-else-if="typeAsserts.isString"
      v-model="model"
      allow-clear
      :placeholder="$t(i18nKey.placeholderEnter)"
    />
  </a-form-item>
</template>
