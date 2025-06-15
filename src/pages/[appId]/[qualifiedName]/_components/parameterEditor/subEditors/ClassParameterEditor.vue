<script setup lang="ts">
import type { KiwiParameter } from '@/kiwi/schema/parameter'
import type { KiwiClassType } from '@/kiwi/schema/type'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import type { FieldRule } from '@arco-design/web-vue'
import { ref } from 'vue'
import ParameterEditor from '../ParameterEditor.vue'

const props = defineProps<{
  parameter: KiwiParameter
  prefixFieldName?: string
  value: any
}>()
const emit = defineEmits<{
  change: [value: any, name: string]
}>()

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
          message: `${parameter.label || parameter.name} is required`,
        },
      ]

  const defaultModel = isValue
    ? props.value?.fields ??
      kiwiSchema.constructorParameters.reduce((acc, cur) => {
        acc[cur.name] = props.value?.[cur.name]
        return acc
      }, {} as Dict)
    : isClass
    ? props.value?.id
    : isEnum
    ? props.value?.name
    : void 0

  return {
    isValue,
    isClass,
    isEnum,
    constructorParameters: kiwiSchema.constructorParameters,
    enumOptions: kiwiSchema.enumConstants,
    hideLabel,
    rules,
    fieldName: props.prefixFieldName
      ? `${props.prefixFieldName}.${parameter.name}`
      : parameter.name,
    defaultModel,
  }
})()

const model = ref(typeAssert.defaultModel)
triggerValueChange()

// 下拉框的校验基于表单的 model
// 而不是传入下拉框的 model
// 由于下拉框默认的 change 触发时机早于 watch
// 因此不可以通过 watch 来监听变化后修改值
// 而要通过 change 在校验触发之前修改值
function handleValueChanged(nextValue: any, name: string) {
  if (typeAssert.isValue) {
    model.value[name] = nextValue
  } else {
    model.value = nextValue
  }
  triggerValueChange()
}

function triggerValueChange() {
  const nextValue = typeAssert.isValue
    ? { type: qualifiedName, fields: model.value }
    : typeAssert.isEnum
    ? { type: qualifiedName, name: model.value }
    : typeAssert.isClass
    ? { type: qualifiedName, id: model.value }
    : void 0

  emit('change', nextValue, props.parameter.name)
}
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
        :prefix-field-name="parameter.name"
        :parameters="typeAssert.constructorParameters"
        :model="model"
        @change="handleValueChanged"
      />
    </a-space>

    <a-select
      v-else-if="typeAssert.isEnum"
      placeholder="Please select"
      allow-clear
      validate-trigger="blur"
      :default-value="model"
      @change="handleValueChanged"
    >
      <a-option
        v-for="option in typeAssert.enumOptions"
        :key="option.name"
        :value="option.name"
      >
        {{ option.label }}
      </a-option>
    </a-select>
  </a-form-item>
</template>
