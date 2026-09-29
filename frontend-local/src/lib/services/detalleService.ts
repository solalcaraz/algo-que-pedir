import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'
import axios from 'axios'
import { REST_SERVER_URL } from '$lib/services/configuration'

class DetalleService {
  async obtenerDetallePedido(pedidoId: number) {
    const response = await axios.get<PedidoDetalleDTO>(`${REST_SERVER_URL}/detalle-pedido/${pedidoId}`)
    return response.data
  }
}

export const detalleService = new DetalleService()