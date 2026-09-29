package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Usuario

data class LoginRequestUsuario(
    val usuario: String,
    val password: String
)

data class RegisterRequestUsuario(
    val nombre: String,
    val apellido: String,
    val usuario: String,
    val password: String,
    val confirmarPassword: String,
    val calle: String,
    val altura: String
)

data class AuthResponseUsuario(
    val success: Boolean,
    val message: String,
    val usuario: InfoUsuarioResponse
)

//Data del usuario que devuelve el back
data class InfoUsuarioResponse(
    val id: Int? = null,
    val nombre: String,
    val apellido: String,
    val usuario: String,
    val direccion: DireccionDTO
)

fun Usuario.toInfoUsuarioDTO() : InfoUsuarioResponse {
    return InfoUsuarioResponse(
        id = this.id,
        nombre = this.nombre,
        apellido = this.apellido,
        usuario = this.usuario,
        direccion = this.direccion.toDTO()
    )
}