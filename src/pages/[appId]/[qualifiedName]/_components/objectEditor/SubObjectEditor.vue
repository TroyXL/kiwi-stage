<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { generateRandomString } from '@/lib/utils'
import { computed, ref } from 'vue'
import ObjectEditor from './ObjectEditor.vue'

const props = defineProps<{
  schema: KiwiSchema
  data?: KiwiObject[]
}>()

const hasParameters = !!props.schema?.constructorParameters.length

const $objectEditors = ref<InstanceType<typeof ObjectEditor>[]>([])

const displayedData = ref(
  props.data?.map(item => ({
    ...item,
    __tempKey__: generateRandomString(),
  })) || []
)
const dataMaxIndex = computed(() => displayedData.value.length - 1)

function handleRemoveData(tempKey: string) {
  displayedData.value = displayedData.value.filter(
    item => item.__tempKey__ !== tempKey
  )
}

function handleAddData() {
  displayedData.value.push({
    ...props.schema.createEmptyObject(),
    __tempKey__: generateRandomString(),
  })
}

async function getObjectPayload() {
  const payloads = await Promise.all(
    $objectEditors.value.map(editor => editor.getObjectPaylod())
  )
  if (!payloads.length) return
  return {
    [props.schema.name]: payloads,
  } as KiwiCreateOrUpdateObjectChildren
}

defineExpose({
  getObjectPayload,
})
</script>

<template>
  <template v-if="hasParameters">
    <div class="mb-2 flex items-center justify-between">
      <p>
        <span class="font-medium">{{ schema.label }}</span>
        <a-divider direction="vertical" />
        <span class="text-muted-foreground">{{ schema.name }}</span>
      </p>
      <a-button
        v-if="dataMaxIndex < 0"
        type="primary"
        size="mini"
        @click="handleAddData"
      >
        <template #icon>
          <icon-plus />
        </template>
        {{ $t(i18nKey.addLabel) }}
      </a-button>
    </div>

    <div v-if="displayedData?.length" class="border-t py-5">
      <div v-for="(item, index) in displayedData" :key="item.__tempKey__">
        <ObjectEditor
          ref="$objectEditors"
          :schema="schema"
          :data="item"
          as-child
        />
        <div class="pb-5 flex justify-end gap-2">
          <a-button
            v-if="index === dataMaxIndex"
            type="primary"
            @click="handleAddData"
          >
            <template #icon>
              <icon-plus />
            </template>
            {{ $t(i18nKey.addLabel) }}
          </a-button>
          <a-button
            type="secondary"
            status="danger"
            @click="handleRemoveData(item.__tempKey__)"
          >
            <template #icon>
              <icon-delete />
            </template>
            {{ $t(i18nKey.removeLabel) }}
          </a-button>
        </div>
      </div>
    </div>
  </template>
</template>
