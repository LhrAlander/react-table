import React from 'react'
import { ITableHeadProps } from '@/table/tableHead.type'
import style from '@/table/table.less'

function TableHead(props: ITableHeadProps, ref) {
  const { columns } = props

  return (
    <table className={style.table} ref={ref}>
      <colgroup>
        {columns.map((column, idx) => {
          return <col key={column.code + idx} style={{ width: column.width }} />
        })}
      </colgroup>
      <thead>
        <tr>
          {columns.map((column, index) => {
            return <th key={column.code + index}>{column.title}</th>
          })}
        </tr>
      </thead>
    </table>
  )
}

export default React.forwardRef(TableHead)
