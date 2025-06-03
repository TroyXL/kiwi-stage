export type KiwiClassAccess = 'public' | 'private' | 'protected' | 'package'
export type KiwiClassTag = 'class' | 'interface' | 'enum' | 'value'

export interface KiwiEnumConstant {
  name: string
  label: string
}

export interface KiwiSchemaInterface {
  access: KiwiClassAccess
  abstract: boolean
  tag: KiwiClassTag
  name: string
  qualifiedName: string
  label: string
  classes: KiwiSchemaInterface[]
  enumConstants: KiwiEnumConstant[]
}

export type KiwiSchemaCreated = (schema: KiwiSchema) => void

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
        return new KiwiClass(schema, created)
      case 'interface':
        return new KiwiInterface(schema, created)
      case 'enum':
        return new KiwiEnum(schema, created)
      case 'value':
        return new KiwiValue(schema, created)
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

class KiwiClass extends KiwiSchema {
  readonly tag: KiwiClassTag = 'class'
}

class KiwiInterface extends KiwiSchema {
  readonly tag: KiwiClassTag = 'interface'
}

class KiwiEnum extends KiwiSchema {
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

class KiwiValue extends KiwiSchema {
  readonly tag: KiwiClassTag = 'value'
}
