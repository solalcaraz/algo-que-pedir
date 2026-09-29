package ar.edu.unsam.algo3

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.doubles.plusOrMinus
import io.kotest.matchers.shouldBe
import java.time.LocalDate

class PlatosSpec : DescribeSpec({
  describe("Tests plato"){
      describe("Agrego y quito ingredientes"){
          it("agrego ingrediente a un plato"){
              // Arrange
              val ingrediente = Ingrediente(costoMercado = 0.0, grupoAlimenticio = EnumGrupoAlimenticio.CEREALES_Y_TUBERCULOS, origenAnimal = false)
              val plato = Plato()
              // Act
              plato.agregarIngrediente(ingrediente)
              // Assert
              plato.tieneIngrediente(ingrediente) shouldBe true
          }
          it("Elimino Ingrediente"){
              //Arrange
              val ingredientePermanente = Ingrediente(costoMercado =  3000.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = true)
              val ingredienteARemover = Ingrediente(costoMercado = 7000.0, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)

              val platoPrincipal = Plato()

              //Act
              platoPrincipal.agregarIngrediente(ingredientePermanente)
              platoPrincipal.agregarIngrediente(ingredienteARemover)

              //Assert
              platoPrincipal.tieneIngrediente(ingredienteARemover) shouldBe true
              platoPrincipal.removerIngrediente(ingredienteARemover)
              platoPrincipal.tieneIngrediente(ingredienteARemover) shouldBe false
          }

          it("Que el plato no tenga ingredientes duplicados"){
              //Arrange
              val ingredienteUnico = Ingrediente(costoMercado = 50.0,grupoAlimenticio =  EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS,origenAnimal = false)
              val ingredienteDuplicado = Ingrediente (costoMercado = 40.0,grupoAlimenticio =  EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS,origenAnimal = false)

              val platoSinDuplicados = Plato()

              //Act
              platoSinDuplicados.agregarIngrediente(ingredienteUnico)
              platoSinDuplicados.agregarIngrediente(ingredienteDuplicado)
              platoSinDuplicados.agregarIngrediente(ingredienteDuplicado)

              //Assert
              platoSinDuplicados.listaDeIngredientes.count{it == ingredienteDuplicado} shouldBe 1
          }

      }
      describe("Calcular costo"){
          it("El costo de producción del plato es igual a la sumatoria del costo de sus ingredientes"){
              //Arrange
              val ingrediente1 = Ingrediente(costoMercado = 10.0,grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)
              val ingrediente2 = Ingrediente(costoMercado = 30.0,grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)

              val platoConDosIngredientes = Plato()
              //Act
              platoConDosIngredientes.agregarIngrediente(ingrediente1)
              platoConDosIngredientes.agregarIngrediente(ingrediente2)
              //Assert
              platoConDosIngredientes.costoDeProduccion() shouldBe ingrediente1.costoMercado + ingrediente2.costoMercado
          }
          it("Costo total plato de autor (precio base + costo produccion + regalias + porcentaje plataforma"){
              //Arrange
              val localConRegalias = Local().apply {
                  porcentajeRegaliasDeAutor = 0.03
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoDeAutor = Plato().apply {
                  local = localConRegalias
                  esdeAutor = true
                  valorBase = 100.0
              }
              val ingredientePlatoAutor = Ingrediente(costoMercado = 50.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = false)
              //Act
              platoDeAutor.agregarIngrediente(ingredientePlatoAutor)
              //Assert
              platoDeAutor.valorTotal() shouldBe 156.5
          }
          it("Costo total plato comun (costo produccion + porcentaje plataforma"){
              //Arrange
              val localConRegalias = Local().apply {
                  porcentajeRegaliasDeAutor = 0.03
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoComun = Plato().apply{
                  local = localConRegalias
                  valorBase = 100.0
              }
              val ingredientePlatoComun = Ingrediente(costoMercado = 50.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = false)
              //Act
              platoComun.agregarIngrediente(ingredientePlatoComun)
              //Assert
              platoComun.valorTotal() shouldBe 155.0
          }
      }
      describe("Calcular precio de venta"){
          it("Precio plato de autor nuevo"){
              //Arrange
              val localConRegalias = Local().apply {
                  porcentajeRegaliasDeAutor = 0.03
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoDeAutor = Plato().apply {
                  local = localConRegalias
                  fechaLanzamiento = LocalDate.now().minusDays(20)
                  esdeAutor = true
                  valorBase = 100.0
              }
              val ingredientePlatoAutor = Ingrediente(costoMercado = 50.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = false)
              //Act
              platoDeAutor.agregarIngrediente(ingredientePlatoAutor)
              //Assert
              platoDeAutor.valorDeVenta() shouldBe 140.8.plusOrMinus(0.05)
          }
          it("Precio plato de autor viejo con descuento"){
              //Arrange
              val local = Local().apply {
                  porcentajeRegaliasDeAutor = 0.03
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoDeAutor = Plato(local = local).apply {
                  fechaLanzamiento = LocalDate.now().minusDays(32)
                  porcentajeDescuento = 0.15
                  esdeAutor = true
                  valorBase = 100.0
              }
              val ingredientePlatoAutor = Ingrediente(costoMercado = 50.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = false)
              //Act
              platoDeAutor.agregarIngrediente(ingredientePlatoAutor)
              //Assert
              platoDeAutor.valorDeVenta() shouldBe 133.0.plusOrMinus(0.05)
          }
          it("Precio plato comun nuevo") {
              // Arrange
              val local = Local().apply {
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoComun = Plato(local = local).apply {
                  fechaLanzamiento = LocalDate.now().minusDays(10)
                  valorBase = 100.0
              }
              val ingrediente = Ingrediente(costoMercado = 40.0, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)
              // Act
              platoComun.agregarIngrediente(ingrediente)
              // Assert
              platoComun.valorDeVenta() shouldBe 115.2
          }
          it("Precio plato comun viejo") {
              // Arrange
              val local = Local().apply {
                  porcentajeSobreCadaPlato = 0.10
              }
              val platoComun = Plato(local = local).apply {
                  fechaLanzamiento = LocalDate.now().minusDays(40)
                  porcentajeDescuento = 0.20
                  valorBase = 100.0
              }
              val ingrediente = Ingrediente(costoMercado = 40.0, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)
              // Act
              platoComun.agregarIngrediente(ingrediente)
              // Assert
              platoComun.valorDeVenta() shouldBe 115.2
          }
      }
      describe("Propiedades del plato"){
          it("un plato es vegano"){
              //Arrange
              val ingredienteVegano1 = Ingrediente (costoMercado = 100.0, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, origenAnimal = false)
              val ingredienteVegano2 = Ingrediente (costoMercado = 100.0, grupoAlimenticio = EnumGrupoAlimenticio.CEREALES_Y_TUBERCULOS, origenAnimal = false)

              val platoVegano = Plato ()
              //Act
              platoVegano.agregarIngrediente(ingredienteVegano1)
              platoVegano.agregarIngrediente(ingredienteVegano2)
              //Assert
              platoVegano.esVegano() shouldBe true
          }
          it("un plato NO es vegano"){
              //Arrange
              val ingredienteOrigenAnimal1 = Ingrediente (costoMercado = 100.0, grupoAlimenticio = EnumGrupoAlimenticio.LACTEOS, origenAnimal = true)
              val ingredienteOrigenAnimal2 = Ingrediente (costoMercado = 100.0, grupoAlimenticio = EnumGrupoAlimenticio.PROTEINAS, origenAnimal = true)

              val platoNoVegano = Plato ()
              //Act
              platoNoVegano.agregarIngrediente(ingredienteOrigenAnimal1)
              platoNoVegano.agregarIngrediente(ingredienteOrigenAnimal2)
              //Assert
              platoNoVegano.esVegano() shouldBe false
          }
          it("Un plato es nuevo"){
              //Arrange
              val platoNuevo = Plato ().apply {
                  fechaLanzamiento = LocalDate.now().minusDays(30)
              }
              //Assert
              platoNuevo.esNuevo() shouldBe true
          }
      }
  }
})

