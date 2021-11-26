import { IColumn } from '@/table/table.type'

export default class PipelineManager<T = any> {
  private _columns: IColumn<T>[] = []

  private _dataSource: T[] = []

  private readonly state: any

  private readonly setState: (prevState: any) => any

  private rowKey?: (record: T, index: number) => string

  private context?: any

  constructor(
    state: any,
    setState: PipelineManager['setState'],
    context?: any,
  ) {
    this.state = state
    this.setState = setState
    this.context = context
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

  setPrimaryKey(key: string | ((record: T, index: number) => string)): this {
    if (typeof key === 'string') {
      this.rowKey = (record, index) => record[key]
    } else {
      this.rowKey = key
    }
    return this;
  }

  getPrimaryKey() {
    return this.rowKey
  }

  getDataSource() {
    return this._dataSource
  }

  getColumns() {
    return this._columns
  }

  getContext() {
    return this.context
  }
}
