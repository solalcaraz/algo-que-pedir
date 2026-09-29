package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.TipoRepositorio

class Local(
    nombre: String = "local",
    direccion: Direccion = Direccion(),
    urlImagenLocal: String = "urldefault.com",
    porcentajeSobreCadaPlato: Double = 0.0,
    porcentajeRegaliasDeAutor: Double = 0.0,
    var mediosDePago: MutableSet<MedioDePago> = mutableSetOf(),
    var usuario: String = "",
    var password: String = "",
    var tarifaEntrega: Double = 0.10,
    var recargosMedioDePago: MutableMap<MedioDePago, Double> = mutableMapOf()
) : TipoRepositorio() {

    var nombre: String = nombre
        set(value) {
            require(value.isNotBlank()) { "El nombre no puede estar vacío" }
            field = value
        }

    var direccion: Direccion = direccion
        set(value) {
            require(value.altura > 0) { "La altura debe ser mayor que 0" }
            require(value.calle.isNotBlank()) { "La calle no puede estar vacía" }
            field = value
        }

    var urlImagenLocal: String = urlImagenLocal
        set(value) {
            require(value.isNotBlank()) { "La URL de la imagen no puede estar vacía" }
            field = value
        }

    var porcentajeSobreCadaPlato: Double = porcentajeSobreCadaPlato
        set(value) {
            require(value in 0.0..100.0) { "El porcentaje sobre cada plato debe estar entre 0 y 100" }
            field = value
        }

    var porcentajeRegaliasDeAutor: Double = porcentajeRegaliasDeAutor
        set(value) {
            require(value in 0.0..100.0) { "El porcentaje de regalías de autor debe estar entre 0 y 100" }
            field = value
        }

    val RANGO_PUNTUACION_LOCAL = 4.0..5.0
    var inboxMensajes: InboxMensajes = InboxMensajes()
    val puntuacionUsuarios: MutableList<Double> = mutableListOf()
    var reviewsTexto: MutableList<String> = mutableListOf() // Nueva lista de reviews

    // Validaciones previas a inicializar el Local
    init {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(direccion.altura > 0) { "La altura debe ser mayor que 0" }
        require(direccion.calle.isNotBlank()) { "La calle no puede estar vacía" }
        require(urlImagenLocal.isNotBlank()) { "La URL de la imagen no puede estar vacía" }
        require(porcentajeSobreCadaPlato in 0.0..100.0) { "El porcentaje sobre cada plato debe estar entre 0 y 100" }
        require(porcentajeRegaliasDeAutor in 0.0..100.0) { "El porcentaje de regalías de autor debe estar entre 0 y 100" }
    }

    fun puntuar(puntaje: Double) {
        if (puntaje in 1.0..5.0) {
            puntuacionUsuarios.add(puntaje)
        }
    }

    fun calcularPromedioPuntuacion(): Double {
        return if (puntuacionUsuarios.isNotEmpty()) {
            puntuacionUsuarios.average()
        } else {
            0.0
        }
    }

    fun esConfiable(): Boolean = calcularPromedioPuntuacion() in RANGO_PUNTUACION_LOCAL

    fun agregarMedioDePago(medio: MedioDePago) {
        if (!mediosDePago.contains(medio)) {
            mediosDePago.add(medio)
        }
    }

    fun eliminarMedioDePago(medio: MedioDePago) {
        if (mediosDePago.contains(medio)) {
            mediosDePago.remove(medio)
        }
    }
    
    fun agregarRecargo(medio: MedioDePago, recargo: Double){
        recargosMedioDePago[medio] = recargo
    }

    // Nuevos métodos para manejar reviews de texto
    fun agregarReview(review: String) {
        if (review.isNotBlank()) {
            reviewsTexto.add(review)
        }
    }

    fun obtenerReviews(): List<String> {
        return reviewsTexto.toList()
    }

    fun cantidadReviews(): Int {
        return reviewsTexto.size
    }
}
