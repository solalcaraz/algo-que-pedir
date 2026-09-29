export type DireccionJSON = {
  direccion: string,
  latitud: number,
  longitud: number
}

export type ClienteInfoJSON = {
  nombre: string,
  username: string
}

export type PedidoUpdateDTO = {
  id: number,
  nuevoEstado: string
}