import {
  ICalculateRenderInfoParams,
  ICalculateRenderInfoResult,
} from '@/table/helpers/calculation.type'

export function calculateRenderInfo(
  option: ICalculateRenderInfoParams,
): ICalculateRenderInfoResult {
  const { rowHeight, dataSource, offsetY, renderHeight } = option
  const getRowHeight = (row, idx): number => {
    if (typeof rowHeight === 'function') {
      return rowHeight(row, idx)
    }
    return rowHeight
  }

  const heightCache = dataSource.map(getRowHeight)

  const totalHeight = heightCache.reduce((result, height) => result + height, 0)

  let topIndex = 0
  let topBlank = 0

  while (topIndex < dataSource.length) {
    const h = heightCache[topIndex]
    if (topBlank + h >= offsetY - 100) {
      break
    }
    topBlank += h
    topIndex++
  }

  let bottomIndex = topIndex
  let offsetBottom = topBlank

  while (
    bottomIndex < dataSource.length &&
    offsetBottom < offsetY + renderHeight + 100
  ) {
    offsetBottom += heightCache[bottomIndex]
    bottomIndex++
  }

  return {
    topBlank,
    bottomBlank: totalHeight - offsetBottom,
    startIndex: topIndex,
    endIndex: bottomIndex,
    offsetY,
  }
}
