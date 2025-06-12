<script setup lang="ts">
import type { KiwiPrimitiveType } from '@/kiwi/schema/type'
import { ref, watch } from 'vue'

const FLOAT_TYPES: KiwiPrimitiveTypeEnum[] = [
  'short',
  'long',
  'float',
  'double',
]

const props = defineProps<{
  name: string
  type: KiwiPrimitiveType
  value: any
}>()
const emits = defineEmits<{
  changed: [value: any, name: string]
}>()

const model = ref(props.value)
watch(model, () => {
  emits('changed', model.value, props.name)
})
</script>

<template>
  <a-input-number
    v-if="type.name === 'int'"
    v-model="model"
    placeholder="Please Enter"
    mode="button"
    :step="1"
    :precision="0"
  />
  <a-input-number
    v-if="FLOAT_TYPES.includes(type.name)"
    v-model="model"
    placeholder="Please Enter"
    mode="button"
  />
  <a-switch
    v-if="type.name === 'boolean'"
    placeholder="Please Enter"
    v-model="model"
  />
</template>
