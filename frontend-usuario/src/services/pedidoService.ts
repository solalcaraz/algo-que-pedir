import axios from 'axios'
import { REST_SERVER_URL } from './constants'
import { getAxiosData } from './common'
import { Pedido, type PedidoJSON } from '@/domain/Pedido'

class PedidoService {

    async getPedidoById(idPedido: number) {
        const queryById = () => axios.get<PedidoJSON>(`${REST_SERVER_URL}/checkout-pedido/${idPedido}`)
        const pedidoJSON = await getAxiosData(queryById)
        return Pedido.fromJson(pedidoJSON)
    }

  
    async crearPedido(pedido: Pedido) {
        const query = () => axios.post<PedidoJSON>(`${REST_SERVER_URL}/checkout-pedido`, pedido.toJSON())
        return getAxiosData(query)
    }
}

export const pedidoService = new PedidoService()