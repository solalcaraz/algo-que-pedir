import { Ingrediente } from '$lib/models/ingrediente.svelte'
import { ingredientesService } from '$lib/services/ingredienteService'
import { redirect } from '@sveltejs/kit'

export async function load({ params, url }) {
  try {
    const nuevoIngrediente = params.id === 'nuevo'
    const readOnly = url.searchParams.get('readOnly') === 'true'
    const ingrediente = nuevoIngrediente ? 
      new Ingrediente() :
      await ingredientesService.getIngredienteById(+params.id)
    return { ingrediente, nuevoIngrediente, readOnly }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error al cargar el ignrediente', error)
    throw redirect(302, '/ingrediente')
  }
}