package ar.edu.unsam.algo3

import org.uqbar.geodds.Point

class Direccion(
    val calle: String = "calle",
    val altura: Int = 550,
    val ubicacion: Point = Point(0, 0)
) {
    init {
        require(calle.isNotBlank()) { "La calle no puede estar vacía" }
        require(altura > 0) { "La altura debe ser mayor que 0" }
        require(ubicacion.x in -90.0..90.0) { "La latitud debe estar entre -90 y 90" }
        require(ubicacion.y in -180.0..180.0) { "La longitud debe estar entre -180 y 180" }
    }

    fun distanciaCon(otraDireccion: Direccion): Double {
        return ubicacion.distance(otraDireccion.ubicacion)
    }

    fun devolverDireccionCompleta() : String {
        return "${calle} ${altura}"
    }
}