<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import type { FieldRule } from '@arco-design/web-vue'

const FLOAT_TYPES: KiwiPrimitiveTypeEnum[] = ['long', 'float', 'double']

const props = defineProps<{
  parameter: KiwiParameter
  parentFieldName?: string
}>()
const model = defineModel<any>({
  required: true,
})

const typeAsserts = (() => {
  const parameter = props.parameter
  const typeName = (parameter.type as KiwiPrimitiveType).name
  const isInteger = typeName === 'int'
  const isFloat = FLOAT_TYPES.includes(typeName)
  const isBoolean = typeName === 'boolean'
  const isString = typeName === 'string'

  const rules: FieldRule[] = [
    {
      required: parameter.required,
      message: `${parameter.label || parameter.name} is required`,
    },
  ]

  return {
    isInteger,
    isFloat,
    isBoolean,
    isString,
    rules,
    fieldName: props.parentFieldName
      ? `${props.parentFieldName}.${parameter.name}`
      : parameter.name,
  }
})()
</script>

<template>
  <a-form-item
    :label="parameter.label"
    :field="typeAsserts.fieldName"
    :rules="typeAsserts.rules"
  >
    <a-input-number
      v-if="typeAsserts.isInteger"
      v-model="model"
      placeholder="Please Enter"
      mode="button"
      :step="1"
      :precision="0"
    />
    <a-input-number
      v-else-if="typeAsserts.isFloat"
      v-model="model"
      placeholder="Please Enter"
      mode="button"
    />
    <a-switch
      v-else-if="typeAsserts.isBoolean"
      placeholder="Please Enter"
      v-model="model"
    />
    <a-input
      v-else-if="typeAsserts.isString"
      placeholder="Please Enter"
      v-model.trim="model"
    />
  </a-form-item>
</template>
