import React, { useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { ITableProps } from '@/table/table.type'
import style from './table.less'
import { ICalculateRenderInfoResult } from '@/table/helpers/calculation.type'
import { calculateRenderInfo } from '@/table/helpers/calculation'
import { TableBody } from '@/table/tableBody'
import TableHead from '@/table/tableHead'

export default function BaseTable<T = any>(props: ITableProps<T>) {
  const {
    columns,
    rowHeight,
    dataSource,
    virtual,
    width = 600,
    height = 400,
    rowProps,
  } = props

  const domRef = useRef<HTMLDivElement>()
  const contentRef = useRef<HTMLDivElement>()
  const tableHeadRef = useRef<HTMLDivElement>()

  const [renderInfo, setRenderInfo] = useState<ICalculateRenderInfoResult>(
    calculateRenderInfo({
      offsetY: 0,
      dataSource,
      rowHeight,
      renderHeight: height,
    }),
  )

  /**
   * TODO: FIX ME 没有计算表头的高度
   */
  const totalHeight = useMemo<number>(() => {
    if (typeof rowHeight === 'number') {
      return dataSource.length * rowHeight
    }

    return dataSource.reduce<number>((res, data, idx) => {
      return res + rowHeight(data, idx)
    }, 0)
  }, [dataSource, rowHeight])

  return (
    <div
      className={style.tableContainer}
      style={{ width, height }}
      ref={domRef}
      onScroll={event => {
        const target = event.target as HTMLDivElement
        const offsetY = target.scrollTop
        const info = calculateRenderInfo({
          rowHeight,
          dataSource,
          renderHeight: height,
          offsetY,
        })
        setRenderInfo(info)
        if (contentRef.current) {
          contentRef.current.setAttribute(
            'style',
            `transform: translateY(${info.topBlank}px)`,
          )
        }
      }}
    >
      <div
        className={style.transformHelper}
        style={{ width, height: totalHeight }}
      >
        <div
          ref={tableHeadRef}
          className={style.tableHeadContainer}
          onScroll={e => {
            const { scrollLeft } = e.target as HTMLDivElement
            if (contentRef.current) {
              contentRef.current.scrollLeft = scrollLeft
            }
          }}
        >
          <TableHead columns={columns} />
        </div>
        <div
          style={{ height: totalHeight }}
          className={classNames(style.contentWrapper)}
          ref={contentRef}
          onScroll={e => {
            const target = e.target as HTMLDivElement
            if (tableHeadRef.current) {
              tableHeadRef.current.scrollLeft = target.scrollLeft
            }
          }}
        >
          <TableBody
            columns={columns}
            dataSource={dataSource}
            rowHeight={rowHeight}
            renderInfo={renderInfo}
            rowProps={rowProps}
          />
        </div>
      </div>
    </div>
  )
}
