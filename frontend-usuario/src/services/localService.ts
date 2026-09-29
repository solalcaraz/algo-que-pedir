import axios from 'axios'
import { REST_SERVER_URL } from './constants'
import { getAxiosData } from './common'
import { Local, type LocalJSON } from '@/domain/Local'
class LocalService {
    async obtenerLocalPorId(idLocal : number) {
        const url = `${REST_SERVER_URL}/local/${idLocal}`
        const queryLocal = () => axios.get<LocalJSON>(url)

        return getAxiosData(queryLocal)
    }

    async obtenerTodos() {
        const queryLocal = () => axios.get<LocalJSON[]>(`${REST_SERVER_URL}/locales/criterio`)
        return (await getAxiosData(queryLocal)).map(local => Local.fromJSON(local))
    }
}

export const localService = new LocalService()