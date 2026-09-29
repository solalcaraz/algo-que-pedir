package ar.edu.unsam.algo3.repositorios

import ar.edu.unsam.algo3.*
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.stereotype.Component

abstract class TipoRepositorio {
    @JsonProperty("id") var id: Int? = null
}

open class Repositorio<T : TipoRepositorio>(
    private val searcher: SearchStrategy<T>,
    private val nombreSelector: ((T) -> String)? = null
) {
    var idActual: Int = 0
    var memoria: MutableMap<Int, T> = mutableMapOf()

    fun create(objeto: T): T {
        // Lanza una excepcion del tipo IllegalArgumentException si no cumple la condicion
        require(objeto.id == null) { "El objeto ya esta creado" }
        val id = ++idActual
        objeto.id = id
        memoria[id] = objeto
        return objeto
    }

    fun delete(objeto: T) {
        val id = requireNotNull(objeto.id)
        memoria.remove(id)
    }

    fun update(objeto: T): T {
        val id = requireNotNull(objeto.id) { "Falta ID para actualizar" }
        check(memoria.containsKey(id)) { "No existe id $id" }
        memoria[id] = objeto
        return objeto
    }

    fun getById(id: Int): T {
        return memoria[id] ?: throw ErrorException.NotFoundException("No se encontró un objeto con id $id")
    }

    fun buscarPorNombre(nombre: String): T? {
        return nombreSelector?.let { sel ->
            memoria.values.firstOrNull { sel(it).equals(nombre, ignoreCase = true)}
        }
    }

    fun getByNombre(nombre: String): T {
        return buscarPorNombre(nombre)
            ?: throw ErrorException.NotFoundException("No se encontró $nombre")
    }

    fun search(value: String): List<T> {
        return memoria.values.filter { searcher.matches(it, value) }
    }

    fun findAll(): List<T> {
        return memoria.values.toList()
    }

    //Actualiza repositorio a través de una lista
    fun agregarDesdeLista(objetos: List<T>) {
        objetos.forEach { objeto ->
            when {
                objeto.id == null -> create(objeto) //Si no tiene ID crea el objeto
                memoria.containsKey(objeto.id) -> update(objeto)
                else -> memoria[requireNotNull(objeto.id)] = objeto //Si no está en el repo y tiene ID lo agrega
            }
        }
    }

    fun clearInit(){
        memoria.clear()
        idActual = 0
    }
}

// Hago esta clase para q Spring reconozca que esto es el repo
@Component
class PlatoRepositorio: Repositorio<Plato>(PlatoSearcher, nombreSelector = { it.nombre })

@Component
class IngredienteRepositorio: Repositorio<Ingrediente>(IngredienteSearcher, nombreSelector = { it.nombre })
@Component
class LocalRepositorio: Repositorio<Local>(LocalSearcher)

@Component
open class PedidoRepositorio : Repositorio<Pedido>(PedidoSearcher)

@Component
class UsuarioRepositorio : Repositorio<Usuario>(UsuarioSearcher, nombreSelector = { it.usuario })

// Singletons de algo2:
object Repositorios {
    val usuario = Repositorio<Usuario>(
        searcher = UsuarioSearcher,
    )
    val plato = Repositorio<Plato>(
        searcher = PlatoSearcher,
    )
    val local = Repositorio<Local>(
        searcher = LocalSearcher,
    )
    val delivery = Repositorio<Delivery>(
        searcher = DeliverySearcher
    )
    val ingrediente = Repositorio<Ingrediente>(
        searcher = IngredienteSearcher,
    )
    val cupon = Repositorio<Cupon>(
        searcher = CuponSearcher,
    )
}
