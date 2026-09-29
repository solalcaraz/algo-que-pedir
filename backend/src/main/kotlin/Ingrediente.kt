package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.TipoRepositorio
import com.fasterxml.jackson.annotation.JsonProperty


enum class EnumGrupoAlimenticio {
    CEREALES_Y_TUBERCULOS,
    AZUCARES_Y_DULCES,
    LACTEOS,
    FRUTAS_Y_VERDURAS,
    GRASAS_Y_ACEITES,
    PROTEINAS
}

data class Ingrediente(
    @JsonProperty("nombre") var nombre: String = "",
    @JsonProperty("costoMercado") var costoMercado: Double = 0.0,
    @JsonProperty("grupoAlimenticio") var grupoAlimenticio: EnumGrupoAlimenticio = EnumGrupoAlimenticio.CEREALES_Y_TUBERCULOS,
    @JsonProperty("origenAnimal") var origenAnimal: Boolean = false
) : TipoRepositorio() {

    fun validar(){
        if (nombre.trim().isEmpty()) throw ErrorException.BusinessException("El nombre del ingrediente no puede estar vacio.")
        if (costoMercado <= 0) throw ErrorException.BusinessException("El costo de mercado debe ser un valor positivo.")
    }

    fun actualizar(otroIngrediente: Ingrediente) {
        nombre = otroIngrediente.nombre
        costoMercado = otroIngrediente.costoMercado
        grupoAlimenticio = otroIngrediente.grupoAlimenticio
        origenAnimal = otroIngrediente.origenAnimal
    }
}



