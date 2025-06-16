<script setup lang="ts">
import type { KiwiTableRow } from '@/kiwi/schema/field'
import text from '@/lib/text'
import { ref } from 'vue'
import ObjectList from '../../ObjectList.vue'

const showSelector = ref(false)
const selectedRow = ref<KiwiTableRow | null>(null)

function handleCloseSelector() {
  showSelector.value = false
}

function handleConfirmSelect() {
  handleCloseSelector()
}

function handleSelectItem(row: KiwiTableRow) {
  selectedRow.value = row
}
</script>

<template>
  <a-input
    readonly
    allow-clear
    :placeholder="text.placeholderSelect"
    @click="showSelector = true"
  />

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
      qualified-name="Product"
      is-select-mode
      @select="handleSelectItem"
    >
      <template #footer>
        <a-space>
          <a-button @click="handleCloseSelector">
            {{ text.cancelLabel }}
          </a-button>
          <a-button
            type="primary"
            :disabled="!selectedRow"
            @click="handleConfirmSelect"
            >{{ text.okLabel }}</a-button
          >
        </a-space>
      </template>
    </ObjectList>
  </a-drawer>
</template>
