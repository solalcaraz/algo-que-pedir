import axios from 'axios'
import type { Pedido } from '@/pages/detalle-pedido/Pedido'
import { REST_SERVER_URL as BASE_URL } from './constants'

const PEDIDOS_URL = `${BASE_URL}/pedidos`
const DETALLE_PEDIDOS_URL = `${BASE_URL}/checkout-pedido`

export interface DetallePedidoResponse {
  id: number
  local: {
    idLocal: number
    nombre: string
    urlImagenLocal: string
    rating: number
    reviews: string
  }
  fechaPedido: string
  distancia: string
  platosDelPedido: {
    id: number
    nombre: string
    descripcion: string
    imagenUrl: string
    precioUnitario: number
    popular: boolean
  }[]
  cantidadDePlatos: number
  medioDePago: string
  costoSubtotalPedido: number
  recargoMedioDePago: number
  tarifaEntrega: number
  costoTotalPedido: number
}

export async function obtenerDetallePedido(id: number): Promise<DetallePedidoResponse> {
  const response = await axios.get(`${DETALLE_PEDIDOS_URL}/${id}`)
  return response.data
}

export async function getPedidosPorEstados(estados: string[]): Promise<Pedido[]> {
  try {
    // Se lee en cada llamada: si se leyera al importar el módulo, después del login quedaría el valor previo
    const userId = Number(localStorage.getItem('idUsuario'))
    const BASE_USUARIO_URL = `${BASE_URL}/usuarios/${userId}/pedidos`
    const responses = await Promise.all(
      estados.map(estado =>
        axios.get(BASE_USUARIO_URL, { params: { estado } })
      )
    )
    return responses.flatMap(r => r.data)
  } catch (err) {
    console.error('Error al obtener pedidos', err)
    throw new Error('Error al cargar pedidos')
  }
}

export const cancelarPedidoService = async (id: number) => {
  const response = await axios.patch(PEDIDOS_URL, {
    id,
    nuevoEstado: 'CANCELADO'
  })
  return response.data
}