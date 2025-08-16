import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'
import { KIWI_TOKEN_KEY } from './constants'
import { gotoKiwiLogin } from './utils'

let errorHandler: KiwiErrorHandler | void = void 0

export function setupKiwiErrorHandler(handler: KiwiErrorHandler) {
  errorHandler = handler
}

function buildAndThrowError(message: string, showError = true) {
  const error = new Error(message)
  if (showError) errorHandler?.(error)
  throw error
}

export function createKiwiRequest(baseURL: string) {
  return createAlova({
    baseURL,
    // timeout: KIWI_REQUEST_TIMEOUT,
    cacheFor: null,
    statesHook: vueHook,
    requestAdapter: adapterFetch(),
    responded: async response => {
      const status = response.status

      if (status === 401 || status === 403) {
        gotoKiwiLogin()
        buildAndThrowError('Unauthorized ' + status, false)
      }

      // 处理 204 或空响应
      if (status === 204 || response.headers.get('content-length') === '0') {
        return {}
      }

      if (status >= 200 && status < 300) return response.json()

      // 处理其他错误
      let errorMessage = `API request failed with status ${response.status}`

      try {
        const errorData: ErrorResponse = await response.json()
        if (errorData?.message) errorMessage = errorData.message
      } catch {
        console.error(
          'Could not parse API error response body:',
          await response.text()
        )
      }

      buildAndThrowError(errorMessage)
    },
  })
}

export function setDefaultHeaders(headers: Record<string, any>) {
  const token = localStorage.getItem(KIWI_TOKEN_KEY)
  if (token) headers['Authorization'] = `Bearer ${token}`
}
