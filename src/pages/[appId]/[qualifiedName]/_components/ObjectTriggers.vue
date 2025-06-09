<script setup lang="ts">
import type { KiwiMethod } from '@/kiwi/schema/method'
import { useKiwiAppAndSchemaStore } from '@/stores/useKiwiAppAndSchemaStore'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const methods = kiwiAppAndSchemaStore.getKiwiSchema()?.methods || []

function handleInvokeMethod(method: KiwiMethod) {
  kiwiAppAndSchemaStore.invokeMethod(method)
}
</script>

<template>
  <a-dropdown v-if="methods.length" position="tl" @select="handleInvokeMethod">
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
  <a-button status="danger" type="outline">
    <template #icon>
      <icon-delete />
    </template>
    Delete
  </a-button>
</template>
