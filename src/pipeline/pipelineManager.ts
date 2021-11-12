import { IColumn } from '@/table/table.type'

export default class PipelineManager<T = any> {
  private _columns: IColumn<T>[] = []

  private _dataSource: T[] = []

  private readonly state: any

  private readonly setState: (prevState: any) => any

  constructor(state: any, setState: PipelineManager['setState']) {
    this.state = state
    this.setState = setState
  }

  use(nextMiddleWare: (pipeline: this) => this): this {
    return nextMiddleWare(this)
  }

  dataSource(dataSource: T[]): this {
    this._dataSource = dataSource
    return this
  }

  columns(columns: IColumn<T>[]): this {
    this._columns = columns
    return this
  }

  getTableProps(): { columns: IColumn<T>[]; dataSource: T[] } {
    return {
      columns: this._columns,
      dataSource: this._dataSource,
    }
  }
}
