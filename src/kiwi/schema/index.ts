import { mapValues } from 'lodash'
import { KiwiField, type KiwiTableColumn, type KiwiTableRow } from './field'
import { KiwiMethod } from './method'
import { KiwiParameter } from './parameter'
import type { KiwiPrimitiveType } from './type'

export * from './field'
export * from './method'
export * from './parameter'
export * from './type'

export class KiwiSchema {
  readonly access: KiwiAccess = 'public'
  readonly isAbstract: boolean
  readonly tag: KiwiClassTag
  readonly name: string
  readonly qualifiedName: string
  readonly label: string
  readonly isBean: boolean
  readonly beanName?: string
  readonly constructorParameters: KiwiParameter[]
  readonly enumConstants: KiwiEnumConstant[]
  readonly subSchemas: KiwiSchema[]
  readonly fields = new Map<string, KiwiField>()
  readonly methods: KiwiMethod[] = []

  private _tableColumns: KiwiTableColumn[] | null = null
  get tableColumns(): KiwiTableColumn[] {
    if (!this._tableColumns) {
      this._tableColumns = Array.from(this.fields.values()).reduce(
        (tableColumns, field) => {
          if (field.summary) tableColumns.unshift(field.tableColumn)
          else tableColumns.push(field.tableColumn)
          return tableColumns
        },
        [] as KiwiTableColumn[]
      )
    }
    return this._tableColumns
  }

  private _validMethodNames: string[] | null = null
  get validMethodNames() {
    if (!this._validMethodNames) {
      this._validMethodNames = this.methods.map(method => method.name)
    }
    return this._validMethodNames
  }

  constructor(schema: KiwiSchemaInterface, created: KiwiSchemaCreated) {
    this.tag = schema.tag
    this.access = schema.access
    this.isAbstract = schema.abstract
    this.name = schema.name
    this.qualifiedName = schema.qualifiedName
    this.label = schema.label
    this.isBean = !!schema.beanName
    this.beanName = schema.beanName
    this.constructorParameters = schema.constructor.parameters.map(
      param => new KiwiParameter(param)
    )
    this.enumConstants = schema.enumConstants
    this.subSchemas = schema.classes.map(
      subSchema => new KiwiSchema(subSchema, created)
    )
    this.methods =
      schema.methods
        ?.filter(method => !method.abstract && method.access === 'public')
        .map(method => new KiwiMethod(method)) ?? []
    schema.fields?.forEach(field =>
      this.fields.set(field.name, new KiwiField(field))
    )
    created(this)
  }

  transformObjectsToTableRows(objects: KiwiObject[]): KiwiTableRow[] {
    return objects.map(obj => {
      const row: KiwiTableRow = {
        __id__: obj.id,
        __summary__: obj.summary,
      }

      if (obj.fields) {
        mapValues(obj.fields, (value, key) => {
          const kiwiField = this.fields.get(key)
          if (!kiwiField) return
          const kind = kiwiField.type.kind

          if (kind === 'primitive')
            row[key] = (kiwiField.type as KiwiPrimitiveType).formatValue(value)
          else if (kind === 'array') {
            // const elementType = (kiwiField.type as KiwiArrayType).elementType
            row[key] = (value as KiwiObject[])
              ?.map(item => item.summary)
              .join(', ')
          } else row[key] = (value as KiwiObject).summary
        })
      }

      return row
    })
  }

  createEmptyObject(): KiwiObject {
    return {
      type: this.qualifiedName,
      summary: '',
      fields: {},
      children: this.subSchemas ? {} : void 0,
    }
  }
}
