export abstract class KiwiType {
  kind: KiwiTypeKind

  static from(type: KiwiTypeInterface) {
    switch (type.kind) {
      case 'primitive':
        return new KiwiPrimitiveType(type)
      case 'class':
        return new KiwiClassType(type)
      case 'array':
        return new KiwiArrayType(type)
      case 'union':
        return new KiwiUnionType(type)
    }
  }

  constructor(kind: KiwiTypeKind) {
    this.kind = kind
  }
}

export class KiwiPrimitiveType extends KiwiType {
  name: KiwiPrimitiveTypeEnum

  constructor(type: KiwiTypeInterface) {
    super('primitive')
    this.name = type.name!
  }

  formatValue(value: any) {
    switch (this.name) {
      case 'boolean':
        return value ? 'YES' : 'NO'
      default:
        return value
    }
  }
}

export class KiwiClassType extends KiwiType {
  qualifiedName: string

  constructor(type: KiwiTypeInterface) {
    super('class')
    this.qualifiedName = type.qualifiedName!
  }
}

export class KiwiArrayType extends KiwiType {
  elementType: KiwiType

  constructor(type: KiwiTypeInterface) {
    super('array')
    this.elementType = KiwiType.from(type.elementType!)
  }
}

export class KiwiUnionType extends KiwiType {
  alternatives: KiwiType[]

  constructor(type: KiwiTypeInterface) {
    super('union')
    this.alternatives = type.alternatives!.map(KiwiType.from)
  }
}
