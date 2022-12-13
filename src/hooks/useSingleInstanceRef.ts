import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react'

export default function useSingleInstanceRef<T>(
  factory: () => T,
): MutableRefObject<T | undefined> {
  const [hasInstance, setHasInstance] = useState(false)
  const ref = useRef<T>(!hasInstance ? factory() : null)
  useLayoutEffect(() => {
    if (hasInstance) {
      return
    }

    setHasInstance(true)
  }, [hasInstance])

  return ref
}
