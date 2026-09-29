package ar.edu.unsam.algo3.controller

import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import ar.edu.unsam.algo3.MedioDePago
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.dto.toDTO
import org.junit.jupiter.api.DisplayName
import org.springframework.http.MediaType
import ar.edu.unsam.algo3.service.LocalService
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.test.web.servlet.MockMvc
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point

@WebMvcTest(LocalController::class)
@DisplayName("Dado el perfil de un local")
class LocalControllerTest(@Autowired val mockMvc: MockMvc) {

    @MockBean
    lateinit var localService: LocalService

    @Autowired
    lateinit var objectMapper: ObjectMapper

    private fun crearLocalMock() : Local {
        val direccionMockeada = Direccion(
            calle = "Avenida de Mayo",
            altura = 825,
            ubicacion = Point(-34.6086531, -58.3782121)
        )

        return Local(
            nombre = "Café Tortoni",
            direccion = direccionMockeada,
            urlImagenLocal = "https://upload.wikimedia.org/wikipedia/commons/5/51/Caf%C3%A9_Tortoni.JPG",
            porcentajeSobreCadaPlato = 3.0,
            porcentajeRegaliasDeAutor = 3.0,
            mediosDePago = mutableSetOf()
        ).apply{
            id = 2
        }
    }

    @Test
    fun `hacer un get por id devuelve el local correcto`() {
        val localDomain = crearLocalMock()

        given(localService.obtenerLocalPorId(2)).willReturn(localDomain)

        mockMvc.perform(MockMvcRequestBuilders.get("/localAdmin/2"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Café Tortoni"))
    }

    @Test
    fun `hacer un put actualiza el local y devuelve el JSON actualizado`() {
        
        val localDomain = crearLocalMock()

        val localDTO = localDomain.toDTO()

        given(localService.actualizarLocalDesdeDTO(localDTO)).willReturn(localDomain)

        val json = objectMapper.writeValueAsString(localDTO)

        mockMvc.perform(
            MockMvcRequestBuilders.put("/localAdmin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Café Tortoni"))
            .andExpect(jsonPath("$.altura").value(825))
            .andExpect(jsonPath("$.porcentajeSobreCadaPlato").value(3))
            .andExpect(jsonPath("$.porcentajeRegaliasDeAutor").value(3))
    }

} // Fin LocalControllerTest
