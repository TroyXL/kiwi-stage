import { KiwiApp, KiwiSchema } from '@/kiwi'
import type { KiwiTableRow } from '@/kiwi/schema/field'
import type { KiwiMethod } from '@/kiwi/schema/method'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKiwiAppAndSchemaStore = defineStore(
  'kiwiSchemaAndObjects',
  () => {
    let kiwiApp: KiwiApp | null = null
    let kiwiSchema: KiwiSchema | null = null
    let qualifiedName = ''

    const selectedObject = ref({
      id: '',
      loading: false,
      isEdit: false,
      data: null as KiwiTableRow | null,
    })

    const willInvokeMethod = ref<KiwiMethod | null>(null)

    async function switchKiwiApp(appId: number) {
      kiwiApp = await KiwiApp.createByAppId(appId)
      return kiwiApp
    }

    function disposeKiwiApp() {
      kiwiApp?.dispose()
      kiwiApp = null
      disposeKiwiClassSchema()
    }

    function disposeKiwiClassSchema() {
      kiwiSchema = null
      qualifiedName = ''
      selectedObject.value = {
        id: '',
        loading: false,
        isEdit: false,
        data: null,
      }
      willInvokeMethod.value = null
    }

    function switchKiwiClassSchema(_qualifiedName: string) {
      disposeKiwiClassSchema()
      kiwiSchema = kiwiApp?.getSchemaByQualifiedName(_qualifiedName) ?? null
      qualifiedName = _qualifiedName
      return kiwiSchema
    }

    async function showObjectPreview(objectId: string, isEditMode = false) {
      selectedObject.value.id = objectId
      selectedObject.value.isEdit = isEditMode
      selectedObject.value.data = null
      if (!objectId) return
      selectedObject.value.loading = true
      const res = await kiwiApp?.fetchObjectById(objectId)
      if (res) {
        const rows = kiwiSchema?.transformObjectsToTableRows([res])
        selectedObject.value.data = rows?.[0] ?? null
      }
      selectedObject.value.loading = false
    }

    function refreshObjectPreview() {
      showObjectPreview(selectedObject.value.id, selectedObject.value.isEdit)
    }

    function invokeMethod(method: KiwiMethod | null) {
      willInvokeMethod.value = method
    }

    return {
      getKiwiApp() {
        return kiwiApp
      },
      getKiwiSchema() {
        return kiwiSchema
      },
      fetQualifiedName() {
        return qualifiedName
      },
      switchKiwiApp,
      disposeKiwiApp,
      switchKiwiClassSchema,
      selectedObject,
      showObjectPreview,
      refreshObjectPreview,
      willInvokeMethod,
      invokeMethod,
    }
  }
)
