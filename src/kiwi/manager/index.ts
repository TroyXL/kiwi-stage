import { createKiwiRequest } from '../createKiwiRequest'

export type KiwiManagerAuthorization = {
  loginName: string
  password: string
}

const KIWI_MANAGER_APP_ID = 2

export class KiwiManager {
  private request = createKiwiRequest()

  static async create(
    authorization: KiwiManagerAuthorization,
    {
      autoLogin = true,
      autoFetchApps = true,
    }: {
      autoLogin?: boolean
      autoFetchApps?: boolean
    } = {}
  ) {
    const kiwiManager = new KiwiManager()
    if (autoLogin) {
      await kiwiManager.login(authorization)
      if (autoFetchApps) {
        await kiwiManager.listApps()
      }
    }

    return kiwiManager
  }

  private constructor() {
    this.request.options.beforeRequest = method => {
      method.config.credentials = 'include'
      method.config.headers['X-App-ID'] = KIWI_MANAGER_APP_ID
    }
  }

  login(authorization: KiwiManagerAuthorization) {
    return this.request.Post('/login', {
      appId: KIWI_MANAGER_APP_ID,
      ...authorization,
    })
  }

  logout() {
    return this.request.Post('/logout')
  }

  listApps() {
    return this.request.Get('/app', {
      params: {
        page: 1,
        pageSize: 20,
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
