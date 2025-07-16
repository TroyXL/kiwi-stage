import { KIWI_CHAT_URL } from '@/kiwi/lib/constants'
import { IS_PRODUCTION } from '@/lib/constants'
import { useRouter } from 'vue-router'

export function useGotoLogin() {
  const router = useRouter()

  return () => {
    if (IS_PRODUCTION) window.location.href = KIWI_CHAT_URL
    else router.replace('/login')
  }
}
