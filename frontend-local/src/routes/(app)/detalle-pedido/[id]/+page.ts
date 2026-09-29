 
import { error } from '@sveltejs/kit'
import axios from 'axios'
import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'
import { detalleService } from '$lib/services/detalleService'

export async function load({ params }: { params: { id: string } }): Promise<PedidoDetalleDTO> {
  try {
    const pedidoId = Number(params.id)
    if (isNaN(pedidoId) || pedidoId <= 0) {
      throw error(400, 'ID de pedido inválido')
    }
    const response = await detalleService.obtenerDetallePedido(pedidoId)
    return response

  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        throw error(404, 'Pedido no encontrado')
      }
      if (err.response?.status === 400) {
        throw error(400, 'Solicitud inválida')
      }
    }
    throw err
  }
}