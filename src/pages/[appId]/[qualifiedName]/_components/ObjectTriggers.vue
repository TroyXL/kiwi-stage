<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import type { KiwiMethod } from '@/kiwi/schema/method'
import { i18nKey, useI18nText } from '@/lib/i18n'
import { showConfirm } from '@/lib/userInterface'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import MethodInvoker from './MethodInvoker.vue'
import ObjectEditor from './objectEditor/Index.vue'

const props = defineProps<{
  schema: KiwiSchema
  data: KiwiObject
}>()
const emit = defineEmits(['refresh', 'deleted'])

const t = useI18nText()
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const methods = kiwiAppAndSchemaStore.kiwiSchema?.methods || []
const targetMethod = ref<KiwiMethod | null>(null)
const showObjectEditor = ref(false)

function handleInvokeMethod(method: KiwiMethod) {
  targetMethod.value = method
}

const { loading: deleteLoading, send: handleDeleteObject } = useRequest(
  kiwiAppAndSchemaStore.kiwiApp!.deleteObjectById(props.data.id!),
  {
    immediate: false,
    async middleware(_ctx, next) {
      if (
        !(await showConfirm(
          t(i18nKey.confirmDeleteRecord),
          t(i18nKey.actionUndoTip)
        ))
      )
        return
      await next()
      emit('deleted')
      Message.success(t(i18nKey.deletedTip))
    },
  }
)
</script>

<template>
  <a-dropdown
    v-if="methods.length > 3"
    position="tl"
    @select="handleInvokeMethod"
  >
    <a-button type="outline">
      <template #icon>
        <icon-command />
      </template>
      Triggers
    </a-button>
    <template #content>
      <a-doption v-for="method in methods" :key="method.name" :value="method">
        <span class="px-2">
          {{ method.label || method.name }}
        </span>
      </a-doption>
    </template>
  </a-dropdown>

  <a-button
    v-else
    v-for="method in methods"
    :key="method.name"
    :value="method"
    type="secondary"
    @click="handleInvokeMethod(method)"
  >
    <template #icon>
      <icon-command />
    </template>
    {{ method.label || method.name }}
  </a-button>

  <a-button type="outline" @click="showObjectEditor = true">
    <template #icon>
      <icon-pen />
    </template>
  </a-button>

  <a-button
    status="danger"
    type="outline"
    :loading="deleteLoading"
    @click="handleDeleteObject"
  >
    <template #icon>
      <icon-delete />
    </template>
  </a-button>

  <MethodInvoker
    :target-method="targetMethod"
    :data="data"
    @refresh="emit('refresh')"
    @close="targetMethod = null"
  />

  <ObjectEditor
    v-if="schema && data"
    v-model:visible="showObjectEditor"
    :target-schema="schema"
    :data="data"
    @refresh="emit('refresh')"
  />
</template>
