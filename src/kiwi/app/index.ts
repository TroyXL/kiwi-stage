import { createKiwiRequest } from '../createKiwiRequest'
import { KiwiManager } from '../manager'
import { KiwiClassSchema, KiwiSchema } from '../schema'

export class KiwiApp {
  private static _current: KiwiApp | null = null
  static get current() {
    // if (!this._current) throw new Error('KiwiApp not initialized')
    return this._current
  }

  private request = createKiwiRequest()

  appId: number
  private _schemaPool = new Map<string, KiwiSchema>()

  private _rootSchemas: KiwiSchema[] = []
  get rootSchemas() {
    return this._rootSchemas
  }

  get rootClassSchemas() {
    return this._rootSchemas.filter(
      schema => schema.tag === 'class' && !(schema as KiwiClassSchema).isBean
    ) as KiwiClassSchema[]
  }

  static async createByAppId(appId: number) {
    KiwiApp._current = new KiwiApp(appId)
    return KiwiApp._current
  }

  private constructor(appId: number) {
    this.appId = appId
    this.request.options.beforeRequest = method => {
      method.config.credentials = 'include'
      method.config.headers['X-App-ID'] = appId
    }
  }

  dispose() {
    KiwiApp._current = null
  }

  fetchAppInfo() {
    return KiwiManager.shared.fetchAppById(this.appId)
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
