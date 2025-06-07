import { createKiwiRequest } from '../createKiwiRequest'

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
    }: KiwiPaginationRequest & {
      searchText?: string
    } = {
      page: 1,
      pageSize: 5,
    }
  ) {
    searchText = searchText?.trim()
    return this.request.Get<
      KiwiPaginationResponse<{
        items: KiwiAppInfo[]
      }>
    >('/app', {
      params: {
        page,
        pageSize,
        searchText: searchText || void 0,
      },
    })
  }

  fetchAppById(appId: number) {
    return this.request.Get<KiwiAppInfo>(`/app/${appId}`)
  }

  createOrUpdateApp(data: { id?: number; name: string }) {
    return this.request.Post(`/app`, data)
  }

  deleteApp(appId: number) {
    return this.request.Delete(`/app/${appId}`)
  }
}
