package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.EnumEstadosPedido
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import ar.edu.unsam.algo3.repositorios.PedidoRepositorio
import ar.edu.unsam.algo3.repositorios.PlatoRepositorio
import ar.edu.unsam.algo3.repositorios.UsuarioRepositorio
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class LocalServiceSpec : DescribeSpec({
    describe("Cantidad de pedidos de un local") {
        it("cuenta los pedidos del local que no fueron cancelados") {
            val localRepositorio = LocalRepositorio()
            val pedidoRepositorio = PedidoRepositorio()
            val servicio = LocalService(
                localRepositorio,
                PlatoService(PlatoRepositorio(), localRepositorio, IngredienteRepositorio()),
                UsuarioRepositorio(),
                pedidoRepositorio
            )
            val moe = localRepositorio.create(Local(nombre = "Taberna de Moe"))
            val otro = localRepositorio.create(Local(nombre = "Krusty Burger"))
            pedidoRepositorio.create(Pedido(local = moe))
            pedidoRepositorio.create(Pedido(local = moe, estadoDelPedido = EnumEstadosPedido.ENTREGADO))
            pedidoRepositorio.create(Pedido(local = moe, estadoDelPedido = EnumEstadosPedido.CANCELADO))
            pedidoRepositorio.create(Pedido(local = otro))

            servicio.cantidadDePedidos(moe.id!!) shouldBe 2
        }
    }
})
