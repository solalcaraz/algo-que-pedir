package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.repositorios.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.time.LocalDate

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Dado un controller de detalle de pedidos")
class DetalleControllerTest(@Autowired val mockMvc: MockMvc) {

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

        // Crear cliente de prueba
        clienteTest = usuarioRepositorio.create(Usuario(
            nombre = "Juan",
            apellido = "Pérez",
            usuario = "juanperez",
            direccion = Direccion(
                calle = "Av. Siempre Viva",
                altura = 123
            )
        ))

        // Crear local de prueba
        localTest = localRepositorio.create(Local(
            nombre = "Local Test",
            direccion = Direccion(
                calle = "Calle Test",
                altura = 456
            )
        ))

        // Crear ingrediente para el plato
        val ingredienteTest = ingredienteRepositorio.create(Ingrediente(
            nombre = "Tomate",
            costoMercado = 10.0
        ))

        // Crear plato de prueba
        platoTest = platoRepositorio.create(Plato(
            nombre = "Pizza Margarita",
            descripcion = "Pizza clásica italiana",
            valorBase = 150.0,
            local = localTest
        ).apply {
            agregarIngrediente(ingredienteTest)
        })

        // Crear pedido de prueba
        pedidoTest = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })
    }

    // region GET /detalle-pedido/{id}
    @Test
    fun `se puede obtener el detalle de un pedido por su id`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.id").value(pedidoTest.id))
    }

    @Test
    fun `el detalle incluye informacion del cliente`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.cliente.nombre").value("Juan Pérez"))
            .andExpect(jsonPath("$.cliente.username").value("juanperez"))
            .andExpect(jsonPath("$.direccion.direccion").exists())
    }

    @Test
    fun `el detalle incluye los platos del pedido`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos").isArray)
            .andExpect(jsonPath("$.platos.length()").value(1))
            .andExpect(jsonPath("$.platos[0].nombre").value("Pizza Margarita"))
            .andExpect(jsonPath("$.platos[0].descripcion").value("Pizza clásica italiana"))
    }

    @Test
    fun `el detalle incluye informacion de totales`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.subtotal").exists())
            .andExpect(jsonPath("$.comisionDelivery").exists())
            .andExpect(jsonPath("$.incrementoPago").exists())
            .andExpect(jsonPath("$.total").exists())
    }

    @Test
    fun `el detalle incluye el estado del pedido`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.estado").value("PENDIENTE"))
    }

    @Test
    fun `el detalle incluye el medio de pago`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.medioDePago").value("EFECTIVO"))
    }

    @Test
    fun `si se pide un pedido con un id que no existe se produce un error 404`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/99999"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `pedido con multiples platos muestra todos en el detalle`() {
        val plato2 = platoRepositorio.create(Plato(
            nombre = "Hamburguesa Completa",
            descripcion = "Hamburguesa con todos los ingredientes",
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

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoMultiple.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos.length()").value(2))
            .andExpect(jsonPath("$.platos[0].nombre").value("Pizza Margarita"))
            .andExpect(jsonPath("$.platos[1].nombre").value("Hamburguesa Completa"))
    }

    @Test
    fun `pedido con plato repetido muestra todas las instancias`() {
        val pedidoConRepetidos = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(platoTest)
            agregarPlatoAlPedido(platoTest)
        })

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoConRepetidos.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos.length()").value(3))
    }

    @Test
    fun `detalle muestra correctamente pedido con QR`() {
        val pedidoQR = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.QR,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoQR.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.medioDePago").value("QR"))
    }

    @Test
    fun `detalle muestra correctamente pedido con transferencia bancaria`() {
        val pedidoTransferencia = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.TARJETA,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTransferencia.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.medioDePago").value("TARJETA"))
    }

    @Test
    fun `detalle muestra el precio correcto de cada plato`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos[0].precio").exists())
    }

    @Test
    fun `detalle incluye la imagen del plato`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos[0].imagenUrl").exists())
    }

    @Test
    fun `el subtotal se calcula correctamente`() {
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
            agregarPlatoAlPedido(platoTest) // 150.0
            agregarPlatoAlPedido(plato2)     // 80.0
        })

        val response = mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoCalculo.id}"))
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val jsonNode = ObjectMapper().readTree(response)
        val subtotal = jsonNode.get("subtotal").asDouble()

        // Verificar que el subtotal es la suma de los valores de venta de los platos
        val subtotalEsperado = pedidoCalculo.valorVentaPlatos()
        assertEquals(subtotalEsperado, subtotal, 0.01)
    }

    @Test
    fun `pedido en estado PENDIENTE muestra el estado correcto`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.PENDIENTE)

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.estado").value("PENDIENTE"))
    }

    @Test
    fun `pedido en estado PREPARADO muestra el estado correcto`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.PREPARADO)

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.estado").value("PREPARADO"))
    }

    @Test
    fun `pedido en estado ENTREGADO muestra el estado correcto`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.ENTREGADO)

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.estado").value("ENTREGADO"))
    }

    @Test
    fun `pedido en estado CANCELADO muestra el estado correcto`() {
        pedidoTest.cambiaDeEstado(EnumEstadosPedido.CANCELADO)

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.estado").value("CANCELADO"))
    }

    @Test
    fun `pedido con efectivo tiene incremento 0`() {
        val pedidoEfectivo = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.EFECTIVO,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoEfectivo.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.incrementoPago").value(0.0))
    }

    @Test
    fun `pedido con QR tiene incremento del 5 por ciento del subtotal`() {
        val pedidoQR = pedidoRepositorio.create(Pedido(
            cliente = clienteTest,
            local = localTest,
            medioDePago = MedioDePago.QR,
            fechaPedido = LocalDate.now()
        ).apply {
            agregarPlatoAlPedido(platoTest)
        })

        val response = mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoQR.id}"))
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val jsonNode = ObjectMapper().readTree(response)
        val subtotal = jsonNode.get("subtotal").asDouble()
        val incrementoPago = jsonNode.get("incrementoPago").asDouble()

        assertEquals(subtotal * 0.05, incrementoPago, 0.01)
    }

    @Test
    fun `detalle incluye el id del plato`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.platos[0].id").value(platoTest.id))
    }

    @Test
    fun `el total incluye subtotal mas comision mas incremento`() {
        val response = mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val jsonNode = ObjectMapper().readTree(response)
        val subtotal = jsonNode.get("subtotal").asDouble()
        val comisionDelivery = jsonNode.get("comisionDelivery").asDouble()
        val incrementoPago = jsonNode.get("incrementoPago").asDouble()
        val total = jsonNode.get("total").asDouble()

        val totalCalculado = subtotal + comisionDelivery + incrementoPago
        assertEquals(totalCalculado, total, 0.01)
    }

    @Test
    fun `la comision del delivery es el 10 por ciento del subtotal`() {
        val response = mockMvc
            .perform(MockMvcRequestBuilders.get("/detalle-pedido/${pedidoTest.id}"))
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val jsonNode = ObjectMapper().readTree(response)
        val subtotal = jsonNode.get("subtotal").asDouble()
        val comisionDelivery = jsonNode.get("comisionDelivery").asDouble()

        assertEquals(subtotal * 0.10, comisionDelivery, 0.01)
    }
    // endregion
}