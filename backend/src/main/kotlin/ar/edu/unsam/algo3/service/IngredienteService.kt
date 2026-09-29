package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.ErrorException
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import org.springframework.stereotype.Service

@Service
class IngredienteService(private val repositorioIngrediente: IngredienteRepositorio) {

    fun getAll() = repositorioIngrediente.findAll()
    fun getById(id: Int) = repositorioIngrediente.getById(id)
    fun create(nuevoIngrediente: Ingrediente): Ingrediente {
        if (nuevoIngrediente.id != null) {
            throw ErrorException.BusinessException("No se debe pasar el identificador del ingrediente")
        }
        nuevoIngrediente.validar()
        repositorioIngrediente.create(nuevoIngrediente)
        return nuevoIngrediente
    }
    fun update(id: Int, ingredienteActualizado: Ingrediente): Ingrediente {
        if (ingredienteActualizado.id == null) {
            throw ErrorException.BusinessException("Debe proveerse ID del ingrediente a actualizar")
        }
        if (ingredienteActualizado.id!! != id) {
            throw ErrorException.BusinessException("ID en URL distinto del ID en body")
        }
        ingredienteActualizado.validar()
        val ingrediente = getById(id)
        ingrediente.actualizar(ingredienteActualizado)
        repositorioIngrediente.update(ingrediente)
        return ingrediente
    }

    fun borrarIngrediente(id: Int): Ingrediente {
        val ingrediente = getById(id)
        repositorioIngrediente.delete(ingrediente)
        return ingrediente
    }
}