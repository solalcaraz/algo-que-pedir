package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.ErrorException
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import ar.edu.unsam.algo3.repositorios.PlatoRepositorio
import org.springframework.stereotype.Service

@Service
class PlatoService (
    private val platoRepository: PlatoRepositorio,
    private val localRepository: LocalRepositorio,
    private val ingredienteRepository: IngredienteRepositorio
) {
    fun getAll() = platoRepository.findAll()

    fun getById(id: Int) = platoRepository.getById(id)

    fun create(nuevoPlato: Plato, idLocal: Int): Plato {
        if (nuevoPlato.id != null) {
            throw ErrorException.BusinessException("No se debe pasar el identificador del plato")
        }
        asignarLocal(nuevoPlato, idLocal)
        asignarIngredientes(nuevoPlato)

        nuevoPlato.validar()
        return platoRepository.create(nuevoPlato)
    }

    fun update(id: Int, actualizarPlato: Plato, idLocal: Int): Plato {
        if (actualizarPlato.id == null){
            throw ErrorException.BusinessException("El objeto debe tener un ID")
        }
        if (actualizarPlato.id!! != id) {
            throw ErrorException.BusinessException("Id en URL distinto del id que viene en el body")
        }

        val platoExistente = platoRepository.getById(id)
        // Solo el local dueño del plato lo puede modificar
        if (platoExistente.local.id != idLocal) {
            throw ErrorException.BusinessException("No tiene permisos para modificar este plato")
        }

        asignarIngredientes(actualizarPlato)

        platoExistente.actualizar(actualizarPlato)
        platoExistente.validar()

        return platoRepository.update(platoExistente)
    }

    fun delete(id: Int): List<Plato> {
        val platoAEliminar = platoRepository.getById(id = id)
        platoRepository.delete(platoAEliminar)
        return platoRepository.findAll()
    }

    private fun asignarLocal(plato: Plato, idLocal: Int) {
        plato.local = localRepository.getById(idLocal)
    }

    private fun asignarIngredientes(plato: Plato){
        val ingredientesActuales = plato.listaDeIngredientes.toMutableSet()
        plato.listaDeIngredientes.clear()

        val ingredientesFaltantes = mutableSetOf<String>()
        ingredientesActuales.forEach { ingrediente ->
            val ingredienteExistente = ingredienteRepository.getByNombre(ingrediente.nombre)

            if (ingredienteExistente != null) {
                plato.agregarIngrediente(ingredienteExistente)
            } else {
                ingredientesFaltantes.add(ingrediente.nombre)
            }
        }

        if (ingredientesFaltantes.isNotEmpty()) {
            throw ErrorException.BusinessException("No se encontraron los ingredientes: ${ingredientesFaltantes.joinToString()}")
        }
    }

    fun getPlatosByLocalID(localID : Int) : List<Plato> {
        val localABuscar = localRepository.getById(localID)

        val listaPlatos = platoRepository.findAll().filter {
            plato -> plato.local.id == localABuscar.id
        }.toMutableList()

        return listaPlatos
    }
}