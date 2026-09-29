import axios from 'axios'
import { REST_SERVER_URL } from './constants'

class DistanciaService {
    async obtenerDistancia(localId: number, userId: number): Promise<string> {
        const response = await axios.get<string>(`${REST_SERVER_URL}/distancia`, {
            params: {
                fromLocalId: localId,
                toUserId: userId,
            },
            responseType: 'text',
        })
        return response.data
    }
}

export const distanciaService = new DistanciaService()