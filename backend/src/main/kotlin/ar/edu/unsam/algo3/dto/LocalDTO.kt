package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.MedioDePago

data class LocalCercanoDTO(
    val local: LocalDTO,
    val esCercano: Boolean
)

data class LocalDTO(

    //Cambiar las validaciones a la clase del Local
    val idLocal: Int,
    
    val nombre: String,

    val urlImagenLocal: String,

    val direccion: String,

    val altura: Int,

    val latitud: Double,

    val longitud: Double,

    val porcentajeSobreCadaPlato: Double,

    val porcentajeRegaliasDeAutor: Double,

    val mediosDePago: Set<MedioDePago>
)

fun Local.toDTO(): LocalDTO {
    return LocalDTO(
        idLocal = this.id!!,
        nombre = this.nombre,
        urlImagenLocal = this.urlImagenLocal,
        direccion = this.direccion.calle,
        altura = this.direccion.altura,
        latitud = this.direccion.ubicacion.latitude(),
        longitud = this.direccion.ubicacion.longitude(),
        porcentajeSobreCadaPlato = this.porcentajeSobreCadaPlato,
        porcentajeRegaliasDeAutor = this.porcentajeRegaliasDeAutor,
        mediosDePago = this.mediosDePago
    )
}