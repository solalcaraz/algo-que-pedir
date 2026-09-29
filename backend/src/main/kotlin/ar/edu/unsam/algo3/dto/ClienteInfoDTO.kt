package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Usuario

data class ClienteInfoDTO (
    val id: Int,
    val nombre : String,
    val username : String,
)

fun Usuario.toInfoDTO() : ClienteInfoDTO =
    ClienteInfoDTO(
        id = this.id!!,
        nombre = this.devolverNombreCompleto(),
        username = this.usuario,
    )

fun ClienteInfoDTO.toDomain(): Usuario =
    Usuario(
        nombre = this.nombre,
        usuario = this.username
    ).apply{
        this.id = this@toDomain.id
    }