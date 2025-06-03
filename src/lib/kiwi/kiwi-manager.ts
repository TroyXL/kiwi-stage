import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { KIWI_BASE_REQUEST_URL, KIWI_REQUEST_TIMEOUT } from './constants'

export type KiwiManagerAuthorization = {
  appId: number
  loginName: string
  password: string
}

export class KiwiManager {
  appId: number
  private request = createAlova({
    baseURL: KIWI_BASE_REQUEST_URL,
    timeout: KIWI_REQUEST_TIMEOUT,
    requestAdapter: adapterFetch(),
    responded: response => response.json(),
  })

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
    const kiwiManager = new KiwiManager(authorization)
    if (autoLogin) {
      await kiwiManager.login(authorization)
      if (autoFetchApps) {
        await kiwiManager.listApps()
      }
    }

    return kiwiManager
  }

  private constructor(authorization: KiwiManagerAuthorization) {
    this.appId = authorization.appId
    this.request.options.beforeRequest = method => {
      method.config.headers['X-App-ID'] = this.appId
    }
  }

  login(authorization: KiwiManagerAuthorization) {
    return this.request.Post('/login', authorization)
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
