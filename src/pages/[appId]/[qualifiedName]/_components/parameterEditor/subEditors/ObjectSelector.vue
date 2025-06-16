<script setup lang="ts">
import type { KiwiTableRow } from '@/kiwi/schema/field'
import text from '@/lib/text'
import { ref } from 'vue'
import ObjectList from '../../ObjectList.vue'

defineProps<{
  qualifiedName: string
}>()

const showSelector = ref(false)
const selectedRow = ref<KiwiTableRow | null>(null)
const tempSelectedRow = ref<KiwiTableRow | null>(null)

function handleOpenSelector() {
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
  <a-space>
    <a-input
      readonly
      :placeholder="text.placeholderSelect"
      :model-value="selectedRow?.__summary__"
      @click="handleOpenSelector"
    />
    <a-button v-if="selectedRow" @click="handleClearSelect">
      <template #icon>
        <icon-close />
      </template>
    </a-button>
  </a-space>

  <a-drawer
    unmount-on-close
    class="clear-mask-layer"
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
            {{ text.cancelLabel }}
          </a-button>
          <a-button
            type="primary"
            :disabled="!tempSelectedRow"
            @click="handleConfirmSelect"
          >
            {{ text.okLabel }}
          </a-button>
        </a-space>
      </template>
    </ObjectList>
  </a-drawer>
</template>
