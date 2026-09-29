export function positivo(value: number): boolean {
  return value >= 0
}

export function vacio(value: string): boolean {
  return value.trim().length == 0
}

export function esEntero(value: number): boolean {
  return Number.isInteger(value)
}