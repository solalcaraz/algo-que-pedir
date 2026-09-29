package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point
import java.time.LocalDate
import java.time.LocalTime

class PedidoSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Tests pedidos") {
        //Clientes: OK
        val clienteVeganoSinAntiguedad = Usuario(tipoDeUsuario = UsuarioVeganoStrategy(), fechaCreacionCuenta = LocalDate.now())
        val clienteMarketineroConAntiguedad = Usuario(tipoDeUsuario = UsuarioMarketingStrategy().apply{agregarTexto("nutritivo")}, fechaCreacionCuenta = LocalDate.now().minusYears(1).minusDays(1))
        val clienteImpaciente = Usuario(tipoDeUsuario = UsuarioImpacienteStrategy(), direccion = Direccion(ubicacion = Point(20.0, 50.0), calle = "Calle falsa", altura = 1234), distanciaMaximaCercana = 8000.0) //Agrego Direccion y distanciaMaximaCercana

        //Ingredientes: OK
        val soja = Ingrediente(nombre = "Soja", origenAnimal = false, grupoAlimenticio = EnumGrupoAlimenticio.PROTEINAS, costoMercado = 5000.0)
        val ajo = Ingrediente(nombre = "Ajo", origenAnimal = false, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, costoMercado = 800.0)
        val pollo = Ingrediente(nombre = "Pollo", origenAnimal = true, grupoAlimenticio = EnumGrupoAlimenticio.PROTEINAS, costoMercado = 6000.0)
        val lechuga = Ingrediente(nombre = "Lechuga", origenAnimal = false, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, costoMercado = 3000.0)
        val lomo = Ingrediente(nombre = "Lomo", origenAnimal = true, grupoAlimenticio = EnumGrupoAlimenticio.PROTEINAS, costoMercado = 20000.0)
        val champignon = Ingrediente(nombre = "Champignon", origenAnimal = false, grupoAlimenticio = EnumGrupoAlimenticio.FRUTAS_Y_VERDURAS, costoMercado = 5000.0)
        val papa = Ingrediente(nombre= "Papa", origenAnimal = false, grupoAlimenticio = EnumGrupoAlimenticio.CEREALES_Y_TUBERCULOS, costoMercado = 3000.0)
        val huevo = Ingrediente(nombre = "Huevo", origenAnimal = true, grupoAlimenticio = EnumGrupoAlimenticio.PROTEINAS, costoMercado = 3000.0)

        //Locales: OK, agrego platos al final
        val localVeganoNoConfiable = Local(nombre = "Local Vegano", porcentajeSobreCadaPlato = 5.0)  //para pedido NO certificado + delivery local
            .apply{
                agregarMedioDePago(MedioDePago.EFECTIVO)
                agregarMedioDePago(MedioDePago.QR)
                puntuar(2.0)
            }
        val localNutritivoConfiable = Local(nombre = "Local Nutritivo", porcentajeSobreCadaPlato = 5.0) //para pedido certificado
            .apply{
                agregarMedioDePago(MedioDePago.EFECTIVO)
                agregarMedioDePago(MedioDePago.QR)
                puntuar(4.0)
            }
       val localBodegon = Local(nombre = "Bodegon", porcentajeSobreCadaPlato = 5.0, porcentajeRegaliasDeAutor = 15.0, direccion = Direccion(calle = "Calle falsa", altura = 1500, ubicacion = Point(20, 30)))    //para cliente Fiel e Impaciente
            .apply{
                agregarMedioDePago(MedioDePago.EFECTIVO)
                agregarMedioDePago(MedioDePago.TARJETA)
                puntuar(5.0)
            }

        //Platos: OK
        val platoVegano = Plato(nombre = "Milanesa de soja", local = localVeganoNoConfiable, valorBase = 1000.0)
            .apply{
                agregarIngrediente(soja)
                agregarIngrediente(ajo)
            }
        val platoNutritivo = Plato(nombre = "Ensalada cesar", local = localNutritivoConfiable, descripcion = "plato nutritivo y bajo en sodio", valorBase = 3000.0)     //apto cliente marketinero y conservador
            .apply{
                agregarIngrediente(lechuga)
                agregarIngrediente(pollo)
            }
        val platoAutor = Plato(nombre = "Lomo Wellington", local = localBodegon, esdeAutor = true, valorBase = 20000.0)   //para clienteExquisito
            .apply{
                agregarIngrediente(lomo)
                agregarIngrediente(champignon)
            }
        val platoBodegon = Plato(nombre = "Tortilla de papa", local = localBodegon, valorBase = 1000.0)   //para clienteFiel
            .apply{
                agregarIngrediente(papa)
                agregarIngrediente(huevo)
            }

        //Delivery: OK
        val deliveryCertificado = Delivery(nombre = "Juan", tipoDeDelivery = DeliveryEsCertificado) //combinacion apta: cliente marketinero + plato nutritivo
        val deliveryCaro = Delivery(nombre = "Francisco", tipoDeDelivery = DeliveryCobraCaro)      //combinacion apta: cliente exquisito + plato autor
        val deliveryLocal = Delivery(nombre = "Pepe", tipoDeDelivery = DeliverySegunLocal(localesDeTrabajo = mutableSetOf(localVeganoNoConfiable, localBodegon, localNutritivoConfiable))) //combinacion apta: trabaja con localVegano y Nutritivo
        val deliverySeguro = Delivery(nombre = "Tomas", tipoDeDelivery = DeliveryHorarioSeguro(horarioSeguro= Pair(LocalTime.of(9, 0), LocalTime.of(20, 0)))) //combinacion: pedido de localBodegon(clienteFiel) coincidira con su horario pero el pedido de localFifi (conservador) no

       //Pedidos: una vez que los instancio deberia cambiar el estado a PREPARADO
        val pedidoVegano = Pedido(cliente = clienteVeganoSinAntiguedad, local = localVeganoNoConfiable, delivery = deliveryLocal, medioDePago = MedioDePago.EFECTIVO).apply{
            agregarPlatoAlPedido(platoVegano)
            cambiaDeEstado(EnumEstadosPedido.PREPARADO)
        }
        val pedidoNutritivo = Pedido(cliente = clienteMarketineroConAntiguedad, local = localNutritivoConfiable, delivery = deliveryCertificado, medioDePago = MedioDePago.QR, horarioPedido = LocalTime.of(23,25)).apply{
            agregarPlatoAlPedido(platoNutritivo)
            cambiaDeEstado(EnumEstadosPedido.PREPARADO)
        }
        val pedidoImpaciente = Pedido(cliente = clienteImpaciente, local = localBodegon, delivery = deliveryLocal, medioDePago = MedioDePago.TARJETA, horarioPedido = LocalTime.of(13,12)).apply{
            agregarPlatoAlPedido(platoBodegon)
            agregarPlatoAlPedido(platoAutor)
            cambiaDeEstado(EnumEstadosPedido.PREPARADO)
        }

        describe("Dado un pedido...") {
            it("Los platos del pedido deben ser acorde a las preferencias del cliente") {
                //Assert
                pedidoVegano.esAptoPreferenciaCliente(clienteVeganoSinAntiguedad) shouldBe true
                pedidoNutritivo.esAptoPreferenciaCliente(clienteMarketineroConAntiguedad) shouldBe true
                pedidoImpaciente.esAptoPreferenciaCliente(clienteImpaciente) shouldBe true

                pedidoImpaciente.esAptoPreferenciaCliente(clienteVeganoSinAntiguedad) shouldBe false
                pedidoNutritivo.esAptoPreferenciaCliente(clienteVeganoSinAntiguedad) shouldBe false
            }

            it("El plato debe pertenecer al local") {
                pedidoVegano.platosDelPedido.map({pedidoVegano.platoEstaEnLocal(it)}) shouldNotContain false
                pedidoNutritivo.platosDelPedido.map({pedidoNutritivo.platoEstaEnLocal(it)}) shouldNotContain false
                pedidoImpaciente.platosDelPedido.map({pedidoImpaciente.platoEstaEnLocal(it)}) shouldNotContain false

                pedidoNutritivo.platosDelPedido.map({it.local == localVeganoNoConfiable}) shouldNotContain true
                pedidoVegano.platosDelPedido.map({it.local == localBodegon}) shouldNotContain true
            }

            it("El medio de pago del pedido debe coincidir con los que tiene el local") {
                //Assert
                localVeganoNoConfiable.mediosDePago shouldContain pedidoVegano.medioDePago
                localNutritivoConfiable.mediosDePago shouldContain pedidoNutritivo.medioDePago
            }

            it("Si intento agregar un medio de pago que NO está en el Local, deberia arrojar una excepcion") {
                //Assert
                shouldThrow<PedidoException.MedioDePagoInvalido> {
                    pedidoImpaciente.apply{
                    cambiarMedioDePago(MedioDePago.QR)
                }}

                shouldThrow<PedidoException.MedioDePagoInvalido> {
                    pedidoNutritivo.apply{
                        cambiarMedioDePago(MedioDePago.TARJETA)
                    }
                }
            }

            it("Debe haber un delivery que acepte el pedido") {
                //Assert
                deliveryCertificado.aceptaPedido(pedidoNutritivo) shouldBe true
                deliveryLocal.aceptaPedido(pedidoVegano) shouldBe true
                deliverySeguro.aceptaPedido(pedidoImpaciente) shouldBe true

                deliveryCertificado.aceptaPedido(pedidoVegano) shouldBe false
                deliverySeguro.aceptaPedido(pedidoNutritivo) shouldBe false
                deliveryCaro.aceptaPedido(pedidoVegano) shouldBe false
            }

            it("Cambios de estado en el pedido") {
                //Arrange
                pedidoVegano.apply{
                    cambiaDeEstado(EnumEstadosPedido.CANCELADO)
                }
                pedidoNutritivo.apply{
                    cambiaDeEstado(EnumEstadosPedido.ENTREGADO)
                }
                //Assert
                pedidoVegano.estadoDelPedido shouldBe EnumEstadosPedido.CANCELADO
                pedidoNutritivo.estadoDelPedido shouldBe EnumEstadosPedido.ENTREGADO
            }
        }

        describe("el Pedido es certificado?"){
            it("Pedido de un usuario con antiguedad y un local con buena puntuacion") {
                //Assert
                pedidoNutritivo.esCertificado() shouldBe true
            }
            it("Pedido de un usuario antiguo y un local con mala puntuacion") {
                //Assert
                pedidoVegano.esCertificado() shouldBe false
            }
        }

        describe("Cupon de un pedido") {
            it("Responde si tiene un cupon aplicado") {
                pedidoNutritivo.apply {
                    cupon = CuponDia(0.1, LocalDate.now().dayOfWeek)
                }

                pedidoNutritivo.tieneCupon() shouldBe true
            }
        }
    }
})