import { createKiwiRequest } from '../lib/createKiwiRequest'

const KIWI_MANAGER_APP_ID = 2

export class KiwiManager {
  static shared = new KiwiManager()

  private request = createKiwiRequest()

  private constructor() {
    this.request.options.beforeRequest = method => {
      method.config.credentials = 'include'
      method.config.headers['X-App-ID'] = KIWI_MANAGER_APP_ID
    }
  }

  async hasLogin() {
    const loginInfo = await this.getLoginInfo()
    return loginInfo.appId > -1
  }

  login(authorization: KiwiManagerAuthorization) {
    return this.request.Post<KiwiManagerLoginInfo>('/login', {
      appId: KIWI_MANAGER_APP_ID,
      ...authorization,
    })
  }

  loginAsDemo() {
    return this.login({
      loginName: 'demo',
      password: '123456',
    })
  }

  getLoginInfo() {
    return this.request.Get<KiwiManagerLoginInfo>('/get-login-info')
  }

  logout() {
    return this.request.Post('/logout')
  }

  listApps(
    {
      page,
      pageSize,
      searchText,
      newlyCreatedId,
    }: KiwiPaginationRequest<{
      searchText?: string
      newlyCreatedId?: string
    }> = {
      page: 1,
      pageSize: 5,
    }
  ) {
    return this.request.Get<
      KiwiPaginationResponse<{
        items: KiwiAppInfo[]
      }>
    >('/app', {
      params: {
        page,
        pageSize,
        searchText: searchText?.trim() || void 0,
        newlyCreatedId,
      },
    })
  }

  fetchAppById(appId: number) {
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
