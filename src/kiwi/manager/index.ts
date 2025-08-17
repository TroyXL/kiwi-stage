import { KIWI_TOKEN_KEY } from '../lib/constants'
import { createKiwiRequest, setDefaultHeaders } from '../lib/createKiwiRequest'

const KIWI_MANAGER_APP_ID = 2

export class KiwiManager {
  static shared = new KiwiManager()

  private request = createKiwiRequest()

  private constructor() {
    this.request.options.beforeRequest = method => {
      setDefaultHeaders(method.config.headers)
      method.config.headers['X-App-ID'] = KIWI_MANAGER_APP_ID
    }
  }

  hasLogin() {
    return Boolean(localStorage.getItem(KIWI_TOKEN_KEY))
  }

  async loginByCode() {
    // 从 URL 获取 code 参数
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (!code) return
    const { token } = await this.request.Post<{ token: string }>(
      '/auth/login-with-sso-code',
      {
        code,
      }
    )
    localStorage.setItem(KIWI_TOKEN_KEY, token)
    // 移除URL中的code参数并刷新页面
    const url = new URL(window.location.href)
    url.searchParams.delete('code')
    window.location.href = url.toString()
  }

  logout() {
    return this.request.Post('/auth/logout')
  }

  listApps(
    {
      page,
      pageSize,
      name,
      newlyCreatedId,
    }: KiwiPaginationRequest<{
      name?: string
      newlyCreatedId?: string
    }> = {
      page: 1,
      pageSize: 5,
    }
  ) {
    return this.request.Post<
      KiwiPaginationResponse<{
        items: KiwiAppInfo[]
      }>
    >('/app/search', {
      page,
      pageSize,
      name: name?.trim() || void 0,
      newlyCreatedId,
    })
  }

  fetchAppById(appId: string) {
    return this.request.Get<KiwiAppInfo>(`/app/${appId}`)
  }

  createOrUpdateApp(data: { id?: number; name: string }) {
    return this.request.Post<string | undefined>(`/app`, data)
  }

  deleteApp(appId: number) {
    return this.request.Delete(`/app/${appId}`)
  }

  formatAppName(appName: string) {
    return appName.replace(/_/g, '-').trim()
  }
}
