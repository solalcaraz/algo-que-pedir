package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.Repositorios
import java.time.LocalDate

interface PedidoObserver {
    fun onPedidoRealizado(pedido: Pedido)
}

class PublicidadObserver(val servicePublicidad : MailService) : PedidoObserver {
    override fun onPedidoRealizado(pedido: Pedido) {
        val platosDelLocal = obtenerPlatos(pedido.local)
        val platoRecomendado = buscarPreferencia(pedido.cliente, platosDelLocal)

        platoRecomendado?.let {servicePublicidad.sendPublicidadPlato(pedido.cliente, it)}
    }

    fun obtenerPlatos(local: Local): List<Plato> {
        return Repositorios.plato.search(local.nombre)
    }

    fun buscarPreferencia(usuario: Usuario, platos: List<Plato>) : Plato?{
        return platos.find {plato -> usuario.aceptaPlato(plato)}
    }
}

class AuditoriaObserver : PedidoObserver {
    private val objetivosLocales: MutableMap<Local, ObjetivoAuditoria> = mutableMapOf()

    override fun onPedidoRealizado(pedido: Pedido) {
        objetivosLocales[pedido.local]?.registrarValores(pedido)
    }

    fun configurarObjetivo(local: Local, objetivo: ObjetivoAuditoria) {
        objetivosLocales[local] = objetivo
    }

    fun verificarCumplimientoObjetivos(local: Local): Boolean {
        return objetivosLocales[local]?.cumpleObjetivos() ?: throw ObserverException.ObjetivoInexistente()
    }
}

class PedidoVeganoObserver : PedidoObserver {
    override fun onPedidoRealizado(pedido: Pedido) {
        if (pedido.esVegano()) {
            combinarPreferencia(pedido.cliente)
        }
    }

    private fun combinarPreferencia(cliente: Usuario) {
        val actual = cliente.tipoDeUsuario
        val nueva = UsuarioCombinadoStrategy()

        nueva.requisitosParticulares.add(actual)
        nueva.requisitosParticulares.add(UsuarioVeganoStrategy())
        cliente.tipoDeUsuario = nueva
    }

}

class MensajeCertificadoObserver : PedidoObserver {
    override fun onPedidoRealizado(pedido: Pedido) {
        if (pedido.esCertificado()){
            enviarMensaje(pedido)
        }
    }

    fun enviarMensaje(pedido: Pedido) {
        val mensaje = Mensaje(
            fechaEmision = LocalDate.now(),
            asunto = "Pedido Prioritario",
            mensaje = "Pedido certificado del cliente ${pedido.cliente.nombre} ${pedido.cliente.apellido}. " +
                    "Dar prioridad en la preparacion. "
        )
        pedido.local.inboxMensajes.agregarMensaje(mensaje)
    }
}
