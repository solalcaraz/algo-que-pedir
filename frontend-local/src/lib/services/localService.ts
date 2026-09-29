import axios from 'axios'
import type { LocalDTO } from '$lib/dto/localDTO'

const API_URL = 'http://localhost:9000'
const PATH_LOCAL = '/localAdmin'

export async function getLocal(id: number): Promise<LocalDTO> {
  const response = await axios.get<LocalDTO>(`${API_URL}${PATH_LOCAL}/${id}`)
  return response.data
}

export async function updateLocal(localDTO: LocalDTO): Promise<LocalDTO> {
  // console.log(localDTO)
  const response = await axios.put<LocalDTO>(`${API_URL}${PATH_LOCAL}`, localDTO, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}