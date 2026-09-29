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
    val ANTIGUEDAD_MINIMA_CLIENTE = 1               //¿No corresponderia que esto lo tenga el USUARIO?
    var cupon: Cupon? = null                        //Le asigno una variable Cupon a la clase Pedido

    //Metodos para agregar o eliminar platos dentro del pedido
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

    //Auxiliar para validar si el plato pertenece al local. Arroja exception en caso de que no
    fun platoEstaEnLocal(plato: Plato): Boolean {
        if (plato.local.equals(this.local)) {
            return true
        }
        throw PedidoException.PlatoNoEstaEnLocal()
    }

    //Metodo para saber si es certificado, involucra a Usuario y a Local
    fun esCertificado(): Boolean = validarAntiguedadCliente() && validarPuntuacionLocal()

    //Auxiliares para esCertificado()
    fun validarAntiguedadCliente(): Boolean = cliente.antiguedadEnPlataforma() >= ANTIGUEDAD_MINIMA_CLIENTE
    fun validarPuntuacionLocal(): Boolean = local.esConfiable()

    //Metodo para calcular valor del pedido
    fun costoTotalPedido(): Double {
        return subtotalConEntrega() + costoMedioDePago()
    }

    //Metodo para calcular el costo del envio
    fun costoDeEntrega(): Double = valorVentaPlatos() * 0.10

    //Subtotal con costo de entrega
    fun subtotalConEntrega(): Double = valorVentaPlatos() + costoDeEntrega()

    //Metodo para calcular costo por medio de pago
    fun costoMedioDePago(): Double {
        if (medioDePago != MedioDePago.EFECTIVO) {                        //Recargo por pago con QR o TRANSFERENCIA
            return 0.05 * subtotalConEntrega()
        } else {
            return 0.00
        }
    }

    //Auxiliar para sumar todos los costos de cada plata del pedido.
    fun valorVentaPlatos(): Double {
        return platosDelPedido.sumOf { it.valorDeVenta() }
    }


    //Metodo para cambiar a algun estado de su ciclo de vida
    fun cambiaDeEstado(estado: EnumEstadosPedido) {
        estadoDelPedido = estado
    }

    //Cambia el estado del pedido a ENTREGADO.
    fun pedidoEntregado() = cambiaDeEstado(EnumEstadosPedido.ENTREGADO)

    //Metodo para habilitar la posibilidad de cambiar el metodo de pago por uno correcto. Usa la validacion.
    fun cambiarMedioDePago(medio: MedioDePago) {
        validarMedioDePago(medio)           //Si no arroja excepcion, continua ejecución y asigna el medio de pago elegido
        medioDePago = medio
    }

    //Auxiliar para saber si el Medio de pago coincide con uno aceptado por el Local, si no esta
    //en la lista de medios del Local, arroja una excepcion
    fun validarMedioDePago(medio: MedioDePago) {
        if (medio !in local.mediosDePago) {
            throw PedidoException.MedioDePagoInvalido()
        }
    }

    //**Metodo para validar si cumple la preferencia del usuario (evalua si acepta todos los platos del pedido)
    fun esAptoPreferenciaCliente(cliente : Usuario): Boolean = platosDelPedido.all{ cliente.aceptaPlato(it)}

    //Agregué estos métodos para verificar zona de trabajo en delivery
    fun ubicacionPedido() = local.direccion.ubicacion
    fun ubicacionCliente() = cliente.direccion.ubicacion

    //Agregué este metodo porque no tenía manera de hacer funcionar el if en delivery
    fun estaPreparado() = this.estadoDelPedido == EnumEstadosPedido.PREPARADO

    // Calcula distancia entre local y cliente
    fun distanciaClienteLocal(): Double = cliente.direccion.distanciaCon(local.direccion)

    //Devuelve si el Pedido contiene un plato lanzado en un dia especifico (usado en Cupon)
    fun tienePlatoLanzadoEl(dia : DayOfWeek): Boolean{
        return platosDelPedido.any{ it.fechaLanzamiento.dayOfWeek == dia}
    }

    //Metodo para devolver el total con un cupon aplicado.
    fun costoTotalConCupon(cupon : Cupon): Double {
        cupon.validarAplicacion(this) //Valida si puede usar el cupon
        this.cupon = cupon                     //Define su atributo cupon
        return cupon.aplicarDescuentoDelCupon(this)     //Obtiene su monto final con dto del cupon aplicado
    }

    fun tieneCupon() = this.cupon != null

    // etodo que dice si el pedido completo es vegano
    fun esVegano() = platosDelPedido.all { plato -> plato.esVegano() }
}