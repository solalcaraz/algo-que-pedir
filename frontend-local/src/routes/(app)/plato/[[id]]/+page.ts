import { platosService } from '$lib/services/platoService' 
import { error, redirect } from '@sveltejs/kit'

export async function load({ params }: { params: { id: string } }) {
  const nuevoPlato = params.id === undefined
  
  if(nuevoPlato) {
    const plato =  platosService.crearPlatoVacio()
    return { plato, nuevoPlato }
  }
  
  if (isNaN(+params.id)) {
    throw error (400, `El parametro ${params.id} debe ser un número válido`)
  }
  
  try {
    const plato = await platosService.obtenerPorId(+params.id)
    return { plato, nuevoPlato }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error al cargar el plato: ', error)
    throw redirect(302, '/')
  }
}