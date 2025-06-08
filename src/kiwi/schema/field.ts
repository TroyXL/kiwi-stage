import { KiwiType } from './type'

export type KiwiTableColumn = {
  dataIndex: string
  title: string
  field: KiwiField
}

export class KiwiField {
  access: KiwiAccess
  name: string
  label: string
  type: KiwiType
  summary: boolean

  constructor(field: KiwiFieldInterface) {
    this.access = field.access
    this.name = field.name
    this.label = field.label
    this.type = KiwiType.from(field.type)
    this.summary = field.summary
  }

  get tableColumn(): KiwiTableColumn {
    return {
      dataIndex: this.name,
      title: this.label,
      field: this,
    }
  }
}
