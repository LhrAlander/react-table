import { useState } from 'react'

export default function useForceUpdate() {
  const [, setState] = useState(0)
  return () => {
    setState(prevState => {
      if (prevState === 0) {
        return 1
      }
      return 0
    })
  }
}
