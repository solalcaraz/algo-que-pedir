import type { Local } from '@/domain/Local'
import type { PlatoAgrupado } from '@/utils/agruparPlatos'

export interface PedidoDetalleProps {
  restaurante: Pick<Local, 'nombre' | 'urlImagenLocal' | 'rating'>
  articulos: PlatoAgrupado[]
  subtotal: number
  recargo: number
  tarifaEntrega: number
  distancia:string
  total: number
  medioDePago?: string
}