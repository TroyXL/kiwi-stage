<script setup lang="ts">
import { i18nKey } from '@/lib/i18n'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
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

const loading = ref(false)
const summaries = ref('')
watch(selectedIds, async ids => {
  loading.value = true
  const objects = await kiwiAppAndSchemaStore.kiwiApp!.fetchObjectByIds(ids)
  summaries.value = objects.map(o => o.summary).join(', ')
  loading.value = false
})
// const { loading } = useRequest(
//   () => kiwiAppAndSchemaStore.kiwiApp!.fetchObjectByIds(model.value!),
//   {
//     immediate: !!model.value,
//     async middleware(_ctx, next) {
//       const object = await next()
//       if (!object) return
//       selectedValue.value =
//         kiwiAppAndSchemaStore.kiwiSchema?.transformObjectsToTableRows([
//           object,
//         ])!
//     },
//   }
// )

function handleOpenSelector() {
  if (loading.value) return
  showSelector.value = true
  tempSelectedIds.value = selectedIds.value.concat()
}

function handleCloseSelector() {
  showSelector.value = false
}

function handleClearSelect() {
  selectedIds.value = []
}

function handleConfirmSelect() {
  selectedIds.value = tempSelectedIds.value.concat()
  handleCloseSelector()
}

function handleSelectItems(ids: string[]) {
  tempSelectedIds.value = ids
}
</script>

<template>
  <div class="w-full flex gap-2">
    <a-input
      readonly
      class="relative w-0 flex-1"
      :placeholder="$t(i18nKey.placeholderSelect)"
      :model-value="summaries"
      @click.stop="handleOpenSelector"
    >
      <template #suffix v-if="loading">
        <icon-loading />
      </template>
    </a-input>
    <a-button v-if="selectedIds.length" @click="handleClearSelect">
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
