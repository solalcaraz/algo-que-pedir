import { pedidoService } from '$lib/services/pedidoService'
import { EstadoDelPedido } from '$lib/models/estadosPedido'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import axios from 'axios'


const mapaEstadosValidos: Record<string, EstadoDelPedido> = {
  pendiente : EstadoDelPedido.PENDIENTE,
  preparado : EstadoDelPedido.PREPARADO,
  entregado : EstadoDelPedido.ENTREGADO,
  cancelado : EstadoDelPedido.CANCELADO
} 

function validacionEstadoURL(value: string | null) {
  const key = value?.trim().toLowerCase()
  if (!key) throw error(400, 'Debes agregar un valor para el filtrado de pedidos!')
  
  const estadoFront = mapaEstadosValidos[key]
  if (!estadoFront) throw error(404, `El estado '${value}' no es válido.`)
  return { estadoFront, estadoBack: key }
}

export const load : PageLoad = async ( { url, depends } ) => {
  depends('pedidos:list')

  const { estadoFront, estadoBack } = validacionEstadoURL(url.searchParams.get('estado'))

  try{
    const pedidos = await pedidoService.pedidoByEstado(estadoBack)
    return { estado: estadoFront, pedidos }
    
  } catch (err : unknown) {
    if(axios.isAxiosError(err)){
      const status = err?.response?.status ?? 500
      
      if(status && status >= 400 && status < 500){
        throw error(status, err?.response?.data?.message ?? 'Solicitud invalida.')
      }else{
        throw error(500, 'No se pudieron obtener los pedidos.')
      }
    }
    throw error(500, 'Ocurrio un error inesperado.')    
  }
}

