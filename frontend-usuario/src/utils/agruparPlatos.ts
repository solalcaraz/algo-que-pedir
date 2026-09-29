import type { Plato } from "@/types/plato"

export interface PlatoAgrupado {
  id: number
  nombre: string
  cantidad: number
  precioUnitario: number
}

export function agruparPlatos(platos: Plato[]): PlatoAgrupado[] {
  const mapa = new Map<number, PlatoAgrupado>()

  for (const p of platos) {
    if (!mapa.has(p.id)) {
      mapa.set(p.id, {
        id: p.id,
        nombre: p.nombre,
        cantidad: 1,
        precioUnitario: p.precioUnitario,
      })
    } else {
      const existente = mapa.get(p.id)!
      existente.cantidad++
    }
  }

  return Array.from(mapa.values())
}
