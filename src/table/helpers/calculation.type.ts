import { ITableProps } from '@/table/table.type'

export interface ICalculateRenderInfoParams {
  dataSource: any[]
  rowHeight: ITableProps['rowHeight']
  offsetY: number
  renderHeight: number
}

export interface ICalculateRenderInfoResult {
  topIndex: number
  bottomIndex: number
  topBlank: number
  bottomBlank: number
}
