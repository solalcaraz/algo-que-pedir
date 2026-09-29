import { useCallback, useState, useRef } from 'react'

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const callbackRef = useRef<null | (() => void)>(null)

  const ask = useCallback((callback: () => void) => {
    callbackRef.current = callback
    setIsOpen(true)
  }, [])

  const confirm = useCallback(() => {
    setIsOpen(false)
    if (callbackRef.current) {
      callbackRef.current()
      callbackRef.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    setIsOpen(false)
    callbackRef.current = null
  }, [])

  return {
    isOpen,
    ask,
    confirm,
    cancel,
  }
}
