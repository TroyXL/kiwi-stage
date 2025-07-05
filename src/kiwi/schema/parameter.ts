import { KiwiPrimitiveType, KiwiType } from './type'

const TEMPORARY_IGNORE_TYPES: KiwiPrimitiveTypeEnum[] = [
  'byte',
  'short',
  'char',
]
const NIL_TYPES: KiwiPrimitiveTypeEnum[] = ['void', 'null', 'never']
const IGNORE_TYPES: KiwiPrimitiveTypeEnum[] = [
  ...TEMPORARY_IGNORE_TYPES,
  ...NIL_TYPES,
  'any',
]

export class KiwiParameter {
  name: string
  label: string
  type: KiwiType

  // UI 相关属性
  ignore = false
  required = true

  constructor(parameter: KiwiParameterInterface) {
    this.name = parameter.name
    this.label = parameter.label
    this.type = KiwiType.from(parameter.type)
    if (this.type.kind === 'primitive') {
      this.ignore = IGNORE_TYPES.includes((this.type as KiwiPrimitiveType).name)
    }
    if (this.type.kind === 'union') {
      this.required = false
      const alternativeTypes = parameter.type.alternatives || []
      const firstNotNillType = alternativeTypes.find(
        type => !(type.kind === 'primitive' && NIL_TYPES.includes(type.name!))
      )
      if (firstNotNillType) {
        this.type = KiwiType.from(firstNotNillType)
      }
    }
  }
}
