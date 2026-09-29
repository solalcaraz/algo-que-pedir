package ar.edu.unsam.algo3.dto

//Mini DTO para recibir el nuevo estado que viene cuando actualizas el pedido
data class PedidoUpdateDTO (
    val id: Int,
    val nuevoEstado: String
)