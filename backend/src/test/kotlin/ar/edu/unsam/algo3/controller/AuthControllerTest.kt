package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.dto.LoginRequest
import ar.edu.unsam.algo3.dto.RegisterRequest
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import ar.edu.unsam.algo3.service.AuthService
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Dado un controller de autenticación")
class AuthControllerTest(@Autowired val mockMvc: MockMvc) {

    @Autowired
    lateinit var localRepositorio: LocalRepositorio

    @Autowired
    lateinit var authService: AuthService

    lateinit var localExistente: Local

    @BeforeEach
    fun init() {
        localRepositorio.memoria.clear()
        // Crear un local de prueba
        localExistente = authService.crearUser("usuario_test", "password123")!!
    }

    // region POST /api/auth/login
    @Test
    fun `login exitoso devuelve status 200 y datos del usuario`() {
        val loginRequest = LoginRequest(usuario = "usuario_test", password = "password123")

        val response = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(loginRequest))
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Login Exitoso"))
            .andExpect(jsonPath("$.usuario").value("usuario_test"))
            .andExpect(jsonPath("$.idLocal").value(localExistente.id))
            .andReturn()
    }

    @Test
    fun `login con credenciales incorrectas devuelve status 401`() {
        val loginRequest = LoginRequest(usuario = "usuario_test", password = "password_incorrecta")

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(loginRequest))
            )
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Usuario o contraseña incorrecto. Vuelva a intentarlo."))
    }

    @Test
    fun `login con usuario inexistente devuelve status 401`() {
        val loginRequest = LoginRequest(usuario = "usuario_inexistente", password = "password123")

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(loginRequest))
            )
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.success").value(false))
    }

    @Test
    fun `login devuelve el idLocal correcto`() {
        val loginRequest = LoginRequest(usuario = "usuario_test", password = "password123")

        val response = mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(loginRequest))
            )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val jsonNode = ObjectMapper().readTree(response)
        val idLocal = jsonNode.get("idLocal").asInt()

        assertEquals(localExistente.id, idLocal)
    }
    // endregion

    // region POST /api/auth/registro
    @Test
    fun `registro exitoso devuelve status 201 y datos del nuevo usuario`() {
        val registerRequest = RegisterRequest(
            usuario = "nuevo_usuario",
            password = "password123",
            confirmarPassword = "password123"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Usuario creado con exito."))
            .andExpect(jsonPath("$.usuario").value("nuevo_usuario"))
            .andExpect(jsonPath("$.idLocal").exists())
    }

    @Test
    fun `registro con contraseñas que no coinciden devuelve status 400`() {
        val registerRequest = RegisterRequest(
            usuario = "nuevo_usuario",
            password = "password123",
            confirmarPassword = "password456"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Las contraseñas no coinciden."))
    }

    @Test
    fun `registro con usuario existente devuelve status 409`() {
        val registerRequest = RegisterRequest(
            usuario = "usuario_test",
            password = "password123",
            confirmarPassword = "password123"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isConflict)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Usuario ya existe."))
    }

    @Test
    fun `registro con usuario vacío devuelve status 400`() {
        val registerRequest = RegisterRequest(
            usuario = "",
            password = "password123",
            confirmarPassword = "password123"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Usuario y contraseña son requeridos."))
    }

    @Test
    fun `registro con contraseña vacía devuelve status 400`() {
        val registerRequest = RegisterRequest(
            usuario = "nuevo_usuario",
            password = "",
            confirmarPassword = ""
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Usuario y contraseña son requeridos."))
    }

    @Test
    fun `registro crea el local correctamente en el repositorio`() {
        val registerRequest = RegisterRequest(
            usuario = "usuario_creado",
            password = "password123",
            confirmarPassword = "password123"
        )

        val cantidadAntes = localRepositorio.findAll().size

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isCreated)

        val cantidadDespues = localRepositorio.findAll().size
        assertEquals(cantidadAntes + 1, cantidadDespues)

        val locales = localRepositorio.search("usuario_creado")
        assertEquals(1, locales.size)
        assertEquals("usuario_creado", locales[0].usuario)
    }

    @Test
    fun `registro con usuario solo espacios devuelve status 400`() {
        val registerRequest = RegisterRequest(
            usuario = "   ",
            password = "password123",
            confirmarPassword = "password123"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
    }

    @Test
    fun `login después de registro funciona correctamente`() {
        // Registrar usuario
        val registerRequest = RegisterRequest(
            usuario = "nuevo_login",
            password = "password123",
            confirmarPassword = "password123"
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/registro")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(registerRequest))
            )
            .andExpect(status().isCreated)

        // Hacer login con el mismo usuario
        val loginRequest = LoginRequest(usuario = "nuevo_login", password = "password123")

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(loginRequest))
            )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.usuario").value("nuevo_login"))
    }
    // endregion
}