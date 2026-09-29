package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.dto.PedidoDetalleDTO
import ar.edu.unsam.algo3.dto.toDetalleDTO
import ar.edu.unsam.algo3.repositorios.PedidoRepositorio
import org.springframework.stereotype.Service

@Service
class DetalleService( private val pedidoRepositorio: PedidoRepositorio) {
    fun obtenerDetallePedido(id: Int): PedidoDetalleDTO {
        val pedido = pedidoRepositorio.getById(id)
        return pedido.toDetalleDTO()
    }
}