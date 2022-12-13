import React, { Provider, useContext } from 'react'
import Calculator from '@/table/helpers/calculation'

const CalculatorContext = React.createContext<Calculator>({} as Calculator)

CalculatorContext.displayName = '@context/calculatorForTable'

export function useCalculatorProvider<T = unknown>(): Provider<Calculator<T>> {
  return CalculatorContext.Provider as Provider<Calculator<T>>
}

export function useCalculator<T = unknown>(): Calculator<T> {
  return useContext(CalculatorContext) as Calculator<T>
}
