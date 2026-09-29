package ar.edu.unsam.algo3.dto

data class LocalAPuntuarDTO(
    val local: LocalDTO,
    val fechaLimite: String
)

data class PuntuacionRequest(
    val puntuacion: Double = 0.0,
    val review: String = ""
)