package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.LocalCriterioDTO
import ar.edu.unsam.algo3.dto.toCriterioDTO
import ar.edu.unsam.algo3.dto.LocalClienteDTO
import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.dto.LocalCercanoDTO
import ar.edu.unsam.algo3.dto.PlatoClienteDTO
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.dto.toClienteDTO
import ar.edu.unsam.algo3.dto.toDTO
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.collections.map

@RestController
@CrossOrigin(
    origins = ["http://localhost:5173"],
    allowedHeaders = ["*"],
    methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS]
)
class LocalController(private val localService: LocalService) {

    @GetMapping("/localAdmin/{id}")
    fun obtenerLocalPorId(@PathVariable id: Int): LocalDTO {
        return localService.obtenerLocalPorId(id).toDTO()
    }

    @PutMapping("/localAdmin")
    fun actualizarLocal(@RequestBody localDTO: LocalDTO): LocalDTO {
        println("DTO recibido: ${localDTO}")
        return localService.actualizarLocalDesdeDTO(localDTO).toDTO()
    }

    @GetMapping("/locales/")
    fun obtenerTodosLosLocales(): List<LocalDTO> {
        return localService.obtenerTodosLosLocales().map { local -> local.toDTO() }
    }

    // Devuelve los locales que el usuario necesita para listar, con menos informacion
    @GetMapping("/locales/criterio")
    fun obtenerLocalesCriterio(): List<LocalCriterioDTO> {
        return localService.obtenerTodosLosLocales().map { local -> local.toCriterioDTO() }
    }

    @GetMapping("/locales/{id}")
    fun obtenerLocales(@PathVariable id: Int): List<LocalCercanoDTO> {
        return localService.obtenerTodosLosLocales().map { local -> LocalCercanoDTO(local.toDTO(), localService.usuarioEsCercano(
            local, id)) }
    }

    //Va a devolver la lista de platos que necesita el front de la pagina de Usuario
    @GetMapping("/local/{id}/platos")
    fun obtenerPlatosDelLocal(@PathVariable id: Int): List<PlatoClienteDTO> {
        val platosDelLocal = localService.obtenerPlatosDisponibles(id)

        return platosDelLocal.map{ it.toClienteDTO()}
    }

    //Devuelve el DTO del Local que se usa en el front de la pagina de Usuario
    @GetMapping("/local/{id}")
    fun obtenerLocalClientePorId(@PathVariable id: Int): LocalClienteDTO {
        return localService.obtenerLocalPorId(id).toClienteDTO()
    }

    @GetMapping("/distancia")
    fun obtenerDistancia(
        @RequestParam fromLocalId: Int,
        @RequestParam toUserId: Int
    ): String = localService.distanciaConUsuario(fromLocalId, toUserId)
}