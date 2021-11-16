import React, { ReactNode } from 'react'

export interface ITableProps<T = any> {
  columns: IColumn<T>[]
  dataSource: T[]
  rowHeight?: number | ((rowData: T, index: number) => number)
  virtual?: boolean
  width?: number
  height?: number
  rowProps?: (rowData: T, index: number) => React.HTMLAttributes<any>
}

export interface IColumn<T = any> {
  title: ReactNode
  code?: string
  render?: (value: string, rowData: T, index: number) => ReactNode
  width: number
}
