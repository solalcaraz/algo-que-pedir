import { Plato } from '@/domain/Plato'

export type EstadoPedido = 'PENDIENTE' | 'PREPARADO' | 'ENTREGADO' | 'CANCELADO'

export interface Local {
  idLocal: number
  nombre: string
  urlImagenLocal: string
  rating: number
  reviews: string
  mediosDePago: string[]
  tarifaEntrega: number
  recargosMedioDePago: Record<string, number>
}

export interface Pedido {
  id: number
  local: Local
  estadoPedido: EstadoPedido
  fechaPedido: string
  platosDelPedido: Plato[]
  cantidadDePlatos: number
  costoTotalPedido: number
}