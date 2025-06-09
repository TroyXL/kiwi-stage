import { mapValues } from 'lodash'
import { KiwiField, type KiwiTableColumn, type KiwiTableRow } from './field'
import type { KiwiPrimitiveType } from './type'

export abstract class KiwiSchema {
  readonly access: KiwiAccess = 'public'
  readonly isAbstract: boolean
  abstract readonly tag: KiwiClassTag
  readonly name: string
  readonly qualifiedName: string
  readonly label: string
  readonly enumConstants: KiwiEnumConstant[]
  readonly subSchemas: KiwiSchema[]
  readonly fields = new Map<string, KiwiField>()

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

  static from(
    schema: KiwiSchemaInterface,
    created: KiwiSchemaCreated
  ): KiwiSchema {
    switch (schema.tag) {
      case 'class':
      default:
        return new KiwiClassSchema(schema, created)
      case 'interface':
        return new KiwiInterfaceSchema(schema, created)
      case 'enum':
        return new KiwiEnumSchema(schema, created)
      case 'value':
        return new KiwiValueSchema(schema, created)
    }
  }

  constructor(schema: KiwiSchemaInterface, created: KiwiSchemaCreated) {
    this.access = schema.access
    this.isAbstract = schema.abstract
    this.name = schema.name
    this.qualifiedName = schema.qualifiedName
    this.label = schema.label
    this.enumConstants = schema.enumConstants
    this.subSchemas = schema.classes.map(subSchema =>
      KiwiSchema.from(subSchema, created)
    )
    schema.fields?.forEach(field =>
      this.fields.set(field.name, new KiwiField(field))
    )
    created(this)
  }

  transformObjectsToTableRows(objects: KiwiObject[]): KiwiTableRow[] {
    return objects.map(obj => {
      const row: KiwiTableRow = {
        id: obj.id,
        __summary__: obj.summary,
      }

      if (obj.fields) {
        mapValues(obj.fields, (value, key) => {
          const kiwiField = this.fields.get(key)
          if (!kiwiField) return

          if (kiwiField.type.kind === 'primitive')
            row[key] = (kiwiField.type as KiwiPrimitiveType).formatValue(value)
          else row[key] = (value as KiwiObject).summary
        })
      }

      return row
    })
  }
}

export class KiwiClassSchema extends KiwiSchema {
  readonly tag: KiwiClassTag = 'class'
  readonly isBean: boolean
  readonly beanName?: string

  constructor(schema: KiwiSchemaInterface, created: KiwiSchemaCreated) {
    super(schema, created)
    this.isBean = !!schema.beanName
    this.beanName = schema.beanName
  }
}

export class KiwiInterfaceSchema extends KiwiSchema {
  readonly tag: KiwiClassTag = 'interface'
}

export class KiwiEnumSchema extends KiwiSchema {
  readonly tag: KiwiClassTag = 'enum'

  private _options: KiwiEnumConstant[] | null = null
  get options() {
    if (!this._options) {
      this._options = this.subSchemas.map(subSchema => {
        const index = parseInt(subSchema.name.substring(1))
        if (isNaN(index)) {
          throw new Error(
            `Invalid enum constant name: ${subSchema.name} in ${this.name}`
          )
        }
        const option = this.enumConstants[index]
        if (!option) {
          throw new Error(
            `Invalid enum constant index: ${index} in ${this.name}`
          )
        }
        return option
      })
    }
    return this._options
  }
}

export class KiwiValueSchema extends KiwiSchema {
  readonly tag: KiwiClassTag = 'value'
}
