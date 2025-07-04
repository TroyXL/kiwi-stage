<script setup lang="ts">
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { useWatcher } from 'alova/client'
import { isArray } from 'lodash'
import { ref, watch } from 'vue'
import ObjectList from '../../ObjectList.vue'

const props = defineProps<{
  qualifiedName: string
  multiple?: boolean
}>()
const model = defineModel<string | string[]>()
const selectedIds = ref(
  model.value ? (isArray(model.value) ? model.value : [model.value]) : []
)
const tempSelectedIds = ref<string[]>([])
const showSelector = ref(false)
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()

watch(selectedIds, () => {
  if (!selectedIds.value.length) model.value = void 0
  model.value = props.multiple ? [...selectedIds.value] : selectedIds.value[0]
})

const { loading, data: selectedObjects } = useWatcher(
  () => kiwiAppAndSchemaStore.kiwiApp!.fetchObjectByIds(selectedIds.value),
  [selectedIds],
  {
    immediate: !!model.value,
    initialData: [],
  }
)

function handleOpenSelector() {
  if (loading.value) return
  showSelector.value = true
  tempSelectedIds.value = selectedIds.value.concat()
}

function handleCloseSelector() {
  showSelector.value = false
}

function handleClearSelected() {
  selectedIds.value = []
}

function handleRemoveSelected(data: KiwiObject) {
  selectedIds.value = selectedIds.value.filter(id => id !== data.id)
}

function handleConfirmSelect() {
  selectedIds.value = tempSelectedIds.value.concat()
  handleCloseSelector()
}

function handleSelectItems(ids: string[]) {
  tempSelectedIds.value = ids
}

function handleFormatObject(object: KiwiObject) {
  return object.summary
}
</script>

<template>
  <a-input-tag
    class="relative w-0 flex-1"
    :placeholder="$t(i18nKey.placeholderSelect)"
    :model-value="selectedObjects"
    :allow-clear="!loading"
    :format-tag="handleFormatObject"
    @click="handleOpenSelector"
    @clear.stop="handleClearSelected"
  >
    <template #tag="{ data }">
      <span>
        {{ data.summary }}
      </span>
      <span
        class="ml-1 arco-icon-hover arco-tag-icon-hover arco-tag-close-btn"
        @click.stop="handleRemoveSelected(data)"
      >
        <icon-close />
      </span>
    </template>
    <template #suffix v-if="loading">
      <icon-loading />
    </template>
  </a-input-tag>

  <a-drawer
    unmount-on-close
    body-class="!p-0"
    width="calc(100% - 256px)"
    v-model:visible="showSelector"
    :header="false"
    :footer="false"
  >
    <ObjectList
      :qualified-name="qualifiedName"
      :select-mode="multiple ? 'multiple' : 'single'"
      :selected-value="selectedIds"
      @select="handleSelectItems"
    >
      <template #footer>
        <a-space>
          <a-button @click="handleCloseSelector">
            {{ $t(i18nKey.cancelLabel) }}
          </a-button>
          <a-button
            type="primary"
            :disabled="!tempSelectedIds.length"
            @click="handleConfirmSelect"
          >
            {{ $t(i18nKey.okLabel) }}
          </a-button>
        </a-space>
      </template>
    </ObjectList>
  </a-drawer>
</template>
