package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.AuthResponseUsuario
import ar.edu.unsam.algo3.dto.InfoUsuarioResponse
import ar.edu.unsam.algo3.dto.LoginRequestUsuario
import ar.edu.unsam.algo3.dto.RegisterRequestUsuario
import ar.edu.unsam.algo3.dto.toInfoUsuarioDTO
import ar.edu.unsam.algo3.service.AuthUsuarioService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@CrossOrigin("*")
class AuthUserController(private val authUserService : AuthUsuarioService) {
    @PostMapping("/api/registro")
    fun registro(@RequestBody dataRegistro : RegisterRequestUsuario) : ResponseEntity<AuthResponseUsuario> {

        val nuevoUsuario = authUserService.registrarUsuario(dataRegistro)

        val response = AuthResponseUsuario(
            success = true,
            message = "Usuario registrado con exito!",
            usuario = nuevoUsuario.toInfoUsuarioDTO()
        )

        return ResponseEntity(response, HttpStatus.CREATED)
    }

    @PostMapping("/api/login")
    fun login(@RequestBody dataLogin : LoginRequestUsuario) : ResponseEntity<AuthResponseUsuario> {
        val usuarioLogueado = authUserService.loginUsuario(dataLogin)

        val response = AuthResponseUsuario(
            success = true,
            message = "Login exitoso!",
            usuario = usuarioLogueado.toInfoUsuarioDTO()
        )

        return ResponseEntity(response, HttpStatus.OK)
    }

    @GetMapping("api/usuariosApp")
    fun listadoUsuarios(): List<InfoUsuarioResponse>{
        return authUserService.obtenerTodosLosUsuarios()
    }
}