package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.Plato

data class PlatoSimpleDTO(
    val id: Int,
    val nombre: String,
    val precio: Double,
    val descripcion: String,
    val imagenUrl: String
)

data class PedidoDetalleDTO(
    val id: Int,
    val cliente: ClienteInfoDTO,
    val direccion: DireccionDTO,
    val platos: List<PlatoSimpleDTO>,
    val subtotal: Double,
    val comisionDelivery: Double,
    val incrementoPago: Double,
    val total: Double,
    val estado: String,
    val medioDePago: String
)
fun Plato.toSimpleDTO(): PlatoSimpleDTO = PlatoSimpleDTO(
    id = this.id!!,
    nombre = this.nombre,
    precio = this.valorDeVenta(),
    descripcion = this.descripcion,
    imagenUrl = this.getImagenUrl()
)

fun Pedido.toDetalleDTO(): PedidoDetalleDTO {
    val subtotal = this.valorVentaPlatos()
    val comisionDelivery = subtotal * 0.10
    val incrementoPago = if (this.medioDePago != ar.edu.unsam.algo3.MedioDePago.EFECTIVO) {
        subtotal * 0.05
    } else {
        0.0
    }

    return PedidoDetalleDTO(
        id = this.id!!,
        cliente = this.cliente.toInfoDTO(),
        direccion = this.cliente.direccion.toDTO(),
        platos = this.platosDelPedido.map { it.toSimpleDTO() },
        subtotal = subtotal,
        comisionDelivery = comisionDelivery,
        incrementoPago = incrementoPago,
        total = this.costoTotalPedido(),
        estado = this.estadoDelPedido.name,
        medioDePago = this.medioDePago.name
    )
}