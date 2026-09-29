//Función para validar que un campo numérico no sea negativo
export function positivo(value: number): boolean {
  return value >= 0
}

//Función para validar que un campo numérico no exceda un valor máximo
export function numMaximo(value: number, max: number): boolean {
  return value <= max
}

//Función para validar que un campo no esté vacío
export function vacio(value: string): boolean {
  return value.trim().length == 0
}

export function esEntero(value: number): boolean {
  return Number.isInteger(value)
}