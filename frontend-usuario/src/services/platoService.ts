import type { PlatoJSON } from '@/domain/Plato'
import { REST_SERVER_URL } from './constants'
import axios from 'axios'
import { getAxiosData } from './common'



class PlatoService {
    async obtenerPlatosPorLocal(idLocal : number) {
        const url = `${REST_SERVER_URL}/local/${idLocal}/platos`

        const queryPlatos = () => axios.get<PlatoJSON[]>(url)

        return getAxiosData(queryPlatos)
    }
}

export const platoService = new PlatoService()