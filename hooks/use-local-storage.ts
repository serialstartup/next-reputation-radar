"use client"

import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) {
        setValue(JSON.parse(raw))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const save = (next: T) => {
    setValue(next)
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
    } catch {}
  }

  return [value, save] as const
}

