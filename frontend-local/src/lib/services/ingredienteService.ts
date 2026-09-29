import { Ingrediente, type IngredienteJSON } from '$lib/models/ingrediente.svelte'
import { getAxiosData } from '$lib/services/common'
import { REST_SERVER_URL } from '$lib/services/configuration'
import axios from 'axios'

class IngredienteService {
  async todosLosIngredientes() {
    const queryIngredientes = () => axios.get<IngredienteJSON[]>(`${REST_SERVER_URL}/ingrediente`)
    return (await getAxiosData(queryIngredientes)).map(Ingrediente.fromJson)
  }

  async getIngredienteById(id: number) {
    const queryById = () => axios.get<IngredienteJSON>(`${REST_SERVER_URL}/ingrediente/${id}`)
    const ingredienteJSON = await getAxiosData(queryById)
    return Ingrediente.fromJson(ingredienteJSON)
  }

  async actualizarIngrediente(ingrediente: Ingrediente) {
    return axios.put<IngredienteJSON>( `${REST_SERVER_URL}/ingrediente/${ingrediente.id}`, ingrediente.toJSON())
  }

  async crearIngrediente(ingrediente: Ingrediente) {
    return axios.post<IngredienteJSON>( `${REST_SERVER_URL}/ingrediente`, ingrediente.toJSON())
  }

  async eliminarIngrediente(id: number|null) {
    return axios.delete<IngredienteJSON>( `${REST_SERVER_URL}/ingrediente/${id}`)
  }
}

export const ingredientesService = new IngredienteService()