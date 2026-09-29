import axios from 'axios'
import { REST_SERVER_URL } from './constants'
import type { RegisterData, LoginData, AuthResponseUsuario } from '@/types/UsuarioTypes'


export const login = async (data: LoginData): Promise<AuthResponseUsuario> => {
    const url = `${REST_SERVER_URL}/api/login`

    try {
        const response = await axios.post<AuthResponseUsuario>(url, data)

        //Si el back responde todo OK --> login exitoso con el setItem del Local Storage de id y nombre
        if (response.data.success && response.data.usuario) {
            localStorage.setItem('idUsuario', response.data.usuario.id.toString())
            localStorage.setItem('nombreUsuario', response.data.usuario.nombre) 
        }

        return response.data
    } catch (error) {
        throw error
    }
}

export const logout = () => {
    localStorage.removeItem('idUsuario')
    localStorage.removeItem('nombreUsuario')
}

export const registro = async (data: RegisterData): Promise<AuthResponseUsuario> => {
    const url = `${REST_SERVER_URL}/api/registro`

    try {
        const response = await axios.post<AuthResponseUsuario>(url, data)
        return response.data
    } catch (error) {
        throw error
    }
}

//Auxiliar para handlear los errores de ambos casos
export const handleAuthError = (error) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return error.response.data.message || 'Error en la solicitud'
        } else if (error.request) {
            return 'No se pudo conectar con el servidor. Intente más tarde.'
        }
    }
}