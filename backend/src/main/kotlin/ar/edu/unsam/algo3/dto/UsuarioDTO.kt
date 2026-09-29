package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import ar.edu.unsam.algo3.repositorios.LocalRepositorio

data class UsuarioDTO (
    var id: Int,
    var nombre: String,
    var apellido: String,
    var mail: String,
    var direccion: DireccionDTO,
    var distanciaMaximaCercana: Double,
    var criterio: CriterioDTO,
    var ingredientesPreferidos: MutableSet<IngredienteUsuarioDTO>,
    var ingredientesEvitar: MutableSet<IngredienteUsuarioDTO>
)

fun Usuario.toDTO() = UsuarioDTO(
    id=id!!,
    nombre=nombre,
    apellido=apellido,
    mail=mail,
    direccion=direccion.toDTO(),
    distanciaMaximaCercana=distanciaMaximaCercana,
    criterio=tipoDeUsuario.toCriterioDTO(),
    ingredientesPreferidos=this.ingredientesPreferidos.map { it.toUsuarioIngredienteDTO() }.toMutableSet(),
    ingredientesEvitar=this.ingredientesProhibidos.map { it.toUsuarioIngredienteDTO() }.toMutableSet()
)

fun UsuarioDTO.toDomain(ingredienteRepo: IngredienteRepositorio, localRepo: LocalRepositorio): Usuario {
    return Usuario(
        nombre = this.nombre,
        apellido=apellido,
        mail=mail,
        direccion=direccion.toDomain(),
        distanciaMaximaCercana=distanciaMaximaCercana,
        tipoDeUsuario =this.criterio.toUsuarioStrategy(localRepo),
    ).apply{
        this.id = this@toDomain.id
        this@toDomain.ingredientesPreferidos.forEach { ingDTO ->
            val ing = ingredienteRepo.getById(ingDTO.id)
            this.agregarPreferido(ing)
        }
        this@toDomain.ingredientesEvitar.forEach { ingDTO ->
            val ing = ingredienteRepo.getById(ingDTO.id)
            this.agregarProhibido(ing)
        }
    }
}