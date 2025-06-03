import { createKiwiRequest } from '../createKiwiRequest'
import {
  KiwiSchema,
  type KiwiSchemaCreated,
  type KiwiSchemaInterface,
} from '../schema'

export class KiwiApp {
  private request = createKiwiRequest()

  appId: number
  private _schemaPool = new Map<string, KiwiSchema>()

  private _rootSchemas: KiwiSchema[] = []
  get rootSchemas() {
    return this._rootSchemas
  }

  static async createByAppId(appId: number, autoSetupSchemaPool = true) {
    const kiwiApp = new KiwiApp(appId)
    if (autoSetupSchemaPool) await kiwiApp.setupSchemaPool()
    return kiwiApp
  }

  private constructor(appId: number) {
    this.appId = appId
    this.request.options.beforeRequest = method => {
      method.config.credentials = 'include'
      method.config.headers['X-App-ID'] = appId
    }
  }

  async setupSchemaPool() {
    const { classes: metaSchemaList } = await this.request.Get<{
      classes: KiwiSchemaInterface[]
    }>('/schema')
    const schemaCreated: KiwiSchemaCreated = schema => {
      this._schemaPool.set(schema.qualifiedName, schema)
    }
    this._rootSchemas = metaSchemaList.map(metaSchema =>
      KiwiSchema.from(metaSchema, schemaCreated)
    )
    console.log(this._rootSchemas)
  }
}
