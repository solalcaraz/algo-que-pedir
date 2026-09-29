package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.EnumEstadosPedido
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.PedidoClienteDTO
import ar.edu.unsam.algo3.dto.toClienteDTO
import ar.edu.unsam.algo3.dto.toDomain
import ar.edu.unsam.algo3.dto.PedidoDTO
import ar.edu.unsam.algo3.dto.toDTO
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.repositorios.PedidoRepositorio


@Service
class PedidoService(
    private val pedidoRepo : PedidoRepositorio,
    private val localService: LocalService,
    private val platoService: PlatoService,
    private val usuarioService: UsuarioService
) {
    fun getAll() : List<PedidoDTO> = pedidoRepo.findAll().map { it.toDTO() }

    fun getByEstado(estado : String) : List<PedidoDTO> = pedidoRepo.search(estado).map { it.toDTO() }

    fun getById(id: Int) : Pedido = pedidoRepo.getById(id)

    fun actualizarPedidoCheckout(pedido: PedidoClienteDTO): PedidoClienteDTO {
        val pedidoActualizado = pedido.toDomain(localService, platoService, usuarioService)
        return pedidoActualizado.toClienteDTO()
    }

    fun getByUsuarioYEstado(userId: Int, estado: String?): List<Pedido> {
        val pedidos = pedidoRepo.findAll()

        val pedidosDelUsuario = pedidos.filter { it.cliente.id == userId }

        return if (estado != null)
            pedidosDelUsuario.filter {
                it.estadoDelPedido.name.equals(estado, ignoreCase = true)
            }
        else pedidosDelUsuario
    }

    fun actualizarEstado(id : Int, nuevoEstado : String){
        val pedido = pedidoRepo.getById(id)     //Busco el objeto Pedido

        //Si lo que viene como estado es cualquier cosa, tira error
        val nuevoEstado = try {
            EnumEstadosPedido.valueOf(nuevoEstado.uppercase())
        }catch (e: IllegalArgumentException){
            throw IllegalArgumentException("El estado $nuevoEstado no es valido!")
        }

        //El estado en el que está el pedido solo puede pasar al siguiente. Un pedido puede ser cancelado
        // en cualquier momento excepto cuando ya fue entregado o cancelado
        when(pedido.estadoDelPedido){
            EnumEstadosPedido.PENDIENTE -> {
                if(nuevoEstado != EnumEstadosPedido.PREPARADO && nuevoEstado != EnumEstadosPedido.CANCELADO){
                    throw IllegalArgumentException("Un pedido con estado Pendiente solo puede pasar a Preparado o Cancelado")
                }
            }

            EnumEstadosPedido.PREPARADO -> {
                if(nuevoEstado != EnumEstadosPedido.ENTREGADO && nuevoEstado != EnumEstadosPedido.CANCELADO){
                    throw IllegalArgumentException("Un pedido con estado Preparado solo puede pasar a Entregado o Cancelado")
                }
            }

            EnumEstadosPedido.ENTREGADO, EnumEstadosPedido.CANCELADO-> {
                throw IllegalArgumentException("El pedido ya se encuentra ${pedido.estadoDelPedido} y no puede ser modificado.")
            }
        }

        pedido.estadoDelPedido = nuevoEstado
        pedidoRepo.update(pedido)
    }

    fun crearPedido(pedidoBody: PedidoClienteDTO) {
        val pedido = pedidoBody.toDomain(localService, platoService, usuarioService)
        pedido.id = null
        pedidoRepo.create(pedido)
    }

    
}