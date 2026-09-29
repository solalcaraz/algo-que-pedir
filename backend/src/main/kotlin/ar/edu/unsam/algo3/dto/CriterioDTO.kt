package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.UsuarioCombinadoStrategy
import ar.edu.unsam.algo3.UsuarioConservadorStrategy
import ar.edu.unsam.algo3.UsuarioExquisitoStrategy
import ar.edu.unsam.algo3.UsuarioFielStrategy
import ar.edu.unsam.algo3.UsuarioGeneralStrategy
import ar.edu.unsam.algo3.UsuarioImpacienteStrategy
import ar.edu.unsam.algo3.UsuarioMarketingStrategy
import ar.edu.unsam.algo3.UsuarioStrategy
import ar.edu.unsam.algo3.UsuarioVeganoStrategy
import ar.edu.unsam.algo3.repositorios.LocalRepositorio

data class CriterioDTO(
    val tipo: TipoCriterioDTO,
    val localesPreferidos: Set<LocalCriterioDTO>? = null,
    val palabrasClave: Set<String>? = null,
    val subCriterios: Set<CriterioDTO>? = null
)
enum class TipoCriterioDTO {
    COMBINADO,
    VEGANO,
    EXQUISITO,
    CONSERVADOR,
    FIEL,
    MARKETING,
    IMPACIENTE,
    GENERAL
}

fun UsuarioStrategy.toCriterioDTO(): CriterioDTO {
    return when (this) {
        is UsuarioCombinadoStrategy -> CriterioDTO(
            tipo = TipoCriterioDTO.COMBINADO,
            subCriterios = this.requisitosParticulares.map { it.toCriterioDTO() }.toSet()
        )
        is UsuarioVeganoStrategy -> CriterioDTO( tipo = TipoCriterioDTO.VEGANO)
        is UsuarioExquisitoStrategy -> CriterioDTO( tipo = TipoCriterioDTO.EXQUISITO)
        is UsuarioConservadorStrategy -> CriterioDTO( tipo = TipoCriterioDTO.CONSERVADOR)
        is UsuarioFielStrategy -> CriterioDTO(
            tipo = TipoCriterioDTO.FIEL,
            localesPreferidos = this.localesPreferidos.mapNotNull { it.toCriterioDTO() }.toSet()
        )
        is UsuarioMarketingStrategy -> CriterioDTO(
            tipo = TipoCriterioDTO.MARKETING,
            palabrasClave = this.textoLlamativo.toSet()
        )
        is UsuarioImpacienteStrategy -> CriterioDTO( tipo = TipoCriterioDTO.IMPACIENTE )
        is UsuarioGeneralStrategy -> CriterioDTO( tipo = TipoCriterioDTO.GENERAL)
        else -> throw IllegalArgumentException("Tipo de criterio desconocido.")
    }
}
fun CriterioDTO.toUsuarioStrategy(localRepo: LocalRepositorio): UsuarioStrategy {
    return when (this.tipo) {
        TipoCriterioDTO.COMBINADO -> {
            val subStrategies = this.subCriterios?.map { it.toUsuarioStrategy(localRepo) }?.toMutableSet()
                ?: mutableSetOf()
            UsuarioCombinadoStrategy(subStrategies)
        }

        TipoCriterioDTO.FIEL -> {
            UsuarioFielStrategy().apply {
                this@toUsuarioStrategy.localesPreferidos?.forEach { localDTO ->
                    val local = localRepo.getById(localDTO.idLocal).toCriterioDTO()
                    agregarLocalPreferido(local.toDomain())
                }
            }
        }
        TipoCriterioDTO.MARKETING -> {
            UsuarioMarketingStrategy().apply {
                this@toUsuarioStrategy.palabrasClave?.forEach { palabra ->
                    agregarTexto(palabra)
                }
            }
        }
        TipoCriterioDTO.GENERAL -> UsuarioGeneralStrategy()
        TipoCriterioDTO.VEGANO -> UsuarioVeganoStrategy()
        TipoCriterioDTO.EXQUISITO -> UsuarioExquisitoStrategy()
        TipoCriterioDTO.CONSERVADOR -> UsuarioConservadorStrategy()
        TipoCriterioDTO.IMPACIENTE -> UsuarioImpacienteStrategy()
    }
}