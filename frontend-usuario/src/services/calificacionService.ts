import axios from 'axios'
import { REST_SERVER_URL } from '@/services/constants'

interface LocalAPuntuar {
  local: {
    idLocal: number
    nombre: string
    direccion: string
    altura: number
    urlImagenLocal: string
  }
  fechaLimite: string
}

interface LocalConPuntuacion {
  idLocal: number
  nombre: string
  direccion: string
  urlImagenLocal: string
  fechaLimite: string
}

export class CalificarService {
  static async fetchLocalesAPuntuar(idUsuario: string): Promise<LocalConPuntuacion[]> {
    try {
      const response = await axios.get<LocalAPuntuar[]>(
        `${REST_SERVER_URL}/usuario/${idUsuario}/locales-a-puntuar`
      )
      
      const localesTransformados: LocalConPuntuacion[] = response.data.map((item: LocalAPuntuar) => ({
        idLocal: item.local.idLocal,
        nombre: item.local.nombre,
        direccion: `${item.local.direccion} ${item.local.altura}`,
        urlImagenLocal: item.local.urlImagenLocal,
        fechaLimite: item.fechaLimite
      }))
      
      return localesTransformados
    } catch (error) {
      console.error('Error fetching locales a puntuar:', error)
      throw new Error('Error al obtener los locales a puntuar')
    }
  }

  static async puntuarLocal(
    idUsuario: string,
    idLocal: string,
    puntuacion: number,
    review: string
  ): Promise<void> {
    try {
      await axios.post(
        `${REST_SERVER_URL}/usuario/${idUsuario}/puntuar-local/${idLocal}`,
        { puntuacion, review },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      console.error('Error al puntuar local:', error)
      throw new Error('Error al puntuar el local')
    }
  }
}

export type { LocalAPuntuar, LocalConPuntuacion }