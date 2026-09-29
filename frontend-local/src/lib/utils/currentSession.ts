import { browser } from '$app/environment'

export function getUsuarioDelLocal(): string | null {
  return sessionStorage.getItem('usuario')
}

export function getIdDelLocal(): number | null {
  const storedId = sessionStorage.getItem('idLocal')
  return storedId ? parseInt(storedId) : null
}

export function hayUsuarioLogueado(): boolean {
  if (!browser) return false
  const id = sessionStorage.getItem('idLocal')
  return id !== null && id !== ''
}