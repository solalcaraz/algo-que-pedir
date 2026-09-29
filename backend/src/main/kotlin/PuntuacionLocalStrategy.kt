package ar.edu.unsam.algo3

// *** Interface para definir estrategias de puntuación de locales ***
// Cada Strategy devuelve un Double que alimenta al metodo puntuarLocal() de Usuario

interface PuntuacionLocalStrategy {
    fun darPuntaje(local : Local) : Double
}

//Asigna a todos el mismo puntaje
class mismoPuntaje(var puntaje : Double) : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double = puntaje
}

//Asigna a todos un puntaje aleatorio entre 1.0 y 5.0
object puntajeAleatorio : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double = (1..5).random().toDouble()
}

//A c/local le doy el mismo puntaje que tiene como promedio actualmente
//Saco el puntaje promedio que tiene actualmente y se lo asigno a la lista de puntajes (puntuacionUsuarios)
object mismoPuntajeLocal : PuntuacionLocalStrategy {
    override fun darPuntaje(local: Local): Double { return local.calcularPromedioPuntuacion() }
}