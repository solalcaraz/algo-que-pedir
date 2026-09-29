package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.repositorios.IngredienteRepositorio
import ar.edu.unsam.algo3.repositorios.LocalRepositorio
import ar.edu.unsam.algo3.repositorios.PlatoRepositorio
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class PlatoServiceSpec : DescribeSpec({
    describe("Actualización de un plato") {
        it("el dueño del plato lo puede editar aunque el id del local sea mayor a 127") {
            val localRepositorio = LocalRepositorio().apply { idActual = 199 }
            val platoRepositorio = PlatoRepositorio()
            val servicio = PlatoService(platoRepositorio, localRepositorio, IngredienteRepositorio())
            val local = localRepositorio.create(Local(nombre = "Taberna de Moe"))
            val plato = platoRepositorio.create(Plato(local = local, valorBase = 100.0))
            val cambios = Plato(nombre = "Plato editado", valorBase = 150.0).apply { id = plato.id }

            servicio.update(plato.id!!, cambios, local.id!!)

            platoRepositorio.getById(plato.id!!).nombre shouldBe "Plato editado"
        }
    }
})
