package ar.edu.unsam.algo3

// Strategy: qué puntaje le pone el usuario a cada local pendiente cuando ejecuta sus acciones

interface PuntuacionLocalStrategy {
    fun darPuntaje(local : Local) : Double
}

class mismoPuntaje(var puntaje : Double) : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double = puntaje
}

object puntajeAleatorio : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double = (1..5).random().toDouble()
}

object mismoPuntajeLocal : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double { return local.calcularPromedioPuntuacion() }
}