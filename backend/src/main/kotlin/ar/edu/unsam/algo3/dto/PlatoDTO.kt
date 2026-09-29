package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Plato

data class PlatoDTO(
    var id: Int,
    var nombre: String,
    var descripcion: String,
    var imagenUrl: String,
    var valorBase: Double,
    var esDeAutor: Boolean,
    var esNuevo: Boolean,
    var porcentajeDescuento: Double,
    var costoProduccion: Double,
    var listaDeIngredientes: MutableSet<IngredienteDTO>
)

fun Plato.toDTO() = PlatoDTO(
    id=id!!,
    nombre=nombre,
    descripcion=descripcion,
    imagenUrl = this.getImagenUrl(),
    valorBase=valorBase,
    esDeAutor=esdeAutor,
    esNuevo= this.esNuevo(),
    porcentajeDescuento=this.porcentajeDescuento,
    costoProduccion= this.costoDeProduccion(),
    listaDeIngredientes= this.listaDeIngredientes.map { it.toDTO() }.toMutableSet()
)
