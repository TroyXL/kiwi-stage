<script setup lang="ts">
import { useKiwiAppAndSchemaStore } from '@/controllers/useKiwiAppAndSchemaStore'

const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const methods = kiwiAppAndSchemaStore.getKiwiSchema()?.methods || []
</script>

<template>
  <a-dropdown v-if="methods.length" position="tl">
    <a-button type="outline">
      <template #icon>
        <icon-command />
      </template>
      Triggers
    </a-button>
    <template #content>
      <a-doption v-for="mt in methods" :key="mt.name">{{
        mt.label || mt.name
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
