package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.AuthResponse
import ar.edu.unsam.algo3.dto.LoginRequest
import ar.edu.unsam.algo3.dto.RegisterRequest
import ar.edu.unsam.algo3.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = ["http://localhost:5173"])
class AuthController (private val authService: AuthService){
    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<AuthResponse> {
        return try {
            val local = authService.validarLocal(loginRequest.usuario, loginRequest.password)
            if(local != null){
                ResponseEntity.ok(AuthResponse(
                    success = true,
                    message = "Login Exitoso",
                    usuario = loginRequest.usuario,
                    idLocal = local.id
                ))
            }
            else {
                ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse(
                    success = false,
                    message = "Usuario o contraseña incorrecto. Vuelva a intentarlo."
                ))
            }
        }
        catch (e: Exception) {
            println(e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthResponse(
                success = false,
                message = "Error en el servidor"
            ))

        }
    }

    @PostMapping("/registro")
    fun registrar(@RequestBody registerRequest: RegisterRequest): ResponseEntity<AuthResponse> {
        return try {
            if (registerRequest.password != registerRequest.confirmarPassword){
                return ResponseEntity.badRequest().body(AuthResponse(
                    success = false,
                    message = "Las contraseñas no coinciden."
                ))
            }

            if (registerRequest.usuario.isBlank() || registerRequest.password.isBlank()){
                return ResponseEntity.badRequest().body(AuthResponse(
                    success = false,
                    message = "Usuario y contraseña son requeridos."
                ))
            }

            if (authService.existeUser(registerRequest.usuario)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(AuthResponse(
                    success = false,
                    message = "Usuario ya existe."
                ))
            }

            val nuevoUser = authService.crearUser(registerRequest.usuario, registerRequest.password)

            if(nuevoUser != null){
                ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse(
                    success = true,
                    message = "Usuario creado con exito.",
                    usuario = registerRequest.usuario,
                    idLocal = nuevoUser.id
                ))
            }
            else{
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthResponse(
                    success = false,
                    message = "Usuario no pudo ser creado.",
                ))
            }
        }
        catch (e: Exception){
            println(e)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthResponse(
                success = false,
                message = "Error en el servidor."
            ))
        }
    }

}