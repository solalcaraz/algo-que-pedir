
export type DireccionDTO = {
    direccion: string
    latitud: number
    longitud: number
}

export type RegisterData = {
    nombre: string,
    apellido: string,
    usuario: string,
    password: string,
    confirmarPassword: string
    calle: string,
    altura: string
}

export type LoginData = {
    usuario: string,
    password: string
}

export type AuthResponseUsuario = {
    success: boolean,
    message: string,
    usuario: InfoUsuarioResponse
}

export type InfoUsuarioResponse = {
    id: number,
    nombre: string
    apellido: string,
    usuario: string,
    direccion: DireccionDTO
}