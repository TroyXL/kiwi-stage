<script setup lang="ts">
import {
  KiwiApp,
  type KiwiArrayType,
  type KiwiClassType,
  type KiwiParameter,
  type KiwiPrimitiveType,
} from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { generateRandomString } from '@/lib/utils'
import { computed, ref, watch } from 'vue'
import ClassParameterEditor from './ClassParameterEditor.vue'
import PrimitiveParameterEditor from './PrimitiveParameterEditor.vue'

const props = defineProps<{
  parameter: KiwiParameter
  parentFieldName?: string
}>()
const model = defineModel<KiwiArrayTypeFormattedValue[]>({
  required: true,
})
const modelMaxIndex = computed(() => model.value.length - 1)

const typeAssert = (() => {
  const elementType = (props.parameter.type as KiwiArrayType).elementType
  const isPrimitiveType = elementType.kind === 'primitive'
  const isClassType = elementType.kind === 'class'

  let isMultipleClass = false
  if (isClassType) {
    const qualifiedName = (elementType as KiwiClassType).qualifiedName
    const schemaTag =
      KiwiApp.current?.getSchemaByQualifiedName(qualifiedName)?.tag
    isMultipleClass = schemaTag === 'enum' || schemaTag === 'class'
  }

  const fullFieldName = props.parentFieldName
    ? `${props.parentFieldName}.${props.parameter.name}`
    : props.parameter.name

  return {
    elementType,
    isPrimitiveType,
    isClassType,
    isMultipleClass,
    fullFieldName,
  }
})()

const modelOfMultipleClass = ref(
  typeAssert.isMultipleClass ? model.value.map(item => item.value) : []
)
watch(modelOfMultipleClass, val => {
  model.value = val.map((item, index) => ({
    __key__: index.toString(),
    value: item,
  }))
})

function handleAddItem() {
  const kiwiApp = KiwiApp.current
  if (!kiwiApp) return
  let value: any = void 0
  if (typeAssert.isPrimitiveType) {
    value = kiwiApp.getValueByPrimitiveType(
      typeAssert.elementType as KiwiPrimitiveType
    )
  } else if (typeAssert.isClassType) {
    value = kiwiApp.getValueByClassType(typeAssert.elementType as KiwiClassType)
  }
  model.value.push({
    __key__: generateRandomString(),
    value,
  })
}

function handleRemoveItem(key: string) {
  model.value = model.value.filter(item => item.__key__ !== key)
}

function getFieldNameByIndex(index: number) {
  return typeAssert.fullFieldName + `[${index}]`
}

watch(
  modelMaxIndex,
  index => {
    if (typeAssert.isMultipleClass) return
    if (index < 0) handleAddItem()
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <template v-if="!typeAssert.isMultipleClass">
    <template v-for="(modelItem, index) in model" :key="modelItem.__key__">
      <PrimitiveParameterEditor
        v-if="typeAssert.isPrimitiveType"
        v-model="modelItem.value"
        field-name="value"
        :parent-field-name="getFieldNameByIndex(index)"
        :parameter="parameter"
        :type="typeAssert.elementType as KiwiPrimitiveType"
      />

      <ClassParameterEditor
        v-if="typeAssert.isClassType"
        v-model="modelItem.value"
        field-name="value"
        :parent-field-name="getFieldNameByIndex(index)"
        :parameter="parameter"
        :type="typeAssert.elementType as KiwiClassType"
      />

      <div class="pb-5 flex justify-end gap-2">
        <a-button
          v-if="index === modelMaxIndex"
          type="primary"
          @click="handleAddItem"
        >
          <template #icon>
            <icon-plus />
          </template>
          {{ $t(i18nKey.addLabel) }}
        </a-button>
        <a-button
          v-if="modelMaxIndex > 0"
          type="secondary"
          status="danger"
          @click="handleRemoveItem(modelItem.__key__)"
        >
          <template #icon>
            <icon-delete />
          </template>
          {{ $t(i18nKey.removeLabel) }}
        </a-button>
      </div>
    </template>
  </template>

  <ClassParameterEditor
    v-else
    v-model="modelOfMultipleClass"
    multiple
    :parameter="parameter"
    :type="typeAssert.elementType as KiwiClassType"
  />
</template>
