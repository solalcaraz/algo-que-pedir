// src/lib/stores/toast.ts
import { writable } from 'svelte/store'

export type ToastType = 'error' | 'info' | 'success' | 'warning'

export interface Toast {
  message: string
  type?: ToastType
  duration?: number // en ms
}

export const toast = writable<Toast | null>(null)

export function showToast(message: string, type?: ToastType, duration: number = 3000) {
  toast.set({ message, type, duration })

  if (duration > 0) {
    setTimeout(() => toast.set(null), duration)
  }
}

/**
 * Oculta el toast manualmente
 */
export function hideToast() {
  toast.set(null)
}
