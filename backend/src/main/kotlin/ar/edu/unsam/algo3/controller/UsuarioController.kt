package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.UsuarioDTO
import ar.edu.unsam.algo3.dto.toDTO
import ar.edu.unsam.algo3.service.UsuarioService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ar.edu.unsam.algo3.dto.LocalAPuntuarDTO
import ar.edu.unsam.algo3.dto.PuntuacionRequest
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(
    origins = ["*"],
    allowedHeaders = ["*"],
    methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS]
)
class UsuarioController(val usuarioService: UsuarioService) {
    @GetMapping("/usuario/{id}")
    fun usuarioPorId(@PathVariable id: Int) = usuarioService.getById(id)?.toDTO()

    @PutMapping("/usuario/{id}")
    fun actualizarUsuario(@PathVariable id: Int, @RequestBody usuarioBody: UsuarioDTO): UsuarioDTO =
        usuarioService.update(id, usuarioBody).toDTO()

    @GetMapping("/usuario/{id}/locales-a-puntuar")
    fun obtenerLocalesAPuntuar(@PathVariable id: Int): List<LocalAPuntuarDTO> {
        return usuarioService.obtenerLocalesAPuntuar(id)
    }

    @PostMapping("/usuario/{id}/puntuar-local/{idLocal}")
    fun puntuarLocal(
        @PathVariable id: Int,
        @PathVariable idLocal: Int,
        @RequestBody request: PuntuacionRequest
    ) {
        usuarioService.puntuarLocal(id, idLocal, request.puntuacion, request.review)
    }
}