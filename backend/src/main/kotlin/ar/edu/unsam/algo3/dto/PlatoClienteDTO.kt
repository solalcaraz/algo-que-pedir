package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Plato

data class PlatoClienteDTO (
    var id: Int,
    var nombre: String,
    var descripcion: String,
    var imagenUrl: String,
    var precioUnitario: Double,
    var popular: Boolean
)

fun Plato.toClienteDTO(): PlatoClienteDTO = PlatoClienteDTO(
    id = this.id!!,
    nombre = this.nombre,
    descripcion = this.descripcion,
    imagenUrl= this.getImagenUrl(),
    precioUnitario= this.valorDeVenta(),
    popular= this.popular                   //Por el momento, deberia haber una logica para que sea popular o no
)

fun PlatoClienteDTO.toDomain(): Plato {
    return Plato(
        nombre = this.nombre,
        descripcion= this.descripcion,
        valorBase = this.precioUnitario
    ).apply{
        this.id = this@toDomain.id
    }
}