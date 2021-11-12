import React, { useMemo } from 'react'
import { IColumn, ITableProps } from '@/table/table.type'
import style from '@/table/components/scrollHelper/style.less'

interface IScrollHelperProps {
  useVirtual: boolean
  columns: IColumn[]
  rowHeight: ITableProps['rowHeight']
  dataSource: any[]
  onScroll: (pos: { left: number; top: number }) => void
  width?: number
  height?: number
}

export default function ScrollHelper(props: IScrollHelperProps) {
  const {
    useVirtual,
    width = 600,
    height = 400,
    columns,
    rowHeight,
    dataSource,
    onScroll,
  } = props

  const totalHeight = useMemo<number>(() => {
    if (typeof rowHeight === 'function') {
      const thHeight = rowHeight(dataSource[0], 0)
      return dataSource.reduce(
        (result, data, idx) => result + rowHeight(data, idx),
        thHeight,
      )
    }

    return dataSource.reduce(result => result + rowHeight, rowHeight)
  }, [dataSource, rowHeight])

  if (!useVirtual) {
    return null
  }

  return (
    <div
      className={style.helperContainer}
      style={{ width, height }}
      onScroll={event => {
        const target = event.target as HTMLDivElement
        onScroll({
          left: target.scrollLeft,
          top: target.scrollTop,
        })
      }}
    >
      <table className={style.table} style={{ height: totalHeight }}>
        <colgroup>
          {columns.map((column, idx) => {
            return (
              <col key={column.code + idx} style={{ width: column.width }} />
            )
          })}
        </colgroup>
      </table>
    </div>
  )
}
