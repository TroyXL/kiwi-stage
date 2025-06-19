<script setup lang="ts">
import type { KiwiTableRow } from '@/kiwi/schema/field'
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import ObjectList from '../../ObjectList.vue'

defineProps<{
  qualifiedName: string
}>()
const model = defineModel<string>()

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()

const showSelector = ref(false)
const selectedRow = ref<KiwiTableRow | null>(null)
const tempSelectedRow = ref<KiwiTableRow | null>(null)

const { loading } = useRequest(
  () => kiwiAppAndSchemaStore.kiwiApp!.fetchObjectById(model.value!),
  {
    immediate: !!model.value,
    async middleware(_ctx, next) {
      const object = await next()
      if (!object) return
      selectedRow.value =
        kiwiAppAndSchemaStore.kiwiSchema?.transformObjectsToTableRows([
          object,
        ])[0]!
    },
  }
)

function handleOpenSelector() {
  if (loading.value) return
  showSelector.value = true
  tempSelectedRow.value = selectedRow.value
}

function handleCloseSelector() {
  showSelector.value = false
}

function handleClearSelect() {
  selectedRow.value = null
  handleCloseSelector()
}

function handleConfirmSelect() {
  selectedRow.value = tempSelectedRow.value
  handleCloseSelector()
}

function handleSelectItem(row: KiwiTableRow) {
  tempSelectedRow.value = row
}
</script>

<template>
  <div class="w-full flex gap-2">
    <a-input
      readonly
      class="w-0 flex-1"
      :placeholder="$t(i18nKey.placeholderSelect)"
      :model-value="selectedRow?.__summary__"
      @click="handleOpenSelector"
    >
      <template #suffix v-if="loading">
        <icon-loading />
      </template>
    </a-input>
    <a-button v-if="selectedRow" @click="handleClearSelect">
      <template #icon>
        <icon-close />
      </template>
    </a-button>
  </div>

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
      is-select-mode
      :selected-id="selectedRow?.__id__"
      @select="handleSelectItem"
    >
      <template #footer>
        <a-space>
          <a-button @click="handleCloseSelector">
            {{ $t(i18nKey.cancelLabel) }}
          </a-button>
          <a-button
            type="primary"
            :disabled="!tempSelectedRow"
            @click="handleConfirmSelect"
          >
            {{ $t(i18nKey.okLabel) }}
          </a-button>
        </a-space>
      </template>
    </ObjectList>
  </a-drawer>
</template>
