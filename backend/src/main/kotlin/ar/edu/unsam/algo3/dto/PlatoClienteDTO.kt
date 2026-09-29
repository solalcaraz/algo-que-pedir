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
    popular= this.popular
)