import type { PlatoJSON } from '@/domain/Plato'

export interface PlatoAgrupado {
  id: number
  nombre: string
  cantidad: number
  precioUnitario: number
}

export function agruparPlatos(platos: PlatoJSON[]): PlatoAgrupado[] {
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
