"use client"

import { type RefObject, useEffect } from "react"

type RefType = RefObject<HTMLElement>

export function useOnClickOutside(refs: RefType | RefType[], handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refsArray = Array.isArray(refs) ? refs : [refs]

      // Do nothing if clicking ref's element or descendent elements
      if (!refsArray.length) return

      let shouldTriggerHandler = true

      for (const ref of refsArray) {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          shouldTriggerHandler = false
          break
        }
      }

      if (shouldTriggerHandler) {
        handler(event)
      }
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [refs, handler])
}

