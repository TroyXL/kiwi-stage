import { KIWI_APP_RECENT } from '@/lib/storageKeys'
import { useRouter } from 'vue-router'

export function useSwitchKiwiApp() {
  const router = useRouter()

  return function () {
    localStorage.removeItem(KIWI_APP_RECENT)
    router.replace('/')
  }
}
