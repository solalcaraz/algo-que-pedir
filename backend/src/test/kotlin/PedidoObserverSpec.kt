package ar.edu.unsam.algo3

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import io.kotest.matchers.types.shouldNotBeInstanceOf
import io.mockk.*

class Observers : DescribeSpec({
    describe("Tests para el gestor de los observers"){
        val observer1 = mockk<PedidoObserver>(relaxed = true)
        val observer2 = mockk<PedidoObserver>(relaxed = true)
        val pedido = mockk<Pedido>()
        val gestor = GestorObserversPedido()

        it("no debería notificar a nadie si no hay observers") {
            gestor.notificarPedidoRealizado(pedido)

            verify(exactly = 0) { observer1.onPedidoRealizado(pedido) }
        }

        it("Se notifica a multiples observers") {
            gestor.addObserver(observer1)
            gestor.addObserver(observer2)
            gestor.notificarPedidoRealizado(pedido)

            verify(exactly = 1) { observer1.onPedidoRealizado(pedido) }
            verify(exactly = 1) { observer2.onPedidoRealizado(pedido) }
        }
    }

    describe("Tests para Publicidad Observer") {
        val mockMailSender = mockk<MailSender>(relaxed = true)
        val mailService = MailService(mockMailSender)
        val publicidadObserver = spyk(PublicidadObserver(mailService))

        it("Envia publicidad acorde a las preferencias y al local") {
            val mockCliente = mockk<Usuario>()
            val mockLocal = mockk<Local>()
            val mockPedido = mockk<Pedido>()
            val platoPreferencia = mockk<Plato>()

            every { mockPedido.cliente } returns mockCliente
            every { mockPedido.local } returns mockLocal
            every { mockCliente.mail } returns "cliente@ej.com"
            every { platoPreferencia.nombre } returns "Pizza"
            every { publicidadObserver.obtenerPlatos(any()) } returns listOf(platoPreferencia)
            every { mockCliente.aceptaPlato(platoPreferencia) } returns true

            val expectedMail = Mail(
                emisor = "aqp@gmail.com",
                destinatario = "cliente@ej.com",
                asunto = "Puede que quizas te guste...",
                mensaje = "quizas quieras probar: Pizza"
            )

            publicidadObserver.onPedidoRealizado(mockPedido)
            verify(exactly = 1) { mockMailSender.sendMail(expectedMail) }
        }
    }

    describe("Tests para Auditoria Observer"){
        val auditoriaObserver = AuditoriaObserver()

        val mockCliente = mockk<Usuario>()
        val mockLocal = mockk<Local>()
        val mockPedido = mockk<Pedido>()
        every { mockPedido.local } returns mockLocal
        every { mockPedido.cliente } returns mockCliente

        it("Se audita un local que cumple con el objetivo de ventas minimas") {
            val objetivo = ObjetivoVentasMinimas(100.0)

            auditoriaObserver.configurarObjetivo(mockLocal, objetivo)
            every { mockPedido.costoTotalPedido() } returns 120.0
            auditoriaObserver.onPedidoRealizado(mockPedido)

            auditoriaObserver.verificarCumplimientoObjetivos(mockLocal) shouldBe true
        }

        it("Auditoria cuando se hacen pedidos grandes") {
            val objetivo = ObjetivoPedidosGrandes()
            auditoriaObserver.configurarObjetivo(mockLocal, objetivo)
            val plato1 = mockk<Plato>()
            val plato2 = mockk<Plato>()
            val plato3 = mockk<Plato>()
            every { mockPedido.platosDelPedido } returns mutableListOf(plato1, plato2, plato3)

            repeat(5){
                auditoriaObserver.onPedidoRealizado(mockPedido)
            }
            auditoriaObserver.verificarCumplimientoObjetivos(mockLocal) shouldBe true
        }

        it("Auditoria cuando se cumple el objetivo del plato vegano") {
            val objetivo = ObjetivoPlatosVeganos(1)
            auditoriaObserver.configurarObjetivo(mockLocal, objetivo)

            val platoveg = mockk<Plato>()
            every { platoveg.esVegano() } returns true
            every { mockPedido.platosDelPedido } returns mutableListOf(platoveg)

            auditoriaObserver.onPedidoRealizado(mockPedido)
            auditoriaObserver.verificarCumplimientoObjetivos(mockLocal) shouldBe true
        }

        it("Se audita cumpliendo el objetivo vegao y el objetivo de ventas minimas") {
            val objetivoVegano = mockk<ObjetivoPlatosVeganos>()
            val objetivoVentaMinima = mockk<ObjetivoVentasMinimas>()
            val objetivoPedidosGrandes = mockk<ObjetivoPedidosGrandes>()

            every { objetivoVegano.cumpleObjetivos() } returns true
            every { objetivoVentaMinima.cumpleObjetivos() } returns true
            every { objetivoPedidosGrandes.cumpleObjetivos() } returns true

            val objetivoCombinado = ObjetivoCombinado(listOf(objetivoVegano, objetivoVentaMinima, objetivoPedidosGrandes))
            objetivoCombinado.cumpleObjetivos() shouldBe true
        }
    }

    describe("Tests para pedidos 100% veganos") {
        val veganoObserver = PedidoVeganoObserver()

        val usuario = mockk<Usuario>(relaxed = true)
        val platoVeg = mockk<Plato>()
        every { platoVeg.esVegano() } returns true
        val pedidoVeg = mockk<Pedido>()
        every { pedidoVeg.platosDelPedido } returns mutableListOf(platoVeg)
        every { pedidoVeg.cliente } returns usuario

        it("Se cambia la estrategia del usuario, no vegano, al hacer un pedido vegano") {
            every { usuario.tipoDeUsuario } returns UsuarioCombinadoStrategy()
            every { pedidoVeg.esVegano() } returns true
            veganoObserver.onPedidoRealizado(pedidoVeg)
            verify(exactly = 1) { usuario.tipoDeUsuario = ofType<UsuarioCombinadoStrategy>() }
        }

        it("No cambia la estrategia si el usuario ya es vegano") {
            every { usuario.tipoDeUsuario } returns UsuarioVeganoStrategy()
            veganoObserver.onPedidoRealizado(pedidoVeg)
            usuario.tipoDeUsuario.shouldBeInstanceOf<UsuarioVeganoStrategy>()
        }

        it("No cambia la estrategia si el usuario ya tiene estrategia combinada con vegano") {
            val estrategiaVeg = UsuarioVeganoStrategy()
            val estrategia = UsuarioGeneralStrategy()
            val estrategiaCombinada = UsuarioCombinadoStrategy(mutableSetOf(estrategia, estrategiaVeg))
            every { usuario.tipoDeUsuario } returns estrategiaCombinada

            veganoObserver.onPedidoRealizado(pedidoVeg)
            usuario.tipoDeUsuario.shouldNotBeInstanceOf<UsuarioVeganoStrategy>()
        }
    }

    describe("Test para mensajes certificados") {
        val certificadoObserver = MensajeCertificadoObserver()
        val cliente = mockk<Usuario>(relaxed = true)
        val local = Local("Cafe")
        val pedido = mockk<Pedido>()

        every { pedido.cliente } returns cliente
        every { pedido.local } returns local

        it("No se envian mensajes cuando el pedido no es certificado") {
            every { pedido.esCertificado() } returns false
            certificadoObserver.onPedidoRealizado(pedido)

            local.inboxMensajes.obtenerMensajes() shouldHaveSize 0
        }

        it("Envia mensaje cuando el pedido es certificado") {
            every { pedido.esCertificado() } returns true
            certificadoObserver.onPedidoRealizado(pedido)

            local.inboxMensajes.obtenerMensajes() shouldHaveSize 1

            val mensaje = local.inboxMensajes.obtenerMensajes().first()
            mensaje.asunto shouldBe "Pedido Prioritario"
            mensaje.leido shouldBe false
        }
    }
})