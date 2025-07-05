import { removeStorage } from '@/lib/storage'
import { useRouter } from 'vue-router'

export function useSwitchKiwiApp() {
  const router = useRouter()

  return function () {
    removeStorage('kiwi:app:recent')
    router.replace('/')
  }
}
