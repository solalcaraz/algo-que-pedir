import type { AxiosResponse } from 'axios'

export const getAxiosData = async <T>(query: () => Promise<AxiosResponse<T>>): Promise<T> => {
  const response = await query()
  return response.data
}