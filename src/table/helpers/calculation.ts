import { ICalculateRenderInfoResult } from '@/table/helpers/calculation.type'
import { ITableProps } from '@/table/table.type'

const OVERSCAN_SIZE = 100

type TRowHeight<T> = ITableProps<T>['rowHeight']
type TRowKey<T> = ITableProps<T>['rowKey']
type NeedRender = boolean

export default class Calculator<T = unknown> {
  private data: T[] = []

  private cache: Record<string, number> = {}

  private rowHeight: TRowHeight<T> = 48

  private rowKey: TRowKey<T> = '' as keyof T

  private reRender: () => void

  constructor(data: T[], rowHeight: TRowHeight<T>, rowKey: TRowKey<T>) {
    console.log('in constructor')
    this.init(data, rowHeight)
    this.setRowKey(rowKey)
    this.reRender = () => {}
  }

  setRowKey(rowKey: TRowKey<T>) {
    console.log('set row key')
    this.rowKey = rowKey
  }

  setNewData(newData: T[]) {
    console.log('set new data')
    this.init(newData, this.rowHeight)
  }

  private getRowKey(row: T, idx: number): string {
    if (typeof this.rowKey === 'function') {
      return this.rowKey(row, idx)
    }
    return row[this.rowKey] as string
  }

  private getRowHeight(row: T, idx: number): number {
    const key = this.getRowKey(row, idx)
    if (this.cache[key] !== undefined) {
      return this.cache[key]
    }
    if (typeof this.rowHeight === 'function') {
      return this.rowHeight(row, idx)
    }
    return this.rowHeight
  }

  init(newData: T[], rowHeight: TRowHeight<T>) {
    this.rowHeight = rowHeight
    this.cache = newData.reduce<Record<string, number>>((res, data, idx) => {
      const key = this.getRowKey(data, idx)
      if (this.cache[key] !== undefined) {
        return {
          ...res,
          [key]: this.cache[key],
        }
      }
      if (typeof this.rowHeight === 'number') {
        return {
          ...res,
          [key]: this.rowHeight,
        }
      }
      return {
        ...res,
        [key]: this.rowHeight(data, idx),
      }
    }, {})
    this.data = [...newData]
  }

  updateReRenderFn(fn: () => void) {
    this.reRender = fn
  }

  updateRowHeight(row: T, idx: number, height: number): NeedRender {
    const key = this.getRowKey(row, idx)
    if (this.cache[key] === height) {
      return false
    }
    this.cache[key] = height
    this.reRender()
    return true
  }

  // 获取纵向的渲染高度，这一部分代码参考 ali-react-table 源码的处理，逻辑比较简单，自行理解
  getVerticalRenderRange(
    newData: T[],
    renderHeight: number,
    offset: number,
  ): ICalculateRenderInfoResult {
    this.init(newData, this.rowHeight)
    const topInfo = this.getTopRenderInfo(offset)
    const bottomInfo = this.getBottomRenderInfo(offset + renderHeight, topInfo)
    return {
      ...topInfo,
      ...bottomInfo,
    }
  }

  private getTopRenderInfo(offset: number) {
    if (this.data.length === 0) {
      return { topIndex: 0, topBlank: 0 }
    }

    let topIndex = 0
    let topBlank = 0
    while (topIndex < this.data.length) {
      const h = this.getRowHeight(this.data[topIndex], topIndex)
      if (topBlank + h >= offset) {
        break
      }
      topBlank += h
      topIndex += 1
    }
    return this.overscanUpwards(topIndex, topBlank)
  }

  private overscanUpwards(topIndex: number, topBlank: number) {
    let overscanSize = 0
    let overscanCount = 0
    while (overscanCount < topIndex && overscanSize < OVERSCAN_SIZE) {
      overscanCount += 1
      const idx = topIndex - overscanCount
      overscanSize += this.getRowHeight(this.data[idx], idx)
    }
    return {
      topIndex: topIndex - overscanCount,
      topBlank: topBlank - overscanSize,
    }
  }

  private getBottomRenderInfo(
    endOffset: number,
    startInfo: ReturnType<typeof this.overscanUpwards>,
  ) {
    let bottomIndex = startInfo.topIndex
    let offset = startInfo.topBlank
    while (bottomIndex < this.data.length && offset < endOffset) {
      offset += this.getRowHeight(this.data[bottomIndex], bottomIndex)
      bottomIndex += 1
    }
    const bottomBlank =
      this.data.reduce((r, row, idx) => {
        return r + this.getRowHeight(row, idx)
      }, 0) - offset
    return this.overscanDownwards(bottomIndex, bottomBlank)
  }

  private overscanDownwards(bottomIndex: number, bottomBlank: number) {
    let overscanSize = 0
    let overscanCount = 0
    while (
      overscanCount < this.data.length - bottomIndex &&
      overscanSize < OVERSCAN_SIZE
    ) {
      const idx = bottomIndex + overscanCount
      overscanSize += this.getRowHeight(this.data[idx], idx)
      overscanCount += 1
    }
    return {
      bottomIndex: bottomIndex + overscanCount,
      bottomBlank: bottomBlank - overscanSize,
    }
  }
}

export function newCalculator<T = unknown>(
  data: T[],
  rowHeight: TRowHeight<T>,
  rowKey: TRowKey<T>,
) {
  console.log('in new function')
  return new Calculator(data, rowHeight, rowKey)
}
