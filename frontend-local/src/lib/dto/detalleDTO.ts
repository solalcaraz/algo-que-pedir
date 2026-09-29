import { type DireccionJSON, type ClienteInfoJSON } from '$lib/dto/infoPedidoDTO'
export interface PlatoDTO {
  id: number
  nombre: string
  precio: number
  descripcion: string
  imagenUrl: string
}

export interface PlatoConCantidad extends PlatoDTO {
  cantidad: number;
}

export interface PedidoDetalleDTO {
  id: number
  cliente: ClienteInfoJSON
  direccion: DireccionJSON
  platos: PlatoDTO[]
  subtotal: number
  comisionDelivery: number
  incrementoPago: number
  total: number
  estado: string
  medioDePago: string
}