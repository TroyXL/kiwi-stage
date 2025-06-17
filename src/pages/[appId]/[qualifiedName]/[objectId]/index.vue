<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import emitter from '@/lib/emitter'
import { i18nKey } from '@/lib/i18n'
import Scaffold from '@/pages/_components/Scaffold.vue'
import {
  useKiwiAppAndSchemaStore,
  useKiwiSchemaByRouteAndGetParams,
} from '@/stores/useKiwiAppAndSchemaStore'
import { useRequest } from 'alova/client'
import { useRouter } from 'vue-router'
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

function handleDeleteRecord() {
  handleGoBackToList()
  emitter.emit('refreshObjectList')
}
</script>

<template>
  <Scaffold
    :title="$t(i18nKey.recordDetailTitle)"
    show-back
    @back="handleGoBackToList"
  >
    <template #actions v-if="!loading">
      <div class="flex gap-2">
        <ObjectTriggers
          v-if="kiwiAppAndSchemaStore.kiwiSchema && data"
          :schema="kiwiAppAndSchemaStore.kiwiSchema as KiwiSchema"
          :data="data"
          @refresh="handleRefreshDetail"
          @deleted="handleDeleteRecord"
        />
      </div>
    </template>

    <div v-if="loading" class="flex justify-center">
      <a-spin />
    </div>
    <ObjectDetail v-else :data="data" />
  </Scaffold>
</template>
