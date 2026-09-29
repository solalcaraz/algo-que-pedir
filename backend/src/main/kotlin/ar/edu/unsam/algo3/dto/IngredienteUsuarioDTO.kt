package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Ingrediente

data class IngredienteUsuarioDTO(
    val id: Int = 0,
    val nombre: String = ""
)

fun Ingrediente.toUsuarioIngredienteDTO() = IngredienteUsuarioDTO(
    id = this.id!!,
    nombre = this.nombre
)

fun IngredienteUsuarioDTO.toDomain(): Ingrediente {
    return Ingrediente(
        nombre = nombre
    ).apply {
        id = this@toDomain.id
    }
}