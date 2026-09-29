import axios from 'axios'
import type { LocalDTO } from '$lib/dto/localDTO'

import { REST_SERVER_URL } from '$lib/services/configuration'

const LOCAL_URL = `${REST_SERVER_URL}/localAdmin`

export async function getLocal(id: number): Promise<LocalDTO> {
  const response = await axios.get<LocalDTO>(`${LOCAL_URL}/${id}`)
  return response.data
}

export async function updateLocal(localDTO: LocalDTO): Promise<LocalDTO> {
  const response = await axios.put<LocalDTO>(LOCAL_URL, localDTO, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}