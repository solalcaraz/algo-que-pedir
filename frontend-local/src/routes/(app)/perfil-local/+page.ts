import { redirect } from '@sveltejs/kit'
import { getLocal } from '$lib/services/localService'
import { getIdDelLocal, hayUsuarioLogueado } from '$lib/utils/currentSession'

// La sesión vive en sessionStorage, que no existe durante el render en el servidor
export const ssr = false

export async function load() {
  if(hayUsuarioLogueado()) {
    const idLocal = getIdDelLocal()
    // eslint-disable-next-line
    const localDataBackend = await getLocal(idLocal!)
    return { localDataBackend }
  }
  else {
    throw redirect(302, '/login')
  }
}