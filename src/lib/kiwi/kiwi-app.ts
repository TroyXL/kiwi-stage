import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { KIWI_BASE_REQUEST_URL, KIWI_REQUEST_TIMEOUT } from './constants'

export class KiwiApp {
  appId: number
  private request = createAlova({
    baseURL: KIWI_BASE_REQUEST_URL,
    timeout: KIWI_REQUEST_TIMEOUT,
    requestAdapter: adapterFetch(),
    responded: response => response.json(),
  })

  static async createByAppId(appId: number, autoSetupSchema = true) {
    const kiwiApp = new KiwiApp(appId)
    if (autoSetupSchema) await kiwiApp.setupSchema()
    return kiwiApp
  }

  private constructor(appId: number) {
    this.appId = appId
    this.request.options.beforeRequest = method => {
      method.config.headers['X-App-ID'] = appId
    }
  }

  async setupSchema() {
    const res = await this.request.Get('/schema')
    return res
  }
}
