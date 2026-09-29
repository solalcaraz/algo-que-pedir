import { MedioDePago, medioPagoDesdeBack } from '$lib/models/metodosDePago.svelte'
import { EstadoDelPedido } from '$lib/models/estadosPedido'
import { type DireccionJSON, type ClienteInfoJSON } from '$lib/dto/infoPedidoDTO'

export type PedidoJSON = {
    id: number,
    cliente: ClienteInfoJSON,
    direccion: DireccionJSON,
    hora: string,
    items: number,
    precioTotal: number,
    medioDePago: MedioDePago,
    estadoPedido: EstadoDelPedido
}

export class Pedido {
  id: number | null = null
  cliente!: ClienteInfoJSON
  direccion!: DireccionJSON
  hora!: string
  items!: number
  precioTotal!: number
  medioDePago!: MedioDePago
  estadoPedido!: EstadoDelPedido

  static fromJSON(pedidoJSON: PedidoJSON): Pedido {
    return Object.assign(new Pedido(), pedidoJSON, {
      medioDePago: medioPagoDesdeBack(pedidoJSON.medioDePago),        
      estadoPedido: pedidoJSON.estadoPedido  
    })
  }
}

