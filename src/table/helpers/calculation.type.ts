import { ITableProps } from '@/table/table.type'

export interface ICalculateRenderInfoParams {
  dataSource: any[]
  rowHeight: ITableProps['rowHeight']
  offsetY: number
  renderHeight: number
}

export interface ICalculateRenderInfoResult {
  startIndex: number
  endIndex: number
  topBlank: number
  bottomBlank: number
  offsetY: number
}
