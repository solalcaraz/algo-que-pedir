package ar.edu.unsam.algo3

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import ar.edu.unsam.algo3.repositorios.TipoRepositorio

enum class EnumEstadosPedido{
    PENDIENTE,
    PREPARADO,
    ENTREGADO,
    CANCELADO
}

class Pedido (
    val cliente: Usuario = Usuario(),
    val local: Local = Local(),
    val delivery: Delivery = Delivery(),
    var estadoDelPedido: EnumEstadosPedido = EnumEstadosPedido.PENDIENTE,
    var medioDePago : MedioDePago = MedioDePago.EFECTIVO,
    var horarioPedido : LocalTime = LocalTime.now(),
    var fechaPedido : LocalDate = LocalDate.now(),
    val platosDelPedido: MutableList<Plato> = mutableListOf()
) : TipoRepositorio() {
    val ANTIGUEDAD_MINIMA_CLIENTE = 1
    var cupon: Cupon? = null

    fun agregarPlatoAlPedido(plato: Plato) {
        platoEstaEnLocal(plato)
        platosDelPedido.add(plato)
    }
    fun eliminarPlatoDelPedido(plato: Plato) {
        if (platosDelPedido.contains(plato)) {
            platosDelPedido.remove(plato)
        }
    }

    fun cantidadDePlatos() = platosDelPedido.size

    fun platoEstaEnLocal(plato: Plato): Boolean {
        if (plato.local.equals(this.local)) {
            return true
        }
        throw PedidoException.PlatoNoEstaEnLocal()
    }

    fun esCertificado(): Boolean = validarAntiguedadCliente() && validarPuntuacionLocal()

    fun validarAntiguedadCliente(): Boolean = cliente.antiguedadEnPlataforma() >= ANTIGUEDAD_MINIMA_CLIENTE
    fun validarPuntuacionLocal(): Boolean = local.esConfiable()

    fun costoTotalPedido(): Double {
        return subtotalConEntrega() + costoMedioDePago()
    }

    fun costoDeEntrega(): Double = valorVentaPlatos() * 0.10

    fun subtotalConEntrega(): Double = valorVentaPlatos() + costoDeEntrega()

    fun costoMedioDePago(): Double {
        if (medioDePago != MedioDePago.EFECTIVO) {
            return 0.05 * subtotalConEntrega()
        } else {
            return 0.00
        }
    }

    fun valorVentaPlatos(): Double {
        return platosDelPedido.sumOf { it.valorDeVenta() }
    }


    fun cambiaDeEstado(estado: EnumEstadosPedido) {
        estadoDelPedido = estado
    }

    fun pedidoEntregado() = cambiaDeEstado(EnumEstadosPedido.ENTREGADO)

    fun cambiarMedioDePago(medio: MedioDePago) {
        validarMedioDePago(medio)
        medioDePago = medio
    }

    fun validarMedioDePago(medio: MedioDePago) {
        if (medio !in local.mediosDePago) {
            throw PedidoException.MedioDePagoInvalido()
        }
    }

    fun esAptoPreferenciaCliente(cliente : Usuario): Boolean = platosDelPedido.all{ cliente.aceptaPlato(it)}

    fun ubicacionPedido() = local.direccion.ubicacion
    fun ubicacionCliente() = cliente.direccion.ubicacion

    fun estaPreparado() = this.estadoDelPedido == EnumEstadosPedido.PREPARADO

    fun tienePlatoLanzadoEl(dia : DayOfWeek): Boolean{
        return platosDelPedido.any{ it.fechaLanzamiento.dayOfWeek == dia}
    }

    fun costoTotalConCupon(cupon : Cupon): Double {
        cupon.validarAplicacion(this)
        this.cupon = cupon
        return cupon.aplicarDescuentoDelCupon(this)
    }

    fun tieneCupon() = this.cupon != null

    fun esVegano() = platosDelPedido.all { plato -> plato.esVegano() }
}