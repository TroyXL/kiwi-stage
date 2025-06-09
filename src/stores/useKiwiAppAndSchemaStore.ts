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

    async function switchKiwiApp(appId: number) {
      kiwiApp = await KiwiApp.createByAppId(appId)
      return kiwiApp
    }
    KiwiApp.createByAppId
    function disposeKiwiApp() {
      kiwiApp?.dispose()
      kiwiApp = null
      kiwiSchema = null
      qualifiedName = ''
    }

    function switchKiwiClassSchema(_qualifiedName: string) {
      kiwiSchema = kiwiApp?.getSchemaByQualifiedName(_qualifiedName) ?? null
      qualifiedName = _qualifiedName
      return kiwiSchema
    }

    const selectedObject = ref<KiwiTableRow | null>(null)
    const isEditObject = ref(false)
    function showObjectPreview(
      object: KiwiTableRow | null,
      isEditMode = false
    ) {
      selectedObject.value = object
      isEditObject.value = isEditMode
    }

    const willInvokeMethod = ref<KiwiMethod | null>(null)
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
      isEditObject,
      showObjectPreview,
      willInvokeMethod,
      invokeMethod,
    }
  }
)
