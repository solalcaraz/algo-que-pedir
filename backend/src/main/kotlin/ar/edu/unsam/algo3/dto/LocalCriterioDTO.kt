package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Local

data class LocalCriterioDTO(
    val idLocal: Int,
    val nombre: String,
    val urlImagenLocal: String,
    val rating: Double,
    val tarifaEntrega: Double
)

fun Local.toCriterioDTO(): LocalCriterioDTO = LocalCriterioDTO(
    idLocal = this.id!!,
    nombre = this.nombre,
    urlImagenLocal = this.urlImagenLocal,
    rating = this.calcularPromedioPuntuacion(),
    tarifaEntrega = this.tarifaEntrega
)

fun LocalCriterioDTO.toDomain(): Local {
    return Local(
        nombre = this.nombre,
        urlImagenLocal=this.urlImagenLocal,
        tarifaEntrega = this.tarifaEntrega
    ).apply {
        id = this@toDomain.idLocal
    }
}