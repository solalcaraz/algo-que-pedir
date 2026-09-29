package ar.edu.unsam.algo3.dto

// DTO para representar un local que el usuario puede puntuar
data class LocalAPuntuarDTO(
    val local: LocalDTO,
    val fechaLimite: String // Fecha hasta la cual puede puntuar (7 días)
)

// Request body para recibir la puntuación del usuario
data class PuntuacionRequest(
    val puntuacion: Double = 0.0,
    val review: String = ""
)