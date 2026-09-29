package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.Repositorios
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe

class RepositorioSpec: DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    val repositorioUsuario = Repositorios.usuario
    val repositorioLocal = Repositorios.local
    val repositorioIngrediente = Repositorios.ingrediente
    val repositorioDelivery = Repositorios.delivery
    val repositorioPlato = Repositorios.plato
    val repositorioCupon = Repositorios.cupon

    describe("metodos compartidos del Repositorio") {

        val usuarioNuevo = Usuario()

        beforeEach {
            repositorioUsuario.clearInit()
            repositorioUsuario.create(usuarioNuevo)
        }

        it("Crear nuevo objeto en el repositorio") {
            repositorioUsuario.findAll().shouldContain(usuarioNuevo)
        }

        it("Un repo no permite crear dos veces el mismo objeto"){
            shouldThrow<IllegalArgumentException> {
                repositorioUsuario.create(usuarioNuevo)
            }
        }

        it("Eliminar un objeto del repositorio"){
            repositorioUsuario.delete(usuarioNuevo)
            repositorioUsuario.findAll().shouldNotContain(usuarioNuevo)
        }

        it("Actualizar un objeto del repositorio") {
            usuarioNuevo.nombre = "Actualizado"
            repositorioUsuario.update(usuarioNuevo)

            val usuarioNuevoEnMemoria = repositorioUsuario.getById(usuarioNuevo.id!!)
            usuarioNuevoEnMemoria.nombre shouldBe "Actualizado"
        }

        it("Encontrar objeto por su id"){
            val usuarioEncontrado = repositorioUsuario.getById(usuarioNuevo.id!!)
            usuarioEncontrado shouldBe usuarioNuevo
        }

    }

    describe("metodo search"){
        it("search Usuario"){
            val usuarioABuscar = Usuario().apply {
                nombre = "BuscarPorNombre"
                apellido = "BuscarPorApellido"
                usuario = "BuscarPorUsername"
            }

            repositorioUsuario.create(usuarioABuscar)

            repositorioUsuario.search("nombre") shouldContain usuarioABuscar
            repositorioUsuario.search("apellido") shouldContain usuarioABuscar
            repositorioUsuario.search("BuscarPorUsername") shouldContain usuarioABuscar
        }
        it("search Local"){
            val localABuscar = Local(
                direccion = Direccion(
                    calle = "BuscarPorCalle"
                ),
                nombre = "BuscarPorNombre"
            )

            repositorioLocal.create(localABuscar)

            repositorioLocal.search("nombre") shouldContain localABuscar
            repositorioLocal.search("BuscarPorCalle") shouldContain localABuscar
        }
        it("search Delivery"){
            val deliveryABuscar = Delivery().apply {
                username = "BuscarPorUsername"
            }

            repositorioDelivery.create(deliveryABuscar)

            repositorioDelivery.search("BuscarPor") shouldContain deliveryABuscar
        }
        it("search Ingrediente"){
            val ingredienteABuscar = Ingrediente(nombre = "BuscarPorNombre")

            repositorioIngrediente.create(ingredienteABuscar)

            repositorioIngrediente.search("BuscarPorNombre") shouldContain ingredienteABuscar
        }
        it("search Plato"){
            val platoABuscar = Plato().apply {
                descripcion = "BuscarPorDescripcion"
                nombre = "BuscarPorNombre"
                local = Local(
                    nombre = "BuscarPorNombreLocal",
                    direccion = Direccion(calle = "BuscarPorCalle")
                )
            }

            repositorioPlato.create(platoABuscar)

            repositorioPlato.search("descripcion") shouldContain platoABuscar
            repositorioPlato.search("nombre") shouldContain platoABuscar
            repositorioPlato.search("nombrelocal")shouldContain platoABuscar
            repositorioPlato.search("BuscarPorCalle") shouldContain platoABuscar
        }
        it("search Cupon"){
            val cuponABuscar = CuponLocal(0.7, mutableSetOf<Local>())
            repositorioCupon.create(cuponABuscar)
            repositorioCupon.search("0.7") shouldContain cuponABuscar

        }
    }
})