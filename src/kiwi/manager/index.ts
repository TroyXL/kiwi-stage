import { createKiwiRequest } from '../createKiwiRequest'

export type KiwiManagerAuthorization = {
  loginName: string
  password: string
}

export type KiwiManagerLoginInfo = {
  appId: number
  userId: string
}

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

  listApps() {
    return this.request.Get('/app', {
      params: {
        page: 1,
        pageSize: 100,
        searchText: void 0,
      },
    })
  }

  saveOrUpdateApp() {
    // TODO - save or update app
  }

  deleteApp() {
    // TODO - delete app
  }
}
