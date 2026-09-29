package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.PedidoDetalleDTO
import ar.edu.unsam.algo3.service.DetalleService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
class DetalleController(
    private val detalleService: DetalleService
) {

    @GetMapping("/detalle-pedido/{id}")
    fun obtenerDetallePedido(@PathVariable id: Int): PedidoDetalleDTO {
        return detalleService.obtenerDetallePedido(id)
    }
}