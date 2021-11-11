import { ReactNode } from 'react'

export interface ITableProps<T = any> {
  columns: IColumn<T>[]
  dataSource: T[]
  rowHeight?: number | ((rowData: T, index: number) => number)
  virtual?: boolean
}

export interface IColumn<T = any> {
  title: ReactNode
  code?: string
  render?: (value: string, rowData: T, index: number) => ReactNode
  width: number
}
