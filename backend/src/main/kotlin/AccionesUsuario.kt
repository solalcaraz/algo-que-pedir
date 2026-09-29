package ar.edu.unsam.algo3

//Interface del Command con sus implementaciones concretas
interface CommandUsuario {
    fun execute(usuario : Usuario)
}

//El Receiver de este Command será el Usuario
class EstablecerPedido(val pedido : Pedido) : CommandUsuario {
    override fun execute(usuario : Usuario) {
        usuario.establecerPedido(pedido)
    }
}

class PuntuarLocalPendiente() : CommandUsuario {
    override fun execute(usuario : Usuario) {
        var localesPendientes = usuario.localesAPuntuar.keys.toList() //Extraigo como lista los locales del Map

        localesPendientes.forEach{ local ->
            var puntaje = usuario.strategyPuntuacionLocal.darPuntaje(local) //Calculo el puntaje del Strategy
            usuario.puntuarLocal(local, puntaje, review = "")                //Usuario realiza la accion de puntuar
        }
    }
}