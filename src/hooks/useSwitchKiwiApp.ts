import { useRouter } from 'vue-router'

export function useSwitchKiwiApp() {
  const router = useRouter()

  return function () {
    router.replace('/')
  }
}
