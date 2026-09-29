package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.TipoRepositorio
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import java.time.LocalTime

class Delivery(
    var nombre: String = "",
    var username: String = "",
    var password: String = "",
    var tipoDeDelivery: TipoDeDelivery = DeliverySinCondiciones,
    var puntosZona: Set<Point> = setOf(Point(-30, -60), Point(20, 80), Point(50, 32))
): TipoRepositorio(){
    //Instancio puntos como set para que no haya repetidos, verifico que haya al menos tres, devuelvo el polígono
    fun zonaDeTrabajo(): Polygon{
        if(puntosZona.size < 3 ) {throw DeliveryException.zonaNoFormaPoligono()}
        return Polygon(puntosZona.toList())
    }
    fun pedidoEstaEnZonaDeTrabajo(pedido: Pedido) = zonaDeTrabajo().isInside(pedido.ubicacionPedido())
    fun entregaEstaEnZonaDeTrabajo(pedido: Pedido) = zonaDeTrabajo().isInside(pedido.ubicacionCliente())
    fun aceptaPedido(pedido: Pedido): Boolean {
        validarPedido(pedido)
        return tipoDeDelivery.aceptaPedido(pedido)
    }
    fun validarPedido(pedido: Pedido) {
        if(!pedido.estaPreparado()) {throw DeliveryException.pedidoNoEstaPreparado()}
        if(!pedidoEstaEnZonaDeTrabajo(pedido)) {throw DeliveryException.localFueraDeZonaDeTrabajo()}
        if(!entregaEstaEnZonaDeTrabajo(pedido)) {throw DeliveryException.entregaFueraDeZonaDeTrabajo()}
    }
}

interface TipoDeDelivery{
    fun aceptaPedido(pedido: Pedido): Boolean
}

object DeliverySinCondiciones : TipoDeDelivery {
    override fun aceptaPedido(pedido: Pedido) = true
}

class DeliveryHorarioSeguro(
    var horarioSeguro: Pair<LocalTime, LocalTime> = Pair(LocalTime.of(9, 0), LocalTime.of(18, 0)), ): TipoDeDelivery{
    override fun aceptaPedido(pedido: Pedido) = pedido.horarioPedido >= horarioSeguro.first && pedido.horarioPedido <= horarioSeguro.second
}

object DeliveryCobraCaro : TipoDeDelivery{
    override fun aceptaPedido(pedido: Pedido) = pedido.costoTotalPedido() > 30000
}

class DeliverySegunLocal(var localesDeTrabajo : MutableSet<Local> = mutableSetOf()): TipoDeDelivery{
    fun agregarLocal(local: Local){localesDeTrabajo.add(local)}

    override fun aceptaPedido(pedido: Pedido) = localesDeTrabajo.contains(pedido.local)
}

object DeliveryEsCertificado : TipoDeDelivery{
    override fun aceptaPedido(pedido: Pedido) = pedido.esCertificado()
}

abstract class DeliveryComplejo(val tiposDelivery: MutableSet<TipoDeDelivery>) : TipoDeDelivery{
    abstract override fun aceptaPedido(pedido: Pedido): Boolean

    fun agregarTipoDelivery(delivery : TipoDeDelivery){
        tiposDelivery.add(delivery)
    }

    fun removerTipoDelivery(delivery: TipoDeDelivery){
        tiposDelivery.remove(delivery)
    }
}

class DeliveryComplejoAND(val tiposDeDelivery: MutableSet<TipoDeDelivery>): DeliveryComplejo(tiposDeDelivery){
    override fun aceptaPedido(pedido: Pedido): Boolean {
        return tiposDeDelivery.all {it.aceptaPedido(pedido)}
    }
}

class DeliveryComplejoOR(val tiposDeDelivery: MutableSet<TipoDeDelivery>): DeliveryComplejo(tiposDeDelivery){
    override fun aceptaPedido(pedido: Pedido): Boolean {
        return tiposDeDelivery.any {it.aceptaPedido(pedido)}
    }
}
