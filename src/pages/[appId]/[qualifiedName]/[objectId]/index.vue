<script setup lang="ts">
import emitter from '@/lib/emitter'
import {
  useKiwiAppAndSchemaStore,
  useKiwiSchemaByRouteAndGetParams,
} from '@/stores/useKiwiAppAndSchemaStore'
import { useRequest } from 'alova/client'
import { useRouter } from 'vue-router'
import MethodInvoker from '../_components/MethodInvoker.vue'
import ObjectDetail from '../_components/ObjectDetail.vue'
import ObjectTriggers from '../_components/ObjectTriggers.vue'

const params = useKiwiSchemaByRouteAndGetParams()
const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
const router = useRouter()

const { objectId, ...otherParams } = params.value
const {
  loading,
  data,
  send: refreshDetail,
} = useRequest(kiwiAppAndSchemaStore.kiwiApp!.fetchObjectById(objectId))

function handleGoBackToList() {
  router.replace({
    name: '/[appId]/[qualifiedName]/',
    params: {
      ...otherParams,
    },
  })
}

function handleRefreshDetail() {
  refreshDetail()
  emitter.emit('refreshObjectList')
}
</script>

<template>
  <a-page-header
    class="fixed z-10 left-60 top-14 right-0 bottom-0 bg-background"
    title="Record Detail"
    @back="handleGoBackToList"
  >
    <template #extra v-if="!loading">
      <div class="flex gap-2">
        <ObjectTriggers />
      </div>
    </template>

    <div v-if="loading" class="flex justify-center">
      <a-spin />
    </div>
    <ObjectDetail v-else :data="data" />
  </a-page-header>
  <MethodInvoker @refresh="handleRefreshDetail" />
</template>
