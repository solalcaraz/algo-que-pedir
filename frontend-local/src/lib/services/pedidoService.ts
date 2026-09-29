import type { PedidoUpdateDTO } from '$lib/dto/infoPedidoDTO'
import { Pedido, type PedidoJSON } from '$lib/models/pedido.svelte'
import { getAxiosData } from '$lib/services/common'
import { REST_SERVER_URL } from '$lib/services/configuration'
import axios from 'axios'


class PedidoService {
  async pedidoByEstado(estado : string){
    const queryPedidosEstado = () => axios.get<PedidoJSON[]>(`${REST_SERVER_URL}/pedidos?estado=${estado}`)
    return (await getAxiosData(queryPedidosEstado)).map(Pedido.fromJSON)
  }

  async actualizarEstado(id: number, nuevoEstado: string){
    const url = `${REST_SERVER_URL}/pedidos`

    const body : PedidoUpdateDTO = {
      id: id,
      nuevoEstado: nuevoEstado.toUpperCase()
    }

    await axios.patch(url, body)
  }
  
}

export const pedidoService = new PedidoService()