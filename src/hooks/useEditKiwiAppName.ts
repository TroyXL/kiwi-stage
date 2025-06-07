import { KiwiManager } from '@/kiwi'
import { ref, watch } from 'vue'

export function useEditKiwiAppName() {
  const appName = ref('')

  watch(
    appName,
    newValue => (appName.value = KiwiManager.shared.formatAppName(newValue))
  )

  return appName
}
