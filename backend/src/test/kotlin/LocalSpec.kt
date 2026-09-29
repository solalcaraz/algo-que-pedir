package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point
import java.time.LocalDate

class LocalSpec : DescribeSpec({
    describe("Test Local"){
        it( "Un local está mas lejos que la distancia maxima, y no es cercano"){
            val usuarioConDistancia = Usuario(distanciaMaximaCercana = 10.0, direccion = Direccion(ubicacion = Point(0,0)))
            val localLejano = Local(direccion = Direccion(ubicacion = Point(0,20)))

            usuarioConDistancia.esLocalCercano(localLejano) shouldBe false
        }
        it( "Un local está dentro de la distancia maxima, y es cercano"){
            val usuarioConDistancia = Usuario(distanciaMaximaCercana = 10.0, direccion = Direccion(ubicacion = Point(-34.6037,-58.3816)))
            val localCercano = Local(direccion = Direccion(ubicacion = Point(-34.5687,-58.4117)))

            usuarioConDistancia.esLocalCercano(localCercano) shouldBe true
        }

        it( "Local a puntuar y con pedido confirmado hace pocos dias es puntuable."){
            val usuarioPuntuador = Usuario()
            val localPuntuable = Local()
            val pedidoConLocalAPuntuar = Pedido(local = localPuntuable)

            usuarioPuntuador.confirmarPedidoEntregado(pedidoConLocalAPuntuar)
            usuarioPuntuador.puntuarLocal(localPuntuable, 4.0)

            localPuntuable.puntuacionUsuarios.contains(4.0) shouldBe true
        }
        it( "Local no agrega puntaje mayor a 5 a la lista"){
            val usuarioPuntuador = Usuario()
            val localPuntuable = Local()
            val pedidoConLocalAPuntuar = Pedido(local = localPuntuable)

            usuarioPuntuador.confirmarPedidoEntregado(pedidoConLocalAPuntuar)
            usuarioPuntuador.puntuarLocal(localPuntuable, 20.0)

            localPuntuable.puntuacionUsuarios.contains(20.0) shouldBe false
        }

        it( "Local a puntuar no es puntuable si el ultimo pedido fue hace mas de 7 dias."){
            val usuarioPuntuador = Usuario()
            val localPuntuable = Local()
            val pedidoConLocalAPuntuar = Pedido(local = localPuntuable).apply {
                fechaPedido = LocalDate.now().minusDays(8)
            }

            usuarioPuntuador.confirmarPedidoEntregado(pedidoConLocalAPuntuar)

            shouldThrow<UsuarioException.LocalAPuntuarVencido> {
                usuarioPuntuador.puntuarLocal(localPuntuable, 4.0)
            }
            localPuntuable.puntuacionUsuarios.contains(4.0) shouldBe false
        }
    }
})