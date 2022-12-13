import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { ITableProps } from '@/table/table.type'
import style from './table.less'
import { ICalculateRenderInfoResult } from '@/table/helpers/calculation.type'
import { newCalculator } from '@/table/helpers/calculation'
import { TableBody } from '@/table/tableBody'
import TableHead from '@/table/tableHead'
import CalculatorContext from '@/contexts/calculator'
import useForceUpdate from '@/hooks/useForceUpdate'
import calculator from '@/contexts/calculator'

export default function BaseTable<T = any>(props: ITableProps<T>) {
  const {
    columns,
    rowHeight,
    dataSource,
    virtual,
    width = 600,
    height = 400,
    rowProps,
    rowKey,
  } = props
  const inRender = useRef(false)

  const domRef = useRef<HTMLDivElement>()
  const contentRef = useRef<HTMLDivElement>()
  const tableHeadRef = useRef<HTMLDivElement>()
  const forceUpdate = useForceUpdate()
  const calculator = useRef(newCalculator<T>(dataSource, rowHeight, rowKey))

  useEffect(() => {
    calculator.current.updateReRenderFn(forceUpdate)
  }, [forceUpdate, calculator])

  useEffect(() => {
    calculator.current.setRowKey(rowKey)
  }, [rowKey, calculator])

  useEffect(() => {
    calculator.current.setNewData(dataSource)
  }, [dataSource, calculator])

  const [renderInfo, setRenderInfo] = useState<ICalculateRenderInfoResult>(
    calculator.current.getVerticalRenderRange(dataSource, height, 0),
  )

  const tableWidth = useMemo<number>(() => {
    return Math.max(
      width,
      columns.reduce((res, column) => res + column.width, 0),
    )
  }, [columns, width])

  const lastOffsetY = useRef(0)
  useLayoutEffect(() => {
    inRender.current = true
  }, [renderInfo])
  useEffect(() => {
    domRef.current.scrollTop = lastOffsetY.current
  }, [renderInfo])

  return (
    <div
      className={style.tableContainer}
      style={{ width, height }}
      ref={domRef}
      onScroll={event => {
        const target = event.target as HTMLDivElement
        const offsetY = target.scrollTop
        lastOffsetY.current = offsetY

        const info = calculator.current.getVerticalRenderRange(
          dataSource,
          height,
          offsetY,
        )
        setRenderInfo(info)
        target.scrollTop = offsetY
      }}
    >
      <div className={style.transformHelper} style={{ width }}>
        <div
          ref={tableHeadRef}
          className={style.tableHeadContainer}
          style={{ width: tableWidth }}
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
          className={classNames(style.contentWrapper)}
          ref={contentRef}
          onScroll={e => {
            const target = e.target as HTMLDivElement
            if (tableHeadRef.current) {
              tableHeadRef.current.scrollLeft = target.scrollLeft
            }
          }}
        >
          {renderInfo.topBlank > 0 && (
            <div
              key="top-blank"
              className={classNames(style.top)}
              style={{ height: renderInfo.topBlank }}
            />
          )}
          <TableBody
            columns={columns}
            dataSource={dataSource}
            rowHeight={rowHeight}
            renderInfo={renderInfo}
            rowProps={rowProps}
          />
          {renderInfo.bottomBlank > 0 && (
            <div
              key="bottom-blank"
              className={classNames(style.bottom)}
              style={{ height: renderInfo.bottomBlank }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
