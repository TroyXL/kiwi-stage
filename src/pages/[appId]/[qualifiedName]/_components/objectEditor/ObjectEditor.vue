<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { useTemplateRef } from 'vue'
import ParameterEditor from '../parameterEditor/Index.vue'
import SubObjectEditor from './SubObjectEditor.vue'

const props = defineProps<{
  schema: KiwiSchema
  data?: KiwiObject
  asChild?: boolean
}>()

const $parameterEditor =
  useTemplateRef<InstanceType<typeof ParameterEditor>>('$parameterEditor')
const hasParameters = !!props.schema?.constructorParameters.length
const hasSubSchemas = !!props.schema.subSchemas.length

async function getObjectPaylod() {
  const errors = await $parameterEditor.value?.validate()
  if (errors) return
  const parameters = $parameterEditor.value?.getParameters()

  if (!props.asChild)
    return {
      object: {
        id: props.data?.id,
        type: props.schema.qualifiedName,
        fields: parameters,
      },
    } as KiwiCreateOrUpdateObject

  return {
    [props.schema.qualifiedName]: [{ fields: parameters }],
  } as KiwiCreateOrUpdateObjectChildren
}

defineExpose({
  getObjectPaylod,
})
</script>

<template>
  <ParameterEditor
    v-if="hasParameters"
    ref="$parameterEditor"
    :parameters="schema!.constructorParameters"
    :data="data"
  />
  <template v-if="hasSubSchemas">
    <SubObjectEditor
      v-for="subSchema in schema.subSchemas"
      :key="subSchema.qualifiedName"
      :schema="subSchema"
      :data="data?.children?.[subSchema.name]"
    />
  </template>
</template>
