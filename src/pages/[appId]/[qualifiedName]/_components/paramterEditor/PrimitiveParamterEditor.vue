<script setup lang="ts">
import type { KiwiType } from '@/kiwi/schema/type'

const prop = defineProps<{
  name: string
  label: string
  type: KiwiType
}>()

const model = defineModel()
</script>

<template></template>
