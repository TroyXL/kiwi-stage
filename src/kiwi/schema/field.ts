import { KiwiParameter } from './parameter'

export type KiwiTableColumn = {
  dataIndex: string
  title: string
  field: KiwiField
}

export type KiwiTableRow = {
  __id__?: string
  __summary__?: string
} & Dict

export class KiwiField extends KiwiParameter {
  access: KiwiAccess
  summary: boolean

  constructor(field: KiwiFieldInterface) {
    super(field)
    this.access = field.access
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
