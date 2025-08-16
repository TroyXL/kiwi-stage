import { KiwiApp, KiwiSchema } from '@/kiwi'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useKiwiAppAndSchemaStore = defineStore(
  'kiwiSchemaAndObjects',
  () => {
    const kiwiApp = ref<KiwiApp | null>(null)
    const kiwiSchema = ref<KiwiSchema | null>(null)
    const qualifiedName = ref('')

    async function switchKiwiApp(appId: string) {
      kiwiApp.value = await KiwiApp.createByAppId(appId)
      return kiwiApp.value
    }

    function switchKiwiSchema(newQualifiedName: string) {
      if (qualifiedName.value === newQualifiedName) return
      disposeKiwiSchema()
      qualifiedName.value = newQualifiedName
      kiwiSchema.value =
        kiwiApp.value?.getSchemaByQualifiedName(qualifiedName.value) ?? null
    }

    function disposeKiwiApp() {
      kiwiApp.value?.dispose()
      kiwiApp.value = null
      disposeKiwiSchema()
    }

    function disposeKiwiSchema() {
      kiwiSchema.value = null
      qualifiedName.value = ''
    }

    return {
      kiwiApp,
      kiwiSchema,
      qualifiedName,
      switchKiwiApp,
      switchKiwiSchema,
      disposeKiwiApp,
    }
  }
)

export function useKiwiSchemaByRouteAndGetParams() {
  const kiwiAppAndSchemaStore = useKiwiAppAndSchemaStore()
  const route = useRoute('/[appId]/[qualifiedName]/[objectId]/')
  const params = computed(() => route.params)
  const qualifiedName = computed(() => route.params.qualifiedName)
  watch(
    qualifiedName,
    value => {
      kiwiAppAndSchemaStore.switchKiwiSchema(value)
    },
    { immediate: true }
  )
  return params
}
