<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute('/[appId]/[qualifiedName]')
const params = computed(() => route.params)
</script>

<template>
  <div>{{ params.appId }}</div>
  <div>{{ params.qualifiedName }}</div>
</template>
