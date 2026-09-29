package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.EnumEstadosPedido
import ar.edu.unsam.algo3.ErrorException
import ar.edu.unsam.algo3.MedioDePago
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.PlatoService
import ar.edu.unsam.algo3.service.UsuarioService
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale


// En principio voy a armar este nuevo DTO para la aplicación de React

data class PedidoClienteDTO(
    var id: Int,
    var local: LocalClienteDTO,
    var fechaPedido: String,
    var platosDelPedido: List<PlatoClienteDTO>,
    var cantidadDePlatos: Int,
    var medioDePago: MedioDePago,
    var estadoPedido : EnumEstadosPedido,
    var costoSubtotalPedido: Double,
    var recargoMedioDePago: Double,
    var tarifaEntrega: Double,
    var costoTotalPedido: Double,
    var usuario: UsuarioDTO
)

private val formateoFecha = DateTimeFormatter.ofPattern("d 'de' MMMM", Locale("es", "AR"))

fun Pedido.toClienteDTO(): PedidoClienteDTO {
    return PedidoClienteDTO(
        id = id!!,
        local = this.local.toClienteDTO(),
        fechaPedido = this.fechaPedido.format(formateoFecha),
        platosDelPedido = this.platosDelPedido.map { it.toClienteDTO() },
        cantidadDePlatos = this.cantidadDePlatos(),
        medioDePago = this.medioDePago,
        estadoPedido = this.estadoDelPedido,
        costoSubtotalPedido = this.valorVentaPlatos(),
        recargoMedioDePago = this.costoMedioDePago(),
        tarifaEntrega = this.costoDeEntrega(),
        costoTotalPedido = this.costoTotalPedido(),
        usuario = this.cliente.toDTO()
    )
}

fun PedidoClienteDTO.toDomain(localService: LocalService, platoService: PlatoService, usuarioService: UsuarioService): Pedido {
    val instant = Instant.parse(this.fechaPedido)
    val zonaBuenosAires = ZoneId.of("America/Argentina/Buenos_Aires")
    val fechaLocal: LocalDate = instant.atZone(zonaBuenosAires).toLocalDate()

    val local = localService.obtenerLocalPorId(this.local.idLocal)
    val platos = this.platosDelPedido.map { platoService.getById(it.id) }.toMutableList()
    val usuario = usuarioService.getById(this.usuario.id)

    val pedido = Pedido(
        local = local,
        medioDePago = this.medioDePago,
        platosDelPedido = platos,
        fechaPedido = fechaLocal,
        cliente = usuario
    ).apply{
        id = this@toDomain.id
    }

    // Validamos que el costo total enviado por el front coincida con el que se calcula en el back
    if (kotlin.math.abs(this.costoTotalPedido - pedido.costoTotalPedido()) > 0.01) {
        throw ErrorException.BusinessException("El costo enviado no coincide con el costo real. Front: ${this.costoTotalPedido}, Back: ${pedido.costoTotalPedido()}")
    }

    return pedido
}