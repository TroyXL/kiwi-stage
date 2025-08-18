<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { ref } from 'vue'
import ParameterEditor from '../parameterEditor/Index.vue'
import SubObjectEditor from './SubObjectEditor.vue'

const props = defineProps<{
  schema: KiwiSchema
  data?: KiwiObject
  isEditMode?: boolean
  asChild?: boolean
}>()

const $parameterEditor = ref<InstanceType<typeof ParameterEditor>>()
const $subObjectEditors = ref<InstanceType<typeof SubObjectEditor>[]>([])
const parameters = props.isEditMode
  ? Array.from(props.schema.fields.values())
  : props.schema.constructorParameters
const hasParameters = !!parameters.length
const hasSubSchemas = !!props.schema.subSchemas.length

async function getObjectPaylod() {
  const errors = await $parameterEditor.value?.validate()
  if (errors) throw new Error('Object parameter validate failed')
  const id = props.data?.id
  const parameters = $parameterEditor.value?.getParameters()

  const _children = (await Promise.all(
    $subObjectEditors.value.map(editor => editor.getObjectPayload())
  )) as KiwiCreateOrUpdateObjectChildren[]
  const children = _children.length
    ? _children.reduce(
        (acc, child) => ({
          ...acc,
          ...child,
        }),
        {} as KiwiCreateOrUpdateObjectChildren
      )
    : void 0

  if (!props.asChild)
    return {
      object: {
        id,
        type: props.schema.qualifiedName,
        fields: parameters,
        children,
      },
    } as KiwiCreateOrUpdateObject

  return {
    id,
    fields: parameters,
    children,
  } as KiwiCreateOrUpdateChildObject
}

defineExpose({
  getObjectPaylod,
})
</script>

<template>
  <ParameterEditor
    v-if="hasParameters"
    ref="$parameterEditor"
    :parameters="parameters"
    :data="data"
  />
  <template v-if="hasSubSchemas">
    <SubObjectEditor
      ref="$subObjectEditors"
      v-for="subSchema in schema.subSchemas"
      :key="subSchema.qualifiedName"
      :schema="subSchema"
      :data="data?.children?.[subSchema.name]"
    />
  </template>
</template>
