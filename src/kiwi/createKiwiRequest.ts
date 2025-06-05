import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'
import { KIWI_BASE_REQUEST_URL } from './constants'

export function createKiwiRequest() {
  return createAlova({
    // 配置请求时携带cookie
    baseURL: KIWI_BASE_REQUEST_URL,
    // timeout: KIWI_REQUEST_TIMEOUT,
    cacheFor: null,
    statesHook: vueHook,
    requestAdapter: adapterFetch(),
    responded: async response => {
      const { code, message, data } = (await response.json()) as {
        code: number
        message?: string
        data: any
      }
      if (code === 0) return data
      throw new Error(message)
    },
  })
}
