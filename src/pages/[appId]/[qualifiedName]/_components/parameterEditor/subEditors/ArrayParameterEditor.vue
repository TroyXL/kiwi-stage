<script setup lang="ts">
import type {
  KiwiArrayType,
  KiwiClassType,
  KiwiParameter,
  KiwiPrimitiveType,
} from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { generateRandomString } from '@/lib/utils'
import { computed, watch } from 'vue'
import ClassParameterEditor from './ClassParameterEditor.vue'
import PrimitiveParameterEditor from './PrimitiveParameterEditor.vue'

const props = defineProps<{
  parameter: KiwiParameter
  parentFieldName?: string
}>()
const model = defineModel<any[]>({
  required: true,
})

const elementType = (props.parameter.type as KiwiArrayType).elementType
const fieldName = props.parentFieldName
  ? `${props.parentFieldName}.${props.parameter.name}`
  : props.parameter.name

const modelMaxIndex = computed(() => model.value.length - 1)

function handleAddItem() {
  model.value.push({
    __key__: generateRandomString(),
    value: void 0,
    // {
    //   [props.parameter.name]: void 0,
    // },
  })
}

function handleRemoveItem(key: string) {
  model.value = model.value.filter(item => item.__key__ !== key)
}

function getFieldNameByIndex(index: number) {
  return fieldName + `[${index}]`
}

watch(
  modelMaxIndex,
  index => {
    if (index < 0) handleAddItem()
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <template v-for="(modelItem, index) in model" :key="modelItem.__key__">
    <PrimitiveParameterEditor
      v-if="elementType.kind === 'primitive'"
      v-model="modelItem.value"
      field-name="value"
      :parent-field-name="getFieldNameByIndex(index)"
      :parameter="parameter"
      :type="elementType as KiwiPrimitiveType"
    />
    <ClassParameterEditor
      v-else-if="elementType.kind === 'class'"
      v-model="modelItem.value"
      field-name="value"
      :parent-field-name="getFieldNameByIndex(index)"
      :parameter="parameter"
      :type="elementType as KiwiClassType"
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
