package ar.edu.unsam.algo3.repositorios

import ar.edu.unsam.algo3.*

interface SearchStrategy<T: TipoRepositorio> {
    fun matches(objeto: T, value: String): Boolean
}

object UsuarioSearcher : SearchStrategy<Usuario> {
    override fun matches(objeto: Usuario, value: String): Boolean {
        return objeto.nombre.contains(value, ignoreCase = true) ||
                objeto.apellido.contains(value, ignoreCase = true) ||
                objeto.usuario == value
    }
}

object LocalSearcher: SearchStrategy<Local> {
    override fun matches(objeto: Local, value: String): Boolean {
        return objeto.nombre.contains(value, ignoreCase = true) ||
                objeto.direccion.calle == value ||
                objeto.usuario == value
    }
}

object DeliverySearcher: SearchStrategy<Delivery> {
    override fun matches(objeto: Delivery, value: String): Boolean {
        return objeto.username.startsWith(value)
    }
}

object IngredienteSearcher: SearchStrategy<Ingrediente> {
    override fun matches(objeto: Ingrediente, value: String): Boolean {
        return objeto.nombre == value
    }
}

object PlatoSearcher: SearchStrategy<Plato> {
    override fun matches(objeto: Plato, value: String): Boolean {
        return objeto.descripcion.contains(value, ignoreCase = true) ||
                objeto.nombre.contains(value, ignoreCase = true) ||
                objeto.local.nombre.contains(value, ignoreCase = true) ||
                objeto.local.direccion.calle == value
    }
}

object CuponSearcher: SearchStrategy<Cupon> {
    override fun matches(objeto: Cupon, value: String): Boolean {
        return objeto.porcentajeDescuento.toString() == value
    }
}

object PedidoSearcher : SearchStrategy<Pedido> {
    override fun matches(objeto : Pedido, value : String) : Boolean {
        val estadosValidos : Map<String, EnumEstadosPedido> = mapOf(
            "pendiente" to EnumEstadosPedido.PENDIENTE,
            "preparado" to EnumEstadosPedido.PREPARADO,
            "entregado" to EnumEstadosPedido.ENTREGADO,
            "cancelado" to EnumEstadosPedido.CANCELADO
        )

        //Toma lo que vino en la url, lo trimea y pasa a minus
        val valorNormalizado = value.trim().lowercase()

        //Evaluo si esta en el map
        val estadoAEvaluar = estadosValidos[valorNormalizado] ?: throw IllegalArgumentException("El estado $value no es valido")

        //Compara y evalua
        return objeto.estadoDelPedido == estadoAEvaluar
    }
}