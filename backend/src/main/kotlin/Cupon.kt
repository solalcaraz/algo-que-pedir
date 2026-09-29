package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.TipoRepositorio
import java.time.DayOfWeek
import java.time.LocalDate

abstract class Cupon(var porcentajeDescuento: Double = 0.0) : TipoRepositorio()
{
    var fechaEmision : LocalDate = LocalDate.now()
    var diasValido : Long = 7
    var yaAplicado : Boolean = false

    init {
        if(porcentajeDescuento !in 0.0..1.0){
            throw CuponException.descuentoInvalido()
        }
        porcentajeBaseValido()
    }

    fun porcentajeBaseValido() {
        if(porcentajeDescuento !in 0.0..1.0){
            throw CuponException.descuentoInvalido()
        }
    }

    //Template Method: determina si un Cupon puede ser aplicable (condiciones generales) + las condiciones particulares de c/cupon
    fun esAplicable(pedido: Pedido) : Boolean = LocalDate.now().isBefore(fechaEmision.plusDays(diasValido)) && !yaAplicado && condicionParticular(pedido)

    //Metodo abstracto para contemplar las condiciones particulares de aplicación de c/Cupon
    abstract fun condicionParticular(pedido: Pedido) : Boolean

    //Validaciones para saber si el cupon no se puede aplicar
    fun validarAplicacion(pedido: Pedido){
        if(!condicionParticular(pedido)) throw errorParticular()
        if(!esAplicable(pedido)) throw CuponException.cuponExpiro()
    }

    //Metodo que c/cupon redefine para lanzar sus excepciones
    abstract fun errorParticular() : CuponException

    //Template Method: devuelve el descuento base (comun) + el descuento especial de c/cupon (devuelve monto a descontar)
    fun calcularDescuentoTotal(pedido: Pedido): Double {
        return pedido.costoTotalPedido() * porcentajeDescuento + descuentoEspecial(pedido)
    }

    //Metodo abstracto que define el descuento especial que aplica c/Cupon
    abstract fun descuentoEspecial(pedido: Pedido) : Double

    //Cambia el estado a aplicado y devuelve el valor del pedido post dto. Si el dto es mayor al total del pedido, lanza una excepcion.
    fun aplicarDescuentoDelCupon(pedido: Pedido) : Double{
        yaAplicado = true
        var precioFinal =  pedido.costoTotalPedido() - calcularDescuentoTotal(pedido)
        return if(precioFinal < 0) throw CuponException.cuponExcedido() else precioFinal
    }

    // Metodo que determina si el cupon es viejo y sin usar
    fun noUtilizado(): Boolean{
        val fechaVencimiento = fechaEmision.plusDays(diasValido)
        return !yaAplicado && fechaVencimiento.isBefore(LocalDate.now())
    }
}

class CuponDia(porcentajeDescuento: Double, var fechaAplicable : DayOfWeek) : Cupon(porcentajeDescuento) {

    override fun descuentoEspecial(pedido: Pedido) : Double{
        val porcentajeExtra = if (pedido.tienePlatoLanzadoEl(fechaAplicable)) 0.10 else 0.05
        return pedido.costoTotalPedido() * porcentajeExtra
    }

    override fun condicionParticular(pedido: Pedido) : Boolean {
        return LocalDate.now().dayOfWeek == fechaAplicable
    }

    override fun errorParticular(): CuponException = CuponException.diaInvalido(fechaAplicable)
}

class CuponLocal(porcentajeDescuento: Double, var localesCupon : MutableSet<Local>) : Cupon(porcentajeDescuento) {

    override fun descuentoEspecial(pedido: Pedido) : Double{
        return if (pedido.esCertificado()) 1000.0 else 500.0
    }

    override fun condicionParticular(pedido: Pedido) : Boolean {
        return pedido.local in localesCupon
    }

    override fun errorParticular(): CuponException = CuponException.localInvalido()
}

class CuponTope(porcentajeDescuento: Double, var porcentajeEspecial : Double, var tope : Double) : Cupon(porcentajeDescuento) {
    init {
        if(porcentajeEspecial !in 0.0..1.0) throw CuponException.descuentoInvalido()
        if(tope < 0) throw CuponException.topeInvalido()
        porcentajeBaseValido()
    }

    override fun condicionParticular(pedido: Pedido): Boolean = true
    override fun errorParticular(): CuponException = CuponException.descuentoInvalido()

    override fun descuentoEspecial(pedido: Pedido) : Double{
        val valorDescuento = pedido.costoTotalPedido() * porcentajeEspecial
        return minOf(valorDescuento, tope)
    }


}