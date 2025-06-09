import { KiwiParameter } from './parameter'
import { KiwiType } from './type'

export class KiwiMethod {
  access: KiwiAccess
  abstract: boolean
  name: string
  label: string
  parameters: KiwiParameterInterface[]
  returnType: KiwiTypeInterface

  constructor(method: KiwiMethodInterface) {
    this.access = method.access
    this.abstract = method.abstract
    this.name = method.name
    this.label = method.label
    this.parameters = method.parameters.map(p => new KiwiParameter(p))
    this.returnType = KiwiType.from(method.returnType)
  }
}
