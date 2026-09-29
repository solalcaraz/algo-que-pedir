import { Local } from '@/domain/Local'
import { Articulo } from '@/components/articulo-checkout/Articulo'

export interface PedidoDetalleProps {
  restaurante: Local
  articulos: Articulo[]
  subtotal: number
  recargo: number
  tarifaEntrega: number
  distancia:string
  total: number
  mostrarFormaDePago?: boolean
  medioDePago?: string
  isCheckout: boolean
}