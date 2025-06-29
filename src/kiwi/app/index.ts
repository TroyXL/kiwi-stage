import { createKiwiRequest } from '../lib/createKiwiRequest'
import { trimStringInData } from '../lib/utils'
import { KiwiManager } from '../manager'
import { KiwiSchema } from '../schema'
import type { KiwiParameter } from '../schema/parameter'
import type {
  KiwiArrayType,
  KiwiClassType,
  KiwiPrimitiveType,
  KiwiUnionType,
} from '../schema/type'

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
      schema => schema.tag === 'class' && !schema.isBean
    )
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
    this._rootSchemas = metaSchemaList.map(
      metaSchema => new KiwiSchema(metaSchema, schemaCreated)
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
      newlyCreatedId?: string
    }> = {
      page: 1,
      pageSize: 10,
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

  fetchObjectByIds(
    ids: string[],
    config: {
      excludeChildren?: boolean
      excludeFields?: boolean
    } = {}
  ) {
    return this.request.Post<KiwiObject[]>(`/object/multi-get`, {
      ids,
      ...config,
    })
  }

  deleteObjectById(id: string) {
    return this.request.Delete(`/object/${id}`)
  }

  createOrUpdateObject(data: KiwiCreateOrUpdateObject) {
    return this.request.Post<string | undefined>(
      '/object',
      trimStringInData(data)
    )
  }

  invokeMethod(
    schema: KiwiSchema,
    methodName: string,
    objectId: string,
    parameters?: Dict
  ) {
    if (!objectId) throw new Error('Object id is required to invoke method')
    if (!methodName) throw new Error('Method name is required to invoke method')
    if (!schema.validMethodNames.includes(methodName))
      throw new Error(`Method <${methodName}> not found`)

    return KiwiApp.current?.request.Post('/object/invoke', {
      receiver: {
        id: objectId,
      },
      method: methodName,
      arguments: parameters,
    })
  }

  generateByAI(prompt: string) {
    return this.request.Post('/aigc/generate', {
      appId: this.appId,
      prompt,
    })
  }

  transformParametersToFormData(
    parameters: KiwiParameter[],
    data?: KiwiObject
  ) {
    return parameters.reduce((formData, param) => {
      if (param.ignore) return formData

      const value = data?.fields?.[param.name]

      if (param.type.kind === 'primitive') {
        formData[param.name] = this.getValueByPrimitiveType(
          param.type as KiwiPrimitiveType,
          value
        )
      } else if (param.type.kind === 'class') {
        formData[param.name] = this.getValueByClassType(
          param.type as KiwiClassType,
          value
        )
      } else if (param.type.kind === 'array') {
        const elementType = (param.type as KiwiArrayType).elementType
        if (elementType.kind === 'primitive') {
          formData[param.name] =
            (value as [])?.map((item: KiwiObject, index) => ({
              __key__: index,
              value: this.getValueByPrimitiveType(
                elementType as KiwiPrimitiveType,
                item
              ),
            })) ?? []
        } else if (elementType.kind === 'class') {
          formData[param.name] =
            (value as [])?.map((item: KiwiObject) =>
              this.getValueByClassType(elementType as KiwiClassType, item)
            ) ?? []
        }
      } else if (param.type.kind === 'union') {
        const types = (param.type as KiwiUnionType).alternatives
      }
      // console.log('=== formData =', formData)
      return formData
    }, {} as Dict)
  }

  getValueByPrimitiveType(type: KiwiPrimitiveType, value?: any) {
    const typeName = (type as KiwiPrimitiveType).name
    return (
      value ?? (typeName === 'string' ? '' : typeName === 'boolean' ? false : 0)
    )
  }

  getValueByClassType(type: KiwiClassType, value?: any) {
    const qualifiedName = (type as KiwiClassType).qualifiedName
    const kiwiSchema = this.getSchemaByQualifiedName(qualifiedName)
    const kiwiSchemaTag = kiwiSchema?.tag
    if (kiwiSchemaTag) {
      return kiwiSchemaTag === 'enum'
        ? value?.name
        : kiwiSchemaTag === 'class'
        ? value?.id
        : kiwiSchemaTag === 'value'
        ? this.transformParametersToFormData(
            kiwiSchema.constructorParameters,
            value
          )
        : void 0
    }
  }

  transformFormDataToFormattedParameters(
    parameters: KiwiParameter[],
    formData: Dict
  ) {
    return parameters.reduce((formatted, param) => {
      if (param.ignore) return formData

      const value = formData[param.name]
      if (param.type.kind === 'primitive') {
        formatted[param.name] = value
      } else if (param.type.kind === 'class') {
        formatted[param.name] = this.getFormattedClassParameterByType(
          param.type as KiwiClassType,
          value
        )
      } else if (param.type.kind === 'array') {
        const elementType = (param.type as KiwiArrayType).elementType
        const values = (value as [])?.map(
          (item: { value: any }) => item.value ?? item
        )
        if (elementType.kind === 'primitive') {
          formatted[param.name] = values
        } else if (elementType.kind === 'class') {
          formatted[param.name] = values?.map((item: any) =>
            this.getFormattedClassParameterByType(
              elementType as KiwiClassType,
              item
            )
          )
        }
      } else if (param.type.kind === 'union') {
        const types = (param.type as KiwiUnionType).alternatives
      }

      return formatted
    }, {} as Dict)
  }

  getFormattedClassParameterByType(type: KiwiClassType, value: any) {
    const qualifiedName = type.qualifiedName
    const kiwiSchema = this.getSchemaByQualifiedName(qualifiedName)
    const kiwiSchemaTag = kiwiSchema?.tag
    if (kiwiSchemaTag) {
      return kiwiSchemaTag === 'enum'
        ? {
            type: qualifiedName,
            name: value,
          }
        : kiwiSchemaTag === 'class'
        ? {
            type: qualifiedName,
            id: value,
          }
        : kiwiSchemaTag === 'value'
        ? {
            type: qualifiedName,
            fields: this.transformFormDataToFormattedParameters(
              kiwiSchema.constructorParameters,
              value
            ),
          }
        : void 0
    }
  }
}
