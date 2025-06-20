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
    <a-row class="mb-2 flex !items-center">
      <a-col class="text-right pr-4" :span="5">
        <span class="font-medium">{{ schema.label }}</span>
        <a-divider direction="vertical" />
        <span class="text-muted-foreground">{{ schema.name }}</span>
      </a-col>
      <a-col :span="16" class="text-right">
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
      </a-col>
    </a-row>
    <div v-if="displayedData?.length" class="border-t py-5">
      <div v-for="(item, index) in displayedData" :key="item.__tempKey__">
        <ObjectEditor
          ref="$objectEditors"
          :schema="schema"
          :data="item"
          as-child
        />
        <a-row class="pb-5">
          <a-col class="flex justify-end gap-2" :span="21">
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
          </a-col>
        </a-row>
      </div>
    </div>
  </template>
</template>
