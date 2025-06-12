import { createKiwiRequest } from '../createKiwiRequest'
import { KiwiManager } from '../manager'
import { KiwiClassSchema, KiwiSchema } from '../schema'

export class KiwiApp {
  private static _current: KiwiApp | null = null
  static get current() {
    // if (!this._current) throw new Error('KiwiApp not initialized')
    return this._current
  }

  static async createByAppId(appId: number) {
    KiwiApp._current = new KiwiApp(appId)
    await Promise.allSettled([
      KiwiApp._current.getAppInfo(),
      KiwiApp._current.setupSchemaPool(),
    ])
    return KiwiApp._current
  }

  readonly request = createKiwiRequest()

  appId: number
  private _appInfo!: KiwiAppInfo
  get appInfo() {
    return this._appInfo
  }

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

  async getAppInfo() {
    this._appInfo = await KiwiManager.shared.fetchAppById(this.appId)
    return this._appInfo
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

  getSchemaByQualifiedName(qualifiedName: string) {
    return this._schemaPool.get(qualifiedName)
  }

  getFullType(typeName: string) {
    return `org.kiwi.${this.appInfo.name}.${typeName}`
  }

  parseFullType(fullTypeName: string) {
    return fullTypeName.replace(`org.kiwi.${this.appInfo.name}.`, '')
  }

  fetchObjects(
    payload: KiwiPaginationRequest<{
      // refer to schema.qualifiedName
      type?: string
      criteria?: Dict
      newlyCreated?: string
    }> = {
      page: 1,
      pageSize: 20,
    }
  ) {
    return this.request.Post<KiwiPaginationResponse<{ items: KiwiObject[] }>>(
      '/object/search',
      payload
    )
  }

  fetchObjectById(id: string) {
    return this.request.Get<KiwiObject>(`/object/${id}`)
  }
}
