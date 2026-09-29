package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.IngredienteSearcher
import ar.edu.unsam.algo3.repositorios.Repositorio
import ar.edu.unsam.algo3.servicios.IExternalService
import ar.edu.unsam.algo3.servicios.IServiceIngredientes
import ar.edu.unsam.algo3.servicios.IngredientesAdapter
import ar.edu.unsam.algo3.servicios.ServicioRepositorios
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.mockk.every
import io.mockk.mockk
import java.io.File

class ServicioIngredientesSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Servicios de Ingredientes") {

        val mockRepositorioIngrediente = mockRepositorio()
        val mockServiceIngrediente = mockService()
        val servicio = ServicioRepositorios<Ingrediente>(service = mockServiceIngrediente, repositorio = mockRepositorioIngrediente, clazz = Ingrediente::class.java)

        servicio.actualizarRepositorio()

        it("Crear nuevos ingredientes a partir de un servicio externo") {

            val ingredientesCreadoSinId = mockRepositorioIngrediente.getById(4)
            ingredientesCreadoSinId shouldNotBe null
            ingredientesCreadoSinId.nombre shouldBe "Arroz"

            val ingredienteCreadoSinId2 = mockRepositorioIngrediente.getById(5)
            ingredienteCreadoSinId2 shouldNotBe null
            ingredienteCreadoSinId2.nombre shouldBe "Pollo"
        }

        it("Actualiza un ingrediente existente en el repositorio") {

            mockRepositorioIngrediente.getById(1).nombre shouldBe "Leche"
            mockRepositorioIngrediente.getById(2).nombre shouldBe "Manzana"
            mockRepositorioIngrediente.getById(3).nombre shouldBe "Azúcar"
        }
    }
})

fun mockService(): IngredientesAdapter {
    val listaIngredientesJson = File("src/test/resources/ListaIngredientesServicio.json").readText()
    val mockService = mockk<IngredientesAdapter>()
    every { mockService.get() } returns listaIngredientesJson
    return mockService
}

fun mockRepositorio(): Repositorio<Ingrediente> {
    val repositorio = Repositorio<Ingrediente>(IngredienteSearcher)

    val ingredienteId1 = Ingrediente(nombre = "Ingrediente id 1")
    val ingredienteId2 = Ingrediente(nombre = "Ingrediente id 2")
    val ingredienteId3 = Ingrediente(nombre = "Ingrediente id 3")

    repositorio.create(ingredienteId1)
    repositorio.create(ingredienteId2)
    repositorio.create(ingredienteId3)
    return repositorio
}