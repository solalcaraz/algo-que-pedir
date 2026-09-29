import type { MetodoDePago } from '$lib/models/metodosDePago.svelte'

export interface LocalDTO {
  idLocal: number,
  nombre: string
  urlImagenLocal: string
  direccion: string
  altura: number
  latitud: number
  longitud: number
  porcentajeSobreCadaPlato: number
  porcentajeRegaliasDeAutor: number
  usuario: string
  mediosDePago: MetodoDePago[]
}