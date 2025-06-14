import { KiwiPrimitiveType, KiwiType } from './type'

const TEMPORARY_IGNORE_TYPES: KiwiPrimitiveTypeEnum[] = [
  'byte',
  'short',
  'char',
]
const IGNORE_TYPES: KiwiPrimitiveTypeEnum[] = [
  ...TEMPORARY_IGNORE_TYPES,
  'void',
  'null',
  'never',
  'any',
]

export class KiwiParameter {
  name: string
  label: string
  type: KiwiType

  // UI 相关属性
  ignore = false
  required = false

  constructor(parameter: KiwiParameterInterface) {
    this.name = parameter.name
    this.label = parameter.label
    this.type = KiwiType.from(parameter.type)
    if (this.type.kind === 'primitive') {
      this.ignore = IGNORE_TYPES.includes((this.type as KiwiPrimitiveType).name)
    }
    if (this.type.kind !== 'union') {
      this.required = true
    } else {
      // TODO: union type
    }
  }
}
