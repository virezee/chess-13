'use client'

import { useEffect } from 'react'

export function ContextMenuGuard() {
  useEffect(() => {
    const block = (event: MouseEvent): void => event.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])
  return null
}