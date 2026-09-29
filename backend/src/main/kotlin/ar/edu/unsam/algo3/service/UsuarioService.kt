package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.ErrorException
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.dto.UsuarioDTO
import ar.edu.unsam.algo3.dto.toDomain
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import ar.edu.unsam.algo3.repositorios.UsuarioRepositorio
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.dto.LocalAPuntuarDTO
import ar.edu.unsam.algo3.dto.toDTO
import ar.edu.unsam.algo3.repositorios.LocalRepositorio

@Service
class UsuarioService(
    private val usuarioRepositorio: UsuarioRepositorio,
    private val localRepositorio: LocalRepositorio,
    private val ingredienteRepositorio: IngredienteRepositorio
) {
    fun getById(id: Int) = usuarioRepositorio.getById(id)

    fun update(id: Int, usuarioDTO: UsuarioDTO): Usuario {
        if (usuarioDTO.id != id) {
            throw ErrorException.BusinessException("El id en la URL($id) es distinto del id que viene en el body($usuarioDTO.id)")
        }

        val usuarioExistente = usuarioRepositorio.getById(id)

        // reconstruccion del usuario valido a partir del usuario dto
        val usuarioReconstruido = usuarioDTO.toDomain(ingredienteRepositorio, localRepositorio)

        usuarioExistente.actualizar(usuarioReconstruido)
        usuarioExistente.validar()

        return usuarioRepositorio.update(usuarioExistente)
    }

    fun obtenerLocalesAPuntuar(idUsuario: Int): List<LocalAPuntuarDTO> {
        val usuario = usuarioRepositorio.getById(idUsuario)

        return usuario.localesAPuntuar.map { (local, fechaLimite) ->
            LocalAPuntuarDTO(
                local.toDTO(),
                fechaLimite = fechaLimite.toString()
            )
        }
    }

    fun puntuarLocal(idUsuario: Int, idLocal: Int, puntuacion: Double, review: String) {
        val usuario = usuarioRepositorio.getById(idUsuario)
        val local = localRepositorio.getById(idLocal)

        // Llama al metodo de Usuario que valida y puntúa
        usuario.puntuarLocal(local, puntuacion, review)
    }
}