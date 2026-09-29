package ar.edu.unsam.algo3

// Command: acciones que el usuario agenda para ejecutarlas todas juntas más tarde
interface CommandUsuario {
    fun execute(usuario : Usuario)
}

class EstablecerPedido(val pedido : Pedido) : CommandUsuario {
    override fun execute(usuario : Usuario) {
        usuario.establecerPedido(pedido)
    }
}

class PuntuarLocalPendiente() : CommandUsuario {
    override fun execute(usuario : Usuario) {
        var localesPendientes = usuario.localesAPuntuar.keys.toList()

        localesPendientes.forEach{ local ->
            var puntaje = usuario.strategyPuntuacionLocal.darPuntaje(local)
            usuario.puntuarLocal(local, puntaje, review = "")
        }
    }
}