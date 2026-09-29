import { platosService } from '$lib/services/platoService'
import { showError } from '$lib/utils/errorHandler'

export const load = async ({ depends }) => {
  try {
    depends('platos:list')
    const platos = await platosService.todosLosPlatos()
    return { platos }
  } catch (error) {
    showError('Conexión al servidor', error)
    return { platos: []}
  }
}