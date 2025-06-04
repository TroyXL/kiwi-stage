export type KiwiClassAccess = 'public' | 'private' | 'protected' | 'package'
export type KiwiClassTag = 'class' | 'interface' | 'enum' | 'value'

export abstract class KiwiSchema {
  readonly access: KiwiClassAccess = 'public'
  readonly isAbstract: boolean
  abstract readonly tag: KiwiClassTag
  readonly name: string
  readonly qualifiedName: string
  readonly label: string
  readonly enumConstants: KiwiEnumConstant[]
  readonly subSchemas: KiwiSchema[] = []

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
    this.subSchemas = this.subSchemasTransformer(schema.classes, created)
    created(this)
  }

  subSchemasTransformer(
    subSchemas: KiwiSchemaInterface[],
    created: KiwiSchemaCreated
  ): KiwiSchema[] {
    return subSchemas.map(subSchema => KiwiSchema.from(subSchema, created))
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
