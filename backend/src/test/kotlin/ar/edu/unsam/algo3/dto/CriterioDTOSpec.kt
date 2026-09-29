package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class CriterioDTOSpec : DescribeSpec({
    describe("Criterio FIEL recibido desde el front") {
        it("acepta los platos de los locales preferidos que están en el repositorio") {
            val repositorio = LocalRepositorio()
            val local = repositorio.create(Local(nombre = "Taberna de Moe"))
            val criterio = CriterioDTO(
                tipo = TipoCriterioDTO.FIEL,
                localesPreferidos = setOf(local.toCriterioDTO())
            )

            val estrategia = criterio.toUsuarioStrategy(repositorio)

            estrategia.aceptaPlato(Usuario(), Plato(local = local)) shouldBe true
        }
    }
})
