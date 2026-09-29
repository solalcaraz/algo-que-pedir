package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.EnumGrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente

data class IngredienteDTO(
    var id: Int,
    var nombre: String,
    var costoMercado: Double,
    var grupoAlimenticio: EnumGrupoAlimenticio,
    var origenAnimal: Boolean
)

fun Ingrediente.toDTO(): IngredienteDTO = IngredienteDTO(
    id=id!!,
    nombre=nombre,
    costoMercado=costoMercado,
    grupoAlimenticio=grupoAlimenticio,
    origenAnimal=origenAnimal
)