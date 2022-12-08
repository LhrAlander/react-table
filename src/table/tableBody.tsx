import React from 'react'
import style from '@/table/table.less'
import { ITableBodyProps } from '@/table/tableBody.type'

export function TableBody(props: ITableBodyProps) {
  const { renderInfo, columns, dataSource, rowHeight, rowProps } = props
  return (
    <table className={style.table}>
      <colgroup>
        {columns.map((column, idx) => {
          return <col key={column.code + idx} style={{ width: column.width }} />
        })}
      </colgroup>
      <tbody>
        {dataSource
          .slice(renderInfo.topIndex, renderInfo.bottomIndex)
          .map((data, idx) => {
            const height =
              typeof rowHeight === 'function'
                ? rowHeight(data, idx + renderInfo.topIndex)
                : rowHeight
            const _props = rowProps
              ? rowProps(data, idx + renderInfo.topIndex)
              : {}
            return (
              <tr
                key={`row-${renderInfo.topIndex + idx}`}
                style={{ height }}
                data-id={`row-${renderInfo.topIndex + idx}`}
                {..._props}
              >
                {columns.map((column, cIdx) => {
                  const dataValue = column.code ? data[column.code] : undefined
                  const cell = column.render
                    ? column.render(dataValue, data, idx)
                    : dataValue
                  return (
                    <td
                      key={`row-${renderInfo.topIndex + idx}_column-${cIdx}`}
                    >
                      {cell}
                    </td>
                  )
                })}
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
