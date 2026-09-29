package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.repositorios.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDate

@SpringBootTest
@DisplayName("Dado un servicio de detalle de pedidos")
class ServiceDetalleSpec {

    @Autowired
    lateinit var detalleService: DetalleService

    @Autowired
    lateinit var pedidoRepositorio: PedidoRepositorio

    @Autowired
    lateinit var localRepositorio: LocalRepositorio

    @Autowired
    lateinit var platoRepositorio: PlatoRepositorio

    @Autowired
    lateinit var usuarioRepositorio: UsuarioRepositorio

    @Autowired
    lateinit var ingredienteRepositorio: IngredienteRepositorio

    lateinit var pedidoTest: Pedido
    lateinit var localTest: Local
    lateinit var clienteTest: Usuario
    lateinit var platoTest: Plato

    @BeforeEach
    fun init() {
        pedidoRepositorio.clearInit()
        localRepositorio.clearInit()
        platoRepositorio.clearInit()
        usuarioRepositorio.clearInit()
        ingredienteRepositorio.clearInit()

        // Crear datos de prueba
        clienteTest = usuarioRepositorio.create(Usuario(
            nombre = "Juan",
            apellido = "Pérez",
            usuario = "juanperez",
            direccion = Direccion(
                calle = "Av. Siempre Viva",
                altura = 123
            )
        ))

        localTest = localRepositorio.create(Local(
            nombre = "Local Test",
            direccion = Direccion(
                calle = "Calle Test",
                altura = 456
            )
        ))

        val ingredienteTest = ingredienteRepositorio.create(Ingrediente(
            nombre = "Tomate",
            costoMercado = 10.0
        ))

        platoTest = platoRepositorio.create(Plato(
            nombre = "Pizza Margarita",
            descripcion = "Pizza clásica italiana",
            valorBase = 150.0,
            local = localTest
        ).apply {
            agregarIngrediente(ingredienteTest)
        })

        pedidoTest = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })
    }

    // region obtenerDetallePedido
    @Test
    fun `obtenerDetallePedido retorna el DTO con todos los campos`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertNotNull(detalle)
        assertEquals(pedidoTest.id, detalle.id)
        assertNotNull(detalle.cliente)
        assertNotNull(detalle.platos)
        assertNotNull(detalle.subtotal)
        assertNotNull(detalle.comisionDelivery)
        assertNotNull(detalle.incrementoPago)
        assertNotNull(detalle.total)
        assertNotNull(detalle.estado)
        assertNotNull(detalle.medioDePago)
    }

    @Test
    fun `obtenerDetallePedido retorna la información correcta del cliente`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("Juan Pérez", detalle.cliente.nombre)
        assertEquals("juanperez", detalle.cliente.username)
        assertTrue(detalle.direccion.direccion.contains("Av. Siempre Viva"))
    }

    @Test
    fun `obtenerDetallePedido retorna los platos del pedido`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals(1, detalle.platos.size)
        assertEquals("Pizza Margarita", detalle.platos[0].nombre)
        assertEquals("Pizza clásica italiana", detalle.platos[0].descripcion)
    }

    @Test
    fun `obtenerDetallePedido retorna todos los platos cuando hay múltiples`() {
        val plato2 = platoRepositorio.create(Plato(
            nombre = "Hamburguesa",
            descripcion = "Hamburguesa completa",
            valorBase = 120.0,
            local = localTest
        ))

        val pedidoMultiple = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(plato2)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoMultiple.id!!)

        assertEquals(2, detalle.platos.size)
    }

    @Test
    fun `obtenerDetallePedido incluye platos duplicados`() {
        val pedidoConDuplicados = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoConDuplicados.id!!)

        assertEquals(3, detalle.platos.size)
    }

    @Test
    fun `obtenerDetallePedido calcula correctamente el subtotal`() {
        val plato2 = platoRepositorio.create(Plato(
            nombre = "Ensalada",
            descripcion = "Ensalada fresca",
            valorBase = 80.0,
            local = localTest
        ))

        val pedidoCalculo = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(plato2)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoCalculo.id!!)

        assertEquals(pedidoCalculo.valorVentaPlatos(), detalle.subtotal, 0.01)
    }

    @Test
    fun `obtenerDetallePedido retorna el estado correcto`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.PREPARADO)

        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("PREPARADO", detalle.estado)
    }

    @Test
    fun `obtenerDetallePedido retorna el medio de pago correcto`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("EFECTIVO", detalle.medioDePago)
    }

    @Test
    fun `obtenerDetallePedido con QR retorna el medio correcto`() {
        val pedidoQR = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.QR,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoQR.id!!)

        assertEquals("QR", detalle.medioDePago)
    }

    @Test
    fun `obtenerDetallePedido con TARJETA retorna el medio correcto`() {
        val pedidoTransferencia = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.TARJETA,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoTransferencia.id!!)

        assertEquals("TARJETA", detalle.medioDePago)
    }

    @Test
    fun `obtenerDetallePedido incluye la comisión del delivery`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertTrue(detalle.comisionDelivery >= 0)
        assertEquals(detalle.subtotal * 0.10, detalle.comisionDelivery, 0.01)
    }

    @Test
    fun `obtenerDetallePedido incluye el incremento por tipo de pago`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertTrue(detalle.incrementoPago >= 0)
    }

    @Test
    fun `obtenerDetallePedido calcula el total correctamente`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        val totalCalculado = detalle.subtotal + detalle.comisionDelivery + detalle.incrementoPago
        assertEquals(totalCalculado, detalle.total, 0.01)
    }

    @Test
    fun `obtenerDetallePedido lanza excepción cuando el pedido no existe`() {
        assertThrows<Exception> {
            detalleService.obtenerDetallePedido(99999)
        }
    }

    @Test
    fun `obtenerDetallePedido incluye el id de cada plato`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals(platoTest.id, detalle.platos[0].id)
    }

    @Test
    fun `obtenerDetallePedido incluye la imagen de cada plato`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertNotNull(detalle.platos[0].imagenUrl)
    }

    @Test
    fun `obtenerDetallePedido maneja pedido con estado PENDIENTE`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.PENDIENTE)

        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("PENDIENTE", detalle.estado)
    }

    @Test
    fun `obtenerDetallePedido maneja pedido con estado ENTREGADO`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.ENTREGADO)

        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("ENTREGADO", detalle.estado)
    }

    @Test
    fun `obtenerDetallePedido maneja pedido con estado CANCELADO`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.CANCELADO)

        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        assertEquals("CANCELADO", detalle.estado)
    }

    @Test
    fun `obtenerDetallePedido con efectivo tiene incremento 0`() {
        val pedidoEfectivo = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoEfectivo.id!!)

        assertEquals(0.0, detalle.incrementoPago, 0.01)
    }

    @Test
    fun `obtenerDetallePedido con QR tiene incremento del 5 por ciento`() {
        val pedidoQR = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.QR,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoQR.id!!)

        assertEquals(detalle.subtotal * 0.05, detalle.incrementoPago, 0.01)
    }

    @Test
    fun `obtenerDetallePedido mantiene el orden de los platos`() {
        val plato1 = platoTest
        val plato2 = platoRepositorio.create(Plato(
            nombre = "Ensalada",
            descripcion = "Ensalada fresca",
            valorBase = 80.0,
            local = localTest
        ))
        val plato3 = platoRepositorio.create(Plato(
            nombre = "Postre",
            descripcion = "Postre del día",
            valorBase = 50.0,
            local = localTest
        ))

        val pedidoOrden = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(plato1)
            agregarPlatoAlPedido(plato2)
            agregarPlatoAlPedido(plato3)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoOrden.id!!)

        assertEquals(3, detalle.platos.size)
        assertEquals("Pizza Margarita", detalle.platos[0].nombre)
        assertEquals("Ensalada", detalle.platos[1].nombre)
        assertEquals("Postre", detalle.platos[2].nombre)
    }

    @Test
    fun `obtenerDetallePedido calcula comisión delivery como 10 por ciento del subtotal`() {
        val detalle = detalleService.obtenerDetallePedido(pedidoTest.id!!)

        val comisionEsperada = detalle.subtotal * 0.10
        assertEquals(comisionEsperada, detalle.comisionDelivery, 0.01)
    }

    @Test
    fun `obtenerDetallePedido con TARJETA tiene incremento del 5 por ciento`() {
        val pedidoTransferencia = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.TARJETA,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val detalle = detalleService.obtenerDetallePedido(pedidoTransferencia.id!!)

        assertEquals(detalle.subtotal * 0.05, detalle.incrementoPago, 0.01)
    }
    // endregion
}