package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point
import java.time.LocalDate

class UsuariosSpec : DescribeSpec({
    describe("Tests Usuarios") {
        it("Agrego ingredientes a favoritos y prohibidos y ambos existen."){
            val usuarioCorrecto = Usuario()
            val preferido = Ingrediente("avena")
            val prohibido = Ingrediente("tomate")
            usuarioCorrecto.agregarPreferido(preferido)
            usuarioCorrecto.agregarProhibido(prohibido)

            usuarioCorrecto.ingredientesPreferidos.contains(preferido) shouldBe true
            usuarioCorrecto.ingredientesProhibidos.contains(prohibido) shouldBe true
        }
        it("Agrego ingredientes prohibidos a preferidos y no me lo permite.") {
            val usuarioCorrecto = Usuario()
            val ingredienteFavorito = Ingrediente("avena")

            usuarioCorrecto.agregarPreferido(ingredienteFavorito)

            val exception = shouldThrow<UsuarioException.IngredientePreferido> {
                usuarioCorrecto.agregarProhibido(ingredienteFavorito)
            }

            exception.message shouldBe "El ingrediente avena está en la lista de preferidos"
        }
        it("Agrego ingredientes preferidos a prohibidos y no me lo permite.") {
            val usuarioCorrecto = Usuario()
            val ingredienteProhibido = Ingrediente("mondongo")

            usuarioCorrecto.agregarProhibido(ingredienteProhibido)

            val exception = shouldThrow<UsuarioException.IngredienteProhibido> {
                usuarioCorrecto.agregarPreferido(ingredienteProhibido)
            }

            exception.message shouldBe "El ingrediente mondongo está en la lista de prohibidos"
        }
        it("Valido la edad del usuario"){
            val usuarioConEdadFija = Usuario(fechaNacimiento = LocalDate.now().minusYears(25))

            usuarioConEdadFija.obtenerEdad() shouldBe 25
        }
    }
    describe("Distintos tipos de Usuario solo aceptan sus preferencias"){
        //Usuario vegano
        it("Usuario vegano acepta plato vegano"){
            val ingredienteVegano = Ingrediente(origenAnimal = false)
            val platoVegano = Plato().apply { agregarIngrediente(ingredienteVegano) }
            val usuarioVegano = Usuario().apply { tipoDeUsuario = UsuarioVeganoStrategy() }
            usuarioVegano.aceptaPlato(platoVegano) shouldBe true
        }
        it("Usuario vegano NO acepta otros tipos de plato"){
            val ingredienteAnimal = Ingrediente(origenAnimal = true)
            val platoNoVegano = Plato().apply { agregarIngrediente(ingredienteAnimal) }
            val usuarioVegano = Usuario().apply { tipoDeUsuario = UsuarioVeganoStrategy() }
            usuarioVegano.aceptaPlato(platoNoVegano) shouldBe false
        }
        //Usuario Exquisito
        it("Usuario exquisito acepta plato de autor"){
            val platoDeAutor = Plato().apply { esdeAutor = true }
            val usuarioExquisito = Usuario().apply { tipoDeUsuario = UsuarioExquisitoStrategy() }
            usuarioExquisito.aceptaPlato(platoDeAutor) shouldBe true
        }
        it("Usuario exquisito NO acepta plato que no es de autor"){
            val platoComun = Plato().apply { esdeAutor = false }
            val usuarioExquisito = Usuario().apply { tipoDeUsuario = UsuarioExquisitoStrategy() }
            usuarioExquisito.aceptaPlato(platoComun) shouldBe false
        }
        //Usuario Conservador
        it("Usuario conservador acepta plato con ingredientes preferidos"){
            val ingredientePreferido = Ingrediente()
            val platoconIngredientePreferido = Plato().apply { agregarIngrediente(ingredientePreferido) }
            val usuarioConservador = Usuario().apply {
                tipoDeUsuario = UsuarioConservadorStrategy()
                agregarPreferido(ingredientePreferido)
            }
            usuarioConservador.aceptaPlato(platoconIngredientePreferido) shouldBe true
        }
        it("Usuario conservador NO acepta plato con ingredientes que no sean preferidos"){
            val ingredientePreferido = Ingrediente(nombre = "Ingrediente Preferido")
            val ingredienteNoPreferido = Ingrediente(nombre = "Ingrediente no Preferido")
            val platoIngredientesNoPreferidos = Plato().apply {
                agregarIngrediente(ingredienteNoPreferido)
                agregarIngrediente(ingredientePreferido)
            }
            val usuarioConservador = Usuario().apply {
                tipoDeUsuario = UsuarioConservadorStrategy()
                agregarPreferido(ingredientePreferido)
            }
            usuarioConservador.aceptaPlato(platoIngredientesNoPreferidos) shouldBe false
        }
        //Usuario Fiel
        it("Usuario Fiel acepta plato de su local preferido"){
            val localPreferido = Local()
            val platoDeLocalPreferido = Plato().apply { local = localPreferido }
            val usuarioFiel = Usuario().apply {
                tipoDeUsuario = UsuarioFielStrategy().apply {
                 agregarLocalPreferido(localPreferido)
                }
            }
            usuarioFiel.aceptaPlato(platoDeLocalPreferido) shouldBe true
        }
        it("Usuario Fiel NO acepta plato que no sea de su local preferido"){
            val localPreferido = Local(nombre = "Local Preferido")
            val localNoPreferido = Local(nombre = "Local No Preferido")
            val platoDeLocalNoPreferido = Plato().apply { local = localNoPreferido }
            val usuarioFiel = Usuario().apply {
                tipoDeUsuario = UsuarioFielStrategy().apply {
                 agregarLocalPreferido(localPreferido)
                }
            }
            usuarioFiel.aceptaPlato(platoDeLocalNoPreferido) shouldBe false
        }
        //Usuario Marketing
        it("Usuario Marketing acepta platos con cierta descripción"){
            val platoMarketineroOrganico = Plato(descripcion = "Plato con verduras organicas")
            val platoMarketineroDietetico = Plato(descripcion = "Nuevos alfajores dieteticos")
            val platoMarketineroNutritivo = Plato(descripcion = "Super combo nutritivo")
            val usuarioMarketinero = Usuario().apply {
                tipoDeUsuario = UsuarioMarketingStrategy().apply{
                    agregarTexto("nutritivo")
                    agregarTexto("dieteticos")
                    agregarTexto("organicas")

                }
            }
            usuarioMarketinero.aceptaPlato(platoMarketineroOrganico) shouldBe true
            usuarioMarketinero.aceptaPlato(platoMarketineroDietetico) shouldBe true
            usuarioMarketinero.aceptaPlato(platoMarketineroNutritivo) shouldBe true
        }
        it("Usuario Marketing No acepta platos sin la descripción adecuada"){
            val platoSinMarketing = Plato(descripcion = "Descripción sin palabra clave")
            val usuarioMarketinero = Usuario().apply { tipoDeUsuario = UsuarioMarketingStrategy()}
            usuarioMarketinero.aceptaPlato(platoSinMarketing) shouldBe false
        }
        //Usuario Impaciente
        it("Usuario Impaciente acepta plato de local cercano"){
            //Local en el Obelisco
            val localCercano = Local(direccion = Direccion(ubicacion = Point(-34.6037,-58.3816)))
            val platoLocalCercano = Plato().apply { local = localCercano }
            //Usuario en el Planetario
            val usuarioImpaciente = Usuario().apply {
                tipoDeUsuario = UsuarioImpacienteStrategy()
                direccion = Direccion(ubicacion = Point(-34.5687,-58.4117))
                distanciaMaximaCercana = 10.0
            }
            usuarioImpaciente.aceptaPlato(platoLocalCercano) shouldBe true
        }
        it("Usuario Impaciente No acepta plato de local lejano") {
            //Local en el Obelisco
            val localLejano = Local(direccion = Direccion(ubicacion = Point(-34.6037, -58.3816)))
            val platoLocalLejano = Plato().apply { local = localLejano }
            //Usuario en la UNSAM
            val usuarioImpaciente = Usuario().apply {
                tipoDeUsuario = UsuarioImpacienteStrategy()
                direccion = Direccion(ubicacion = Point(-34.5432, -58.7126))
                distanciaMaximaCercana = 10.0
            }
            usuarioImpaciente.aceptaPlato(platoLocalLejano) shouldBe false
        }

        //Usuario General
        it("Usuario General acepta plato de caracteristicas basicas"){
            val platoAceptable = Plato()
            val usuarioConformista = Usuario().apply { tipoDeUsuario = UsuarioGeneralStrategy() }
            usuarioConformista.aceptaPlato(platoAceptable) shouldBe true
        }
        it("Usuario General NO acepta plato por ingrediente prohibido"){
            val usuarioConformista = Usuario().apply { tipoDeUsuario = UsuarioGeneralStrategy() }
            val cebolla = Ingrediente("Cebolla")
            val platoNoAceptable = Plato().apply { agregarIngrediente(cebolla) }
            usuarioConformista.agregarProhibido(cebolla)
            shouldThrow<UsuarioException.generalException>{usuarioConformista.aceptaPlato(platoNoAceptable)}
        }

        //Usuario Combinado
        it("Usuario acepta platos veganos y de su local preferido"){
            val ingredienteVegano = Ingrediente(origenAnimal = false)
            val localPreferido = Local()

            val platoCombinado = Plato().apply {
                agregarIngrediente(ingredienteVegano)
                local = localPreferido
            }
            val requisitos = mutableSetOf(UsuarioVeganoStrategy(), UsuarioFielStrategy().apply{agregarLocalPreferido(localPreferido)})
            val usuarioCombinado = Usuario().apply { tipoDeUsuario = UsuarioCombinadoStrategy(requisitos) }

            usuarioCombinado.aceptaPlato(platoCombinado) shouldBe true
        }

        it("Usuario NO acepta plato porque no es vegano o de su local preferido"){
            val ingredienteNoVegano = Ingrediente(origenAnimal = true)
            val localPreferido = Local()
            val localNoPreferido = Local()

            val platoCombinado = Plato().apply {
                agregarIngrediente(ingredienteNoVegano)
                local = localNoPreferido
            }

            val requisitos = mutableSetOf(UsuarioVeganoStrategy(), UsuarioFielStrategy().apply { agregarLocalPreferido(localPreferido) })
            val usuarioCombinado = Usuario().apply { tipoDeUsuario = UsuarioCombinadoStrategy(requisitos) }

            usuarioCombinado.aceptaPlato(platoCombinado) shouldBe false
        }
        it("Usuario de 20 años acepta platos de autor"){
            val usuarioEdadPar = Usuario().apply {
                tipoDeUsuario = UsuarioCambianteDeEdadStrategy()
                fechaNacimiento = LocalDate.now().minusYears(20)
            }
            val platoExquisito = Plato().apply { esdeAutor = true }
            usuarioEdadPar.aceptaPlato(platoExquisito) shouldBe true
        }
        it("Usuario de 21 años acepta platos con ingredientes preferidos"){
            val tomate = Ingrediente("Tomate")
            val usuarioEdadImpar = Usuario().apply {
                tipoDeUsuario = UsuarioCambianteDeEdadStrategy()
                fechaNacimiento = LocalDate.now().minusYears(21)
            }
            val platoConservador = Plato().apply { agregarIngrediente(tomate)}
            usuarioEdadImpar.agregarPreferido(tomate)
            usuarioEdadImpar.aceptaPlato(platoConservador) shouldBe true
        }
    }

    //Solo probamos dos usuarios, uno que acepta y uno que rechaza.
    //Como sólo iteramos aceptaPlato() en aceptaPedido(), se cubrieron los demás casos en las pruebas de ese métod.
    describe("Usuario acepta o rechaza distintos tipos de pedidos"){
        it("Usuario vegano no acepta un pedido con un plato no vegano"){
            val ingredienteVegano = Ingrediente(origenAnimal = false)
            val ingredienteNoVegano = Ingrediente(origenAnimal = true)
            val localNoVegano = Local()
            val platoNoVegano = Plato(local = localNoVegano).apply { agregarIngrediente(ingredienteVegano) }
            platoNoVegano.agregarIngrediente(ingredienteNoVegano)

            val pedidoNoVegano = Pedido(local = localNoVegano).apply { agregarPlatoAlPedido(platoNoVegano) }
            val usuarioVegano = Usuario().apply { tipoDeUsuario = UsuarioVeganoStrategy() }

            pedidoNoVegano.esAptoPreferenciaCliente(usuarioVegano) shouldBe false
        }
        it("Usuario conservador acepta pedido con un plato de sus ingredientes preferidos"){
            val ingredientePreferido1 = Ingrediente()
            val ingredientePreferido2 = Ingrediente()
            val localPreferido = Local()
            val platoconIngredientePreferido = Plato(local = localPreferido).apply { agregarIngrediente(ingredientePreferido1) }
            platoconIngredientePreferido.agregarIngrediente(ingredientePreferido2)
            val pedidoConIngredientesPreferidos = Pedido(local = localPreferido).apply {agregarPlatoAlPedido(platoconIngredientePreferido)}
            val usuarioConservador = Usuario().apply {
                tipoDeUsuario = UsuarioConservadorStrategy()
                agregarPreferido(ingredientePreferido1)
                agregarPreferido(ingredientePreferido2)
            }

            pedidoConIngredientesPreferidos.esAptoPreferenciaCliente(usuarioConservador) shouldBe true
        }
    }
})