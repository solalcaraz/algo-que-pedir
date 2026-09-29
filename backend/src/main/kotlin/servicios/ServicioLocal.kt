package ar.edu.unsam.algo3.service

import org.uqbar.geodds.Point
import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Plato
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import ar.edu.unsam.algo3.repositorios.UsuarioRepositorio
import java.util.Locale


@Service
class LocalService(
    private val localRepositorio: LocalRepositorio,
    private val platoService : PlatoService,
    private val usuarioRepositorio: UsuarioRepositorio
) {

    fun obtenerLocalPorId(id: Int): Local {
        val local = localRepositorio.getById(id)
        return local
    }

    fun obtenerTodosLosLocales(): List<Local> {
        return localRepositorio.findAll()
    }

    fun actualizarLocalDesdeDTO(localDTO: LocalDTO): Local {
        val local = localRepositorio.getById(localDTO.idLocal) // obtener el local existente
        local.nombre = localDTO.nombre
        local.urlImagenLocal = localDTO.urlImagenLocal
        local.direccion = Direccion(
            calle = localDTO.direccion,
            altura = localDTO.altura,
            ubicacion = Point(localDTO.latitud, localDTO.longitud)
        )
        local.porcentajeSobreCadaPlato = localDTO.porcentajeSobreCadaPlato
        local.porcentajeRegaliasDeAutor = localDTO.porcentajeRegaliasDeAutor

        local.mediosDePago.clear()
        localDTO.mediosDePago.forEach { medio -> local.agregarMedioDePago(medio) }

        return obtenerLocalPorId(local.id!!)
    }

    fun obtenerPlatosDisponibles(localID : Int) : List<Plato> {
        val platosDelLocal = platoService.getPlatosByLocalID(localID)       //El service de plato devuelve la lista de platos del local
        return platosDelLocal
    }

    fun distanciaConUsuario(idLocal: Int, idUsuario: Int): String {
        val local = localRepositorio.getById(idLocal)
        val usuario = usuarioRepositorio.getById(idUsuario)
        val distancia = local.direccion.distanciaCon(usuario.direccion)
        return String.format(Locale.US, "%.2f km", distancia)
    }

    fun usuarioEsCercano(local: Local, idUsuario: Int): Boolean {
        val usuario = usuarioRepositorio.getById(idUsuario)
        return usuario.esLocalCercano(local)
    }

} // Fin clase LocalService
