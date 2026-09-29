import { Plato, type PlatoJSON } from '$lib/models/plato.svelte'
import axios from 'axios'
import { REST_SERVER_URL } from './configuration'
import { getAxiosData } from './common'
import { getIdDelLocal } from '$lib/utils/currentSession'

class PlatoService {
  crearPlatoVacio(): Plato { return new Plato() }

  async todosLosPlatos() {
    const queryPlatos = () => axios.get<PlatoJSON[]>(`${REST_SERVER_URL}/plato`)
    return (await getAxiosData(queryPlatos)).map(Plato.fromJson)
  }
  
  async obtenerPorId(id: number) {
    const queryById = () => axios.get<PlatoJSON>(`${REST_SERVER_URL}/plato/${id}`)
    const platoJson = await getAxiosData(queryById)
    return Plato.fromJson(platoJson)
  }

  async actualizarPlato(plato: Plato) {
    const idLocal = getIdDelLocal()
    return axios.put<PlatoJSON>(`${REST_SERVER_URL}/plato/${plato.id}`, plato.toJSON(), { params: {idLocal} })
  }

  async crearPlato(plato: Plato) {
    const idLocal = getIdDelLocal()
    return axios.post<PlatoJSON>(`${REST_SERVER_URL}/plato`, plato.toJSON(), { params: {idLocal} })
  }

  async eliminarPlato(id: number){
    return axios.delete<PlatoJSON>(`${REST_SERVER_URL}/plato/${id}`)
  }
}

export const platosService = new PlatoService()