// ingredienteService.ts
import axios from 'axios'
import { REST_SERVER_URL } from './constants'
import { Ingrediente, type IngredienteJSON } from '@/domain/Ingrediente'
import { getAxiosData } from './common'

class IngredienteService {
    async getAll(): Promise<Ingrediente[]> {
        const query = () => axios.get<IngredienteJSON[]>(`${REST_SERVER_URL}/ingrediente/criterio`)
        const data = await getAxiosData(query)
        return data.map(ing => Ingrediente.fromJSON(ing))
    }
}

export const ingredienteService = new IngredienteService()