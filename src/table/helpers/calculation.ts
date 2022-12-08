import {
  ICalculateRenderInfoParams,
  ICalculateRenderInfoResult,
} from '@/table/helpers/calculation.type'
import {ITableProps} from "@/table/table.type";

const OVERSCAN_SIZE = 100

type TRowHeight<T> = ITableProps<T>["rowHeight"]

export default class Calculator<T = unknown> {
  private data: T[] = []
  private cache: number[] = []
  private rowHeight: TRowHeight<T> = () => 48
  constructor(
    data: T[],
    rowHeight: TRowHeight<T>
  ) {
    this.updateRowHeight(data, rowHeight)
  }

  updateRowHeight(newData: T[], rowHeight: TRowHeight<T>) {
    this.rowHeight = rowHeight
    this.cache = newData.map((data, idx) => {
      if (typeof rowHeight === 'number') {
        return rowHeight
      }
      return rowHeight(data, idx)
    })
    this.data = [...newData]
  }

  // 获取纵向的渲染高度，这一部分代码参考 ali-react-table 源码的处理，逻辑比较简单，自行理解
  getVerticalRenderRange(newData: T[], renderHeight: number, offset: number): ICalculateRenderInfoResult {
    this.updateRowHeight(newData, this.rowHeight)
    const topInfo = this.getTopRenderInfo(offset)
    const bottomInfo = this.getBottomRenderInfo(offset + renderHeight, topInfo)
    return {
      ...topInfo,
      ...bottomInfo
    }
  }

  private getTopRenderInfo(offset: number) {
    if (this.cache.length === 0) {
      return { topIndex: 0, topBlank: 0 }
    }

    let topIndex = 0
    let topBlank = 0
    while (topIndex < this.cache.length) {
      const h = this.cache[topIndex]
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
      overscanSize += this.cache[topIndex - overscanCount]
    }
    return {
      topIndex: topIndex - overscanCount,
      topBlank: topBlank - overscanSize,
    }
  }

  private getBottomRenderInfo(endOffset: number, startInfo: ReturnType<typeof this.overscanUpwards>) {
    let bottomIndex = startInfo.topIndex
    let offset = startInfo.topBlank
    while (bottomIndex < this.cache.length && offset < endOffset) {
      offset += this.cache[bottomIndex]
      bottomIndex += 1
    }
    const bottomBlank = this.cache.reduce((r, i) => r + i, 0) - offset
    return this.overscanDownwards(bottomIndex, bottomBlank)
  }

  private overscanDownwards(bottomIndex: number, bottomBlank: number) {
    let overscanSize = 0
    let overscanCount = 0
    while (overscanCount < this.cache.length - bottomIndex && overscanSize < OVERSCAN_SIZE) {
      overscanSize += this.cache[bottomIndex + overscanCount]
      overscanCount += 1
    }
    return {
      bottomIndex: bottomIndex + overscanCount,
      bottomBlank: bottomBlank - overscanSize,
    }
  }
}
