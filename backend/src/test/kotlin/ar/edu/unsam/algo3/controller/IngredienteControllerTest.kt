package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Dado un controller de ingredientes")
class IngredienteControllerTest(@Autowired val mockMvc: MockMvc) {

    @Autowired
    lateinit var ingredienteRepositorio: IngredienteRepositorio

    lateinit var ingrediente: Ingrediente

    @BeforeEach
    fun init() {
        ingredienteRepositorio.memoria.clear()
        ingrediente = ingredienteRepositorio.create(Ingrediente(nombre = "queso", costoMercado = 10.0))
        ingredienteRepositorio.create(Ingrediente(nombre = "jamon", costoMercado = 20.0))
    }

    // region GET /ingrediente
    @Test
    fun `se pueden obtener todos los ingredientes`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/ingrediente"))
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.length()").value(2))
    }
    // endregion

    // region GET /ingrediente/{id}
    @Test
    fun `se puede obtener un ingrediente por su id`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/ingrediente/" + ingrediente.id))
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.id").value(ingrediente.id))
            .andExpect(jsonPath("$.nombre").value(ingrediente.nombre))
    }

    @Test
    fun `si se pide un ingrediente con un id que no existe se produce un error`() {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/ingrediente/20000"))
            .andExpect(status().isNotFound)
    }
    // endregion

    // region [actualizar] PUT /ingrediente/{id}
    @Test
    fun `actualizar un ingrediente a un valor valido actualiza correctamente`() {
        val ingredienteValido = Ingrediente(nombre = "queso azul", costoMercado = 15.0).apply {
            id = ingrediente.id
        }
        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/ingrediente/" + ingredienteValido.id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteValido))
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.nombre").value("queso azul"))
    }

    @Test
    fun `si se intenta actualizar un ingrediente con datos vacios, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "", costoMercado = 10.0).apply {
            id = ingrediente.id
        }

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/ingrediente/" + ingrediente.id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "El nombre del ingrediente no puede estar vacio.")
    }

    @Test
    fun `si se intenta actualizar un ingrediente omitiendo su id en json, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "queso azul", costoMercado = 10.0)

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/ingrediente/" + ingrediente.id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "Debe proveerse ID del ingrediente a actualizar")
    }

    @Test
    fun `si se intenta actualizar un ingrediente con id diferente en el request y en el body, el sistema rechaza la operacion`() {
        val ingredienteJSON = """
            {
                "id": ${ingrediente.id},
                "nombre":  "queso azul",
                "costo": 10.0
            }
        """.trimIndent()

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/ingrediente/" + 2)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ingredienteJSON)
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "ID en URL distinto del ID en body")
    }
    
    // endregion

    // region [crear] POST /ingrediente
    @Test
    fun `crear un ingrediente a un valor valido actualiza correctamente`() {
        val nombreNuevoIngrediente = "tomate"
        val mapper = ObjectMapper()
        val ingredienteValido = Ingrediente(nombre = nombreNuevoIngrediente, costoMercado = 5.0)
        val nuevoIngredienteResponse = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/ingrediente")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(ingredienteValido))
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andReturn().response.contentAsString

        val jsonNode = mapper.readTree(nuevoIngredienteResponse)
        val ingredienteId = jsonNode.get("id").asInt()

        val nuevoIngrediente = ingredienteRepositorio.getById(ingredienteId)
        assertEquals(nuevoIngrediente.nombre, nombreNuevoIngrediente)
    }

    @Test
    fun `si se intenta crear un ingrediente con nombre vacio, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "", costoMercado = 10.0)

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/ingrediente")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "El nombre del ingrediente no puede estar vacio.")
    }

    @Test
    fun `si se intenta crear un ingrediente con costoMercado igual a 0, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "tomate", costoMercado = 0.0)

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/ingrediente")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "El costo de mercado debe ser un valor positivo.")
    }

    @Test
    fun `si se intenta crear un ingrediente con costoMercado negativo, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "tomate", costoMercado = -10.0)

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/ingrediente")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "El costo de mercado debe ser un valor positivo.")
    }

    @Test
    fun `si se intenta crear un ingrediente pasando un id, el sistema rechaza la operacion`() {
        val ingredienteInvalido = Ingrediente(nombre = "tomate", costoMercado = 10.0).apply {
            id = 100
        }

        val errorMessage = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/ingrediente")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(ingredienteInvalido))
            )
            .andExpect(status().isBadRequest)
            .andReturn().resolvedException?.message

        assertEquals(errorMessage, "No se debe pasar el identificador del ingrediente")
    }

    // endregion

    // region DELETE /ingrediente/{id}
    @Test
    fun `se puede eliminar un ingrediente existente en forma exitosa`() {
        ingredienteRepositorio.memoria.clear() 
        val ingrediente = Ingrediente(nombre = "papa", costoMercado = 5.0)
        ingredienteRepositorio.create(ingrediente)

        mockMvc.delete("/ingrediente/${ingrediente.id}")
            .andExpect { status { isOk() } }

        assertEquals(0, ingredienteRepositorio.findAll().size)
    }

    @Test
    fun `si pasamos un ingrediente que no existe no se puede borrar`() {
        mockMvc.perform(MockMvcRequestBuilders.delete("/ingrediente/99"))
            .andExpect(status().isNotFound)
    }
    // endregion
}