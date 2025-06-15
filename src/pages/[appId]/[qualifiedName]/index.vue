<script setup lang="ts">
import {
  useKiwiAppAndSchemaStore,
  useKiwiSchemaByRouteAndGetParams,
} from '@/stores/useKiwiAppAndSchemaStore'
import { useRouter } from 'vue-router'
import ObjectList from './_components/ObjectList.vue'

defineOptions({
  name: 'KiwiObjectsPage',
})

const router = useRouter()
const params = useKiwiSchemaByRouteAndGetParams()
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()

function handleShowObjectDetail(objectId: string) {
  router.replace({
    name: '/[appId]/[qualifiedName]/[objectId]/',
    params: {
      ...params.value,
      objectId,
    },
  })
}
</script>

<template>
  <ObjectList
    :qualified-name="kiwiAppAndSchemaStore.qualifiedName"
    @show-detail="handleShowObjectDetail"
  />
</template>
