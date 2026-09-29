import axios from 'axios'
import { REST_SERVER_URL } from '@/services/constants'

interface Local {
  local: {
    idLocal: number
    nombre: string
    direccion: string
    urlImagenLocal: string
  }
  esCercano: boolean
}

export class HomeService {
  static async fetchLocales(idUsuario: string): Promise<Local[]> {
    try {
      const response = await axios.get<Local[]>(`${REST_SERVER_URL}/locales/${idUsuario}`)
      console.log('API Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error al obtener los locales:', error)
      throw new Error('Error al obtener los locales')
    }
  }
}

export type { Local }