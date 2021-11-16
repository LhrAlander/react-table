import { IColumn, ITableProps } from '@/table/table.type'
import { ICalculateRenderInfoResult } from '@/table/helpers/calculation.type'

export interface ITableBodyProps {
  columns: IColumn[]
  dataSource: any[]
  rowHeight: ITableProps['rowHeight']
  renderInfo: ICalculateRenderInfoResult
  rowProps?: ITableProps['rowProps']
}
