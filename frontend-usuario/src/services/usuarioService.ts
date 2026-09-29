import axios from 'axios'
import { REST_SERVER_URL } from './constants'
import { Usuario, type UsuarioJSON } from '@/domain/Usuario'
import { getAxiosData } from './common'

class UsuarioService {
    async getById(id: number) {
        const queryById = () => axios.get<UsuarioJSON>(`${REST_SERVER_URL}/usuario/${id}`)
        const usuarioJson = await getAxiosData(queryById)
        return Usuario.fromJSON(usuarioJson)
    }

    async actualizar(usuarioActualizar: Usuario) {
        const query = () => axios.put<UsuarioJSON>(`${REST_SERVER_URL}/usuario/${usuarioActualizar.id}`, usuarioActualizar.toJSON())
        const usuarioJson = await getAxiosData(query)
        return Usuario.fromJSON(usuarioJson)
    }
}

export const usuarioService = new UsuarioService()