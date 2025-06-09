import { KiwiType } from './type'

export class KiwiParameter {
  name: string
  label: string
  type: KiwiType

  constructor(parameter: KiwiParameterInterface) {
    this.name = parameter.name
    this.label = parameter.label
    this.type = KiwiType.from(parameter.type)
  }
}
