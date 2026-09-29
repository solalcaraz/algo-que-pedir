package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.doubles.shouldBeLessThanOrEqual
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.spyk
import java.time.LocalDate

class AccionesUsuarioSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Dado un Usuario que difiere acciones"){
        //Es Vegano y Exquisito (platos autor). Evito errores usando Strategy combinado
        val usuarioCombinado = Usuario().apply {
            tipoDeUsuario = UsuarioCombinadoStrategy(mutableSetOf(UsuarioVeganoStrategy(), UsuarioExquisitoStrategy()))
        }

        val localVegano = Local(nombre = "Local Vegano")
        val localVegano2 = Local(nombre = "Local Vegano 2")
        val MocklocalGenerico = spyk(Local(nombre = "Local Genérico")) //Mockeo un Local genérico para probar

        //Mockeo un plato VEGANO
        val platoMockeado = mockk<Plato>(relaxed = true)
        every { platoMockeado.esVegano() } returns true
        every { platoMockeado.local } returns localVegano
        every { platoMockeado.esdeAutor} returns true

        //Mockeo un plato de Autor
        val platoMockeado2 = mockk<Plato>(relaxed = true)
        every { platoMockeado2.esVegano() } returns false
        every { platoMockeado2.esdeAutor} returns true
        every { platoMockeado2.local } returns MocklocalGenerico

        val pedidoVegano1 = Pedido(cliente = usuarioCombinado, local = localVegano).apply {
            agregarPlatoAlPedido(platoMockeado)
        }
        val pedidoVegano2 = Pedido(cliente = usuarioCombinado, local = localVegano2)

        val pedidoAutor = Pedido(cliente = usuarioCombinado, local = MocklocalGenerico).apply {
            agregarPlatoAlPedido(platoMockeado2)
        }

        it("Usuario establece un pedido vegano"){
            val establecerPedidoCommand = EstablecerPedido(pedidoVegano1) //Command para 1 pedido vegano

            usuarioCombinado.apply {
                agregarAccion(establecerPedidoCommand)
            }

            usuarioCombinado.ejecutarAccionesPendientes()
            usuarioCombinado.listaPedidosPendientes.size shouldBe 1
            usuarioCombinado.listaAccionesPendientes.size shouldBe 0
        }
        it("Usuario puntua con un mismo puntaje a su lista de locales"){
            val mismoPuntajeCommand = PuntuarLocalPendiente()

            usuarioCombinado.apply {
                strategyPuntuacionLocal = mismoPuntaje(3.0) //Asigno el Strategy de puntaje
                agregarAccion(mismoPuntajeCommand)
                confirmarPedidoEntregado(pedidoVegano1) //Agrega el Local a la lista de locales pendientes
            }

            usuarioCombinado.ejecutarAccionesPendientes()

            localVegano.puntuacionUsuarios.size shouldBe 1      //La lista de puntuacion del Local deberia ser 1
            localVegano.puntuacionUsuarios.last() shouldBe 3.0  //La ultima puntuacion recibida deberia ser la que aplico ahora
            usuarioCombinado.localesAPuntuar.size shouldBe 0         //Solo habia un local pendiente
        }
        it("Usuario puntua con puntaje aleatorio a su lista de locales"){
            //Aprovecho el plato vegano y le cambio el local para que sea diferente al anterior
            every { platoMockeado.local } returns localVegano2
            pedidoVegano2.apply {
                agregarPlatoAlPedido(platoMockeado)
            }

            val puntajeAleatorioCommand = PuntuarLocalPendiente()

            usuarioCombinado.apply {
                strategyPuntuacionLocal = puntajeAleatorio
                agregarAccion(puntajeAleatorioCommand)
                confirmarPedidoEntregado(pedidoVegano2)     //Agrego LocalVegano2 a los pendientes
            }

            usuarioCombinado.ejecutarAccionesPendientes()

            (localVegano2.puntuacionUsuarios.last() in 1.0..5.0) shouldBe true
        }
        it("Usuario puntua con mismo puntaje de c/local a su lista de locales"){
            //Mockeo el puntaje del local genérico
            //Use spyk para que pueda funcionar la logica del command cuando agrega el puntaje a la lista del Local
            every { MocklocalGenerico.calcularPromedioPuntuacion()} returns 3.5

            val mismoPuntajeLocalCommand = PuntuarLocalPendiente()

            usuarioCombinado.apply {
                strategyPuntuacionLocal = mismoPuntajeLocal
                agregarAccion(mismoPuntajeLocalCommand)
                confirmarPedidoEntregado(pedidoAutor)     //Agrego LocalGenérico a los pendientes
            }

            usuarioCombinado.ejecutarAccionesPendientes()

            MocklocalGenerico.puntuacionUsuarios.size shouldBe 1      //La lista de puntuacion del Local deberia ser 1
            MocklocalGenerico.puntuacionUsuarios.last() shouldBe 3.5
        }
        it("Usuario no puede establecer pedido porque no cumple con su tipo de strategy"){
            //Lo convierto en un plato no vegano
            every { platoMockeado.esVegano() } returns false
            //Creo la accion
            val establecerPedidoCommand = EstablecerPedido(pedidoVegano1)
            //La asigno
            usuarioCombinado.apply {
                agregarAccion(establecerPedidoCommand)
            }

            //Intento ejecutar la accion pero salta la excepción definida
            val exception = shouldThrow<UsuarioException.PedidoInvalido> { usuarioCombinado.ejecutarAccionesPendientes() }
            //Chequeo que el msj sea el definido en mi exception
            exception.message shouldBe "No se puede establecer el pedido porque no cumple con los requisitos del usuario"
        }
        it("Usuario no puede puntuar un local porque no lo tiene en su lista de locales a puntuar"){
            //Creo un Local Random
            val localSinRegistrar = Local(nombre = "Local sin registrar")

            //Creo el command y lo asigno al usuario
            val mismoPuntajeCommand = PuntuarLocalPendiente()

            usuarioCombinado.apply {
                strategyPuntuacionLocal = mismoPuntaje(4.0)
                agregarAccion(mismoPuntajeCommand)
                confirmarPedidoEntregado(pedidoAutor)           //Agrego OTRO Pedido que no tiene que ver con mi localSinRegistrar
            }

            usuarioCombinado.ejecutarAccionesPendientes()

            MocklocalGenerico.puntuacionUsuarios.size shouldBe 1
            MocklocalGenerico.puntuacionUsuarios.last() shouldBe 4.0

            localSinRegistrar.puntuacionUsuarios.size shouldBe 0    //No deberia tener puntuacion porque no estaba en la Lista
        }
    }
})