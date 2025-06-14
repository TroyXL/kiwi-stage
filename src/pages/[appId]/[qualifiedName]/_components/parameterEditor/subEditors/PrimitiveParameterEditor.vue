<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import type { FieldRule } from '@arco-design/web-vue'
import { isNil } from 'lodash'
import { ref, watch } from 'vue'

const FLOAT_TYPES: KiwiPrimitiveTypeEnum[] = ['long', 'float', 'double']
const TYPE_DEFAULT_VALUES = {
  isInteger: 0,
  isFloat: 0,
  isBoolean: false,
  isString: '',
}

const props = defineProps<{
  parameter: KiwiParameter
  prefixFieldName?: string
  value: any
}>()
const emit = defineEmits<{
  change: [value: any, name: string]
}>()

const typeAsserts = (() => {
  const parameter = props.parameter
  const typeName = (parameter.type as KiwiPrimitiveType).name
  const isInteger = typeName === 'int'
  const isFloat = FLOAT_TYPES.includes(typeName)
  const isBoolean = typeName === 'boolean'
  const isString = typeName === 'string'

  const defaultValue =
    props.value ?? isInteger
      ? TYPE_DEFAULT_VALUES.isInteger
      : isFloat
      ? TYPE_DEFAULT_VALUES.isFloat
      : isBoolean
      ? TYPE_DEFAULT_VALUES.isBoolean
      : isString
      ? TYPE_DEFAULT_VALUES.isString
      : void 0

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
    defaultValue,
    rules,
    fieldName: props.prefixFieldName
      ? `${props.prefixFieldName}.${parameter.name}`
      : parameter.name,
  }
})()

const model = ref(typeAsserts.defaultValue)
watch(
  model,
  () => {
    emit('change', model.value, props.parameter.name)
  },
  {
    immediate: isNil(props.value),
  }
)
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
