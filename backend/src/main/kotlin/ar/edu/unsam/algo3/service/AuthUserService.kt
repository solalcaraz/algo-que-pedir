package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.ErrorException
import ar.edu.unsam.algo3.Usuario
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.repositorios.UsuarioRepositorio
import ar.edu.unsam.algo3.utils.HashUtils
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.dto.InfoUsuarioResponse
import ar.edu.unsam.algo3.dto.LoginRequestUsuario
import ar.edu.unsam.algo3.dto.RegisterRequestUsuario
import ar.edu.unsam.algo3.dto.toInfoUsuarioDTO
import org.uqbar.geodds.Point


@Service
class AuthUsuarioService(private val usuarioRepositorio : UsuarioRepositorio){

    //Funcion para centralizar todas las validaciones para el registro desde el back
    private fun validarCamposRegistro(data: RegisterRequestUsuario) : MutableList<String> {
        val soloTextoRegex = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+\$"

        val errores = mutableListOf<String>()

        fun chequeo(condicion: Boolean, mensaje: String) {
            if(!condicion) errores.add(mensaje)
        }

        chequeo(data.nombre.isNotBlank(), "El nombre es obligatorio")
        chequeo(Regex(soloTextoRegex).matches(data.nombre), "El nombre debe contener solo texto")
        chequeo(data.apellido.isNotBlank(), "El apellido es obligatorio")
        chequeo(Regex(soloTextoRegex).matches(data.apellido), "El apellido debe contener solo texto")
        chequeo(data.usuario.isNotBlank(), "El usuario es obligatorio")
        chequeo(data.password.isNotBlank(), "La contraseña es obligatoria")
        chequeo(data.confirmarPassword.isNotBlank(), "Debes re-ingresar la contraseña")
        chequeo(data.calle.isNotBlank() && Regex(soloTextoRegex).matches(data.calle), "La calle debe contener solo texto")
        chequeo(data.altura.toIntOrNull() != null && data.altura.toInt() > 0, "La altura tiene que ser un numero valido")

        return errores
    }


    fun existeUser(usuario: String): Boolean{
        return usuarioRepositorio.search(usuario).isNotEmpty()
    }

    fun registrarUsuario(dataUsuario: RegisterRequestUsuario): Usuario {
        val errores = validarCamposRegistro(dataUsuario)        //Almacena los errores generales

        //Confirma que las contraseñas matcheen
        if(dataUsuario.password != dataUsuario.confirmarPassword){ errores.add("Las contraseñas no coinciden") }

        //Confirma que el usuario no exista
        if(existeUser(dataUsuario.usuario)) {errores.add("El usuario ${dataUsuario.usuario} ya existe") }

        //Lanza todos los errores con la BusinessException si los hubiere
        if(errores.isNotEmpty()){
            throw ErrorException.BusinessException(mensaje = errores.joinToString(" | "))
        }

        val passwordHasheada = HashUtils.hash53(dataUsuario.password)

        //El unico valor que no es real es el del Point pero calle y altura lo recibe del Formulario
        val nuevaDireccionUsuario = Direccion(
            calle = dataUsuario.calle,
            altura = dataUsuario.altura.toInt(),
            ubicacion = Point(31.4, 20.5)
        )

        val nuevoUsuarioRegistrado = Usuario(
            nombre= dataUsuario.nombre,
            apellido= dataUsuario.apellido,
            usuario= dataUsuario.usuario,
            password = passwordHasheada,
            direccion = nuevaDireccionUsuario
        )

        usuarioRepositorio.create(nuevoUsuarioRegistrado)
        return nuevoUsuarioRegistrado
    }

    fun loginUsuario(dataLogin : LoginRequestUsuario): Usuario {
        val usuarioEncontrado = usuarioRepositorio.search(dataLogin.usuario).firstOrNull()
            ?: throw ErrorException.BusinessException("Usuario o contraseña incorrectos")

        val passwordHasheada = HashUtils.hash53(dataLogin.password)

        if(usuarioEncontrado.password != passwordHasheada){
            throw ErrorException.BusinessException("Usuario o contraseña incorrectas")
        }

        return usuarioEncontrado
    }

    //Retorna toda la lista de usuarios registrados en la app
    fun obtenerTodosLosUsuarios(): List<InfoUsuarioResponse> {
        return usuarioRepositorio.findAll().map { usuario -> usuario.toInfoUsuarioDTO() }
    }
}
