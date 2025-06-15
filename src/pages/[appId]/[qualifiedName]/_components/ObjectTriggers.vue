<script setup lang="ts">
import type { KiwiMethod } from '@/kiwi/schema/method'
import { showConfirm } from '@/lib/userInterface'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import MethodInvoker from './MethodInvoker.vue'

const props = defineProps<{
  data: KiwiObject
}>()
const emit = defineEmits(['refresh', 'deleted'])

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const methods = kiwiAppAndSchemaStore.kiwiSchema?.methods || []
const targetMethod = ref<KiwiMethod | null>(null)

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
          'Confirm delete this record?',
          'This action cannot be undo'
        ))
      )
        return
      await next()
      emit('deleted')
      Message.success('Deleted')
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
      <a-doption v-for="method in methods" :key="method.name" :value="method">{{
        method.label || method.name
      }}</a-doption>
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

  <a-button type="outline">
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
</template>
