import React from 'react'
import { ITableProps } from '@/table/table.type'
import style from './table.less'

console.log(style)

export default function BaseTable<T = any>(props: ITableProps<T>) {
  const { columns, rowHeight, dataSource, virtual } = props
  return (
    <div className={style.tableContainer}>
      <table className={style.table}>
        <colgroup>
          {columns.map((column, idx) => {
            return (
              <col key={column.code + idx} style={{ width: column.width }} />
            )
          })}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, idx) => {
              return <th key={column.code + idx}>{column.title}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((data, idx) => {
            return (
              <tr>
                {columns.map((column, cIdx) => {
                  const dataValue = column.code ? data[column.code] : undefined
                  const cell = column.render
                    ? column.render(dataValue, data, idx)
                    : dataValue
                  return <td key={`row-${idx}_column-${cIdx}`}>{dataValue}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
