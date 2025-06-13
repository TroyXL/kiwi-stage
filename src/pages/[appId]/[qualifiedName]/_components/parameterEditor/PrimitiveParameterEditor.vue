<script setup lang="ts">
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
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
  name: string
  type: KiwiPrimitiveType
  value: any
}>()
const emits = defineEmits<{
  changed: [value: any, name: string]
}>()

const typeAsserts = (() => {
  const typeName = props.type.name
  const isInteger = typeName === 'int'
  const isFloat = FLOAT_TYPES.includes(typeName)
  const isBoolean = typeName === 'boolean'
  const isString = typeName === 'string'

  const defaultValue = isInteger
    ? TYPE_DEFAULT_VALUES.isInteger
    : isFloat
    ? TYPE_DEFAULT_VALUES.isFloat
    : isBoolean
    ? TYPE_DEFAULT_VALUES.isBoolean
    : isString
    ? TYPE_DEFAULT_VALUES.isString
    : void 0

  return {
    isInteger,
    isFloat,
    isBoolean,
    isString,
    defaultValue,
  }
})()

const model = ref(props.value ?? typeAsserts.defaultValue)
watch(
  model,
  () => {
    emits('changed', model.value, props.name)
  },
  {
    immediate: isNil(props.value),
  }
)
</script>

<template>
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
</template>
