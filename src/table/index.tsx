import React, { useRef } from 'react'
import classNames from 'classnames'
import { ITableProps } from '@/table/table.type'
import style from './table.less'
import ScrollHelper from '@/table/components/scrollHelper'

export default function BaseTable<T = any>(props: ITableProps<T>) {
  const {
    columns,
    rowHeight,
    dataSource,
    virtual,
    width = 600,
    height = 400,
  } = props

  const thTrHeight =
    typeof rowHeight === 'function' ? rowHeight(dataSource[0], 0) : rowHeight

  const domRef = useRef<HTMLDivElement>()

  return (
    <div className={style.tableContainer}>
      <ScrollHelper
        useVirtual={virtual}
        columns={columns}
        width={width}
        height={height}
        dataSource={dataSource}
        rowHeight={rowHeight}
        onScroll={({ left, top }) => {
          domRef.current.scrollTop = top
          domRef.current.scrollLeft = left
        }}
      />
      <div
        className={classNames(style.contentWrapper, {
          [style.isVirtual]: virtual,
        })}
        style={{ width, height }}
        ref={domRef}
      >
        <table className={style.table}>
          <colgroup>
            {columns.map((column, idx) => {
              return (
                <col key={column.code + idx} style={{ width: column.width }} />
              )
            })}
          </colgroup>
          <thead>
            <tr style={{ height: thTrHeight }}>
              {columns.map((column, idx) => {
                return <th key={column.code + idx}>{column.title}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((data, idx) => {
              const height =
                typeof rowHeight === 'function'
                  ? rowHeight(data, idx)
                  : rowHeight
              return (
                <tr key={`row-${idx}`} style={{ height }}>
                  {columns.map((column, cIdx) => {
                    const dataValue = column.code
                      ? data[column.code]
                      : undefined
                    const cell = column.render
                      ? column.render(dataValue, data, idx)
                      : dataValue
                    return <td key={`row-${idx}_column-${cIdx}`}>{cell}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
