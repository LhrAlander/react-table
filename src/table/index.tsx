import React, { useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { ITableProps } from '@/table/table.type'
import style from './table.less'
import { ICalculateRenderInfoResult } from '@/table/helpers/calculation.type'
import { calculateRenderInfo } from '@/table/helpers/calculation'

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
  const contentRef = useRef<HTMLDivElement>()

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
        contentRef.current.setAttribute(
          'style',
          `transform: translateY(${info.topBlank}px)`,
        )
      }}
    >
      <div
        className={style.transformHelper}
        style={{ width, height: totalHeight }}
      >
        <div
          style={{ height: totalHeight }}
          className={classNames(style.contentWrapper)}
          ref={contentRef}
        >
          <table className={style.table}>
            <colgroup>
              {columns.map((column, idx) => {
                return (
                  <col
                    key={column.code + idx}
                    style={{ width: column.width }}
                  />
                )
              })}
            </colgroup>
            {/* <thead> */}
            {/*  <tr style={{ height: thTrHeight }}> */}
            {/*    {columns.map((column, idx) => { */}
            {/*      return <th key={column.code + idx}>{column.title}</th> */}
            {/*    })} */}
            {/*  </tr> */}
            {/* </thead> */}
            <tbody>
              {dataSource
                .slice(renderInfo.startIndex, renderInfo.endIndex)
                .map((data, idx) => {
                  const height =
                    typeof rowHeight === 'function'
                      ? rowHeight(data, idx)
                      : rowHeight
                  return (
                    <tr
                      key={`row-${renderInfo.startIndex + idx}`}
                      style={{ height }}
                      data-id={`row-${renderInfo.startIndex + idx}`}
                    >
                      {columns.map((column, cIdx) => {
                        const dataValue = column.code
                          ? data[column.code]
                          : undefined
                        const cell = column.render
                          ? column.render(dataValue, data, idx)
                          : dataValue
                        return (
                          <td
                            key={`row-${
                              renderInfo.startIndex + idx
                            }_column-${cIdx}`}
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
        </div>
      </div>
    </div>
  )
}
