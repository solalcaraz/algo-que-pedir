package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import org.uqbar.geodds.Polygon
import org.uqbar.geodds.Point
import java.time.LocalDate
import java.time.LocalTime

class DeliverySpec : DescribeSpec({
        describe("Tests delivery") {
            it("Zona de trabajo funciona con 3 puntos"){
                val delivery = Delivery()

                delivery.zonaDeTrabajo().shouldBeInstanceOf<Polygon>()
            }
            it("Zona de trabajo no funciona con menos de 3 puntos"){
                val deliveryMenosDeTresPuntos = Delivery().apply { puntosZona = setOf(Point(30, 50), Point(40, 20)) } //zona con 2 puntos

                shouldThrow<DeliveryException>{deliveryMenosDeTresPuntos.zonaDeTrabajo()}
            }
            it("No se acepta pedido si no está preparado") {
                val pedidoNoPreparado = Pedido()
                val deliveryNoPreparado = Delivery()

                shouldThrow<DeliveryException> { deliveryNoPreparado.aceptaPedido(pedidoNoPreparado) } shouldBe DeliveryException.pedidoNoEstaPreparado()
            }
            it("No se acepta pedido si local se encuentra fuera de zona de trabajo"){
                val localFueraDeZona = Local(direccion =  Direccion(ubicacion = Point(3, 6))) //local fuera de zona de trabajo
                val pedidoFueraDeZona = Pedido(local = localFueraDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val delivery = Delivery(puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                shouldThrow<DeliveryException>{delivery.aceptaPedido(pedidoFueraDeZona)} shouldBe DeliveryException.localFueraDeZonaDeTrabajo()
            }
            it("No se acepta pedido si entrega está fuera de zona de trabajo"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2))) //local dentro de zona de trabajo
                val clienteFueraDeZona = Usuario(direccion = Direccion(ubicacion = Point(3, 6))) //entrega fuera de la zona de trabajo
                val pedidoDentroDeZona = Pedido(local = localDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO, cliente = clienteFueraDeZona)
                val delivery = Delivery(puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                shouldThrow<DeliveryException>{delivery.aceptaPedido(pedidoDentroDeZona)} shouldBe DeliveryException.entregaFueraDeZonaDeTrabajo()
            }
            it("Delivery acepta pedido al cumplirse todas las condiciones"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoDentroDeZona = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val delivery = Delivery(puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                delivery.aceptaPedido(pedidoDentroDeZona) shouldBe true
            }
            it("Delivery con horario seguro no acepta pedido fuera de rango horario"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoFueraDeHorario = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO, horarioPedido = LocalTime.of(20, 0))
                val deliveryHorarioSeguro = Delivery(tipoDeDelivery = DeliveryHorarioSeguro(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                //se instanció pedido a las 20hs y el rango de horario seguro para el delivery es de 9hs a 18hs
                deliveryHorarioSeguro.aceptaPedido(pedidoFueraDeHorario) shouldBe false
            }
            it("Delivery con horario seguro acepta pedido dentro de rango horario"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoEnHorario = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO, horarioPedido = LocalTime.of(14, 0))
                val deliveryHorarioseguro = Delivery(tipoDeDelivery = DeliveryHorarioSeguro(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                //se instanció pedido a las 14hs y el rango de horario seguro para el delivery es de 9hs a 18hs
                deliveryHorarioseguro.aceptaPedido(pedidoEnHorario) shouldBe true
            }
            it("Delivery cobra caro no acepta pedido inferior a 30000"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val platoBarato =  Plato(local = localDentroDeZona, valorBase = 1.0) //plato con valor base de 1 será inferior a 30mil
                val pedidoBarato = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCobraCaro = Delivery(tipoDeDelivery = DeliveryCobraCaro, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                pedidoBarato.agregarPlatoAlPedido(platoBarato) //agrego plato al pedido

                deliveryCobraCaro.aceptaPedido(pedidoBarato) shouldBe false
            }
            it("Delivery cobra caro acepta pedido superior a 30000"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val platoCaro =  Plato(local = localDentroDeZona, valorBase = 50000.00) //plato con valor base de 50mil será superior a 30mil
                val pedidoCaro = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCobraCaro = Delivery(tipoDeDelivery = DeliveryCobraCaro, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                pedidoCaro.agregarPlatoAlPedido(platoCaro) //agrego plato al pedido

                deliveryCobraCaro.aceptaPedido(pedidoCaro) shouldBe true
            }
            it("Delivery que acepta pedidos solo de ciertos locales, no acepta pedido que no pertenecen a sus locales"){
                val localNoPerteneceADelivery = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoNoPerteneceADelivery = Pedido(local = localNoPerteneceADelivery, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliverySegunLocal = Delivery(tipoDeDelivery = DeliverySegunLocal(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                deliverySegunLocal.aceptaPedido(pedidoNoPerteneceADelivery) shouldBe false
            }
            it("Delivery que acepta pedidos solo de cierto locales, acepta pedido perteneciente a uno de sus locales"){
                val localPerteneceADelivery = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoPerteneceADelivery = Pedido(local = localPerteneceADelivery, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliverySegunLocal = Delivery(tipoDeDelivery = DeliverySegunLocal(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                (deliverySegunLocal.tipoDeDelivery as DeliverySegunLocal).agregarLocal(localPerteneceADelivery) //agrega local a set de delivery

                deliverySegunLocal.aceptaPedido(pedidoPerteneceADelivery) shouldBe true
            }
            it("Delivery que acepta pedidos certificados, no aceptará el pedido si no es certificado"){
                val localDentroDeZona = Local(direccion = Direccion(ubicacion = Point(2, 2)))
                val clienteDentroDeZona = Usuario(direccion = Direccion(ubicacion = Point(2, 3)))
                val pedidoNoCertificado = Pedido(local = localDentroDeZona, cliente = clienteDentroDeZona, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCertificado = Delivery(tipoDeDelivery = DeliveryEsCertificado, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                deliveryCertificado.aceptaPedido(pedidoNoCertificado) shouldBe false
            }
            it("Delivery que acepta pedido certificados, aceptará pedido certificado"){
                val localPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) .apply {
                    puntuar(4.5)
                }//local con puntuación entre 4 y 5
                val clienteConAntiguedad = Usuario(direccion = Direccion(ubicacion = Point(2, 3)), fechaCreacionCuenta = LocalDate.of(2015, 4, 7))//usuario con más de 1 año de antigüedad
                val pedidoCertificado =  Pedido(local = localPuntuacionAlta, cliente = clienteConAntiguedad, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCertificado = Delivery(tipoDeDelivery = DeliveryEsCertificado, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                deliveryCertificado.aceptaPedido(pedidoCertificado) shouldBe true
            }
        }
        describe("Dado un delivery complejo...") {
            it("Delivery acepta pedido si el pedido está certificado Y está dentro de los locales en los que trabaja el delivery"){
                val localPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) //local con puntuación entre 4 y 5
                val clienteConAntiguedad = Usuario(direccion = Direccion(ubicacion = Point(2, 3)), fechaCreacionCuenta = LocalDate.of(2015, 4, 7))//usuario con más de 1 año de antigüedad
                val pedidoCertificado =  Pedido(local = localPuntuacionAlta, cliente = clienteConAntiguedad, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCompuesto = Delivery(tipoDeDelivery = DeliveryComplejoAND(tiposDeDelivery = mutableSetOf(DeliveryEsCertificado, DeliverySegunLocal(mutableSetOf(localPuntuacionAlta)))), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                localPuntuacionAlta.puntuar(4.8)

                val deliveryEsCertificado = Delivery(tipoDeDelivery = DeliveryEsCertificado, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))
                val deliverySegunLocal = Delivery(tipoDeDelivery = DeliverySegunLocal(mutableSetOf(localPuntuacionAlta)), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                deliveryEsCertificado.aceptaPedido(pedidoCertificado) shouldBe true
                deliverySegunLocal.aceptaPedido(pedidoCertificado) shouldBe true

                deliveryCompuesto.aceptaPedido(pedidoCertificado) shouldBe true

            }
            it("Delivery no acepta pedido si el pedido está certificado Y no está dentro de los locales en los que trabaja el delivery"){
                val localPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) //local con puntuación entre 4 y 5
                val localRandomPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) //otro local con puntuación entre 4 y 5
                val clienteConAntiguedad = Usuario(direccion = Direccion(ubicacion = Point(2, 3)), fechaCreacionCuenta = LocalDate.of(2015, 4, 7))//usuario con más de 1 año de antigüedad
                val pedidoCertificado =  Pedido(local = localPuntuacionAlta, cliente = clienteConAntiguedad, estadoDelPedido = EnumEstadosPedido.PREPARADO)
                val deliveryCompuesto = Delivery(tipoDeDelivery = DeliveryComplejoAND(tiposDeDelivery = mutableSetOf(DeliveryEsCertificado, DeliverySegunLocal(mutableSetOf(localRandomPuntuacionAlta)))), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                localPuntuacionAlta.puntuar(4.8)

                val deliveryEsCertificado = Delivery(tipoDeDelivery = DeliveryEsCertificado, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))
                val deliverySegunLocal = Delivery(tipoDeDelivery = DeliverySegunLocal(mutableSetOf(localRandomPuntuacionAlta)), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                deliveryEsCertificado.aceptaPedido(pedidoCertificado) shouldBe true
                deliverySegunLocal.aceptaPedido(pedidoCertificado) shouldBe false

                deliveryCompuesto.aceptaPedido(pedidoCertificado) shouldBe false

            }
            it("Delivery acepta pedido si el pedido cumple alguna de las condiciones"){
                val localPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) //local con puntuación entre 4 y 5
                val clienteConAntiguedad = Usuario(direccion = Direccion(ubicacion = Point(2, 3)), fechaCreacionCuenta = LocalDate.of(2015, 4, 7))//usuario con más de 1 año de antigüedad
                val pedidoCertificado =  Pedido(local = localPuntuacionAlta, cliente = clienteConAntiguedad, estadoDelPedido = EnumEstadosPedido.PREPARADO, horarioPedido = LocalTime.of(14, 0))
                val deliveryCompuesto = Delivery(tipoDeDelivery = DeliveryComplejoOR(tiposDeDelivery = mutableSetOf(DeliveryHorarioSeguro(), DeliveryCobraCaro)), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                localPuntuacionAlta.puntuar(4.8)

                val delHorarioSeguro = Delivery(tipoDeDelivery = DeliveryHorarioSeguro(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))
                val delCobraCaro = Delivery(tipoDeDelivery = DeliveryCobraCaro, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                delHorarioSeguro.aceptaPedido(pedidoCertificado) shouldBe true
                delCobraCaro.aceptaPedido(pedidoCertificado) shouldBe false

                deliveryCompuesto.aceptaPedido(pedidoCertificado) shouldBe true

            }
            it("Delivery acepta pedido si el pedido es caro o está dentro del horario seguro Y es certificado"){
                val localPuntuacionAlta = Local(direccion = Direccion(ubicacion = Point(2, 2))) //local con puntuación entre 4 y 5
                val clienteConAntiguedad = Usuario(direccion = Direccion(ubicacion = Point(2, 3)), fechaCreacionCuenta = LocalDate.of(2015, 4, 7))//usuario con más de 1 año de antigüedad
                val pedidoCertificado =  Pedido(local = localPuntuacionAlta, cliente = clienteConAntiguedad, estadoDelPedido = EnumEstadosPedido.PREPARADO, horarioPedido = LocalTime.of(14, 0))
                val deliveryCompuesto = Delivery(tipoDeDelivery = DeliveryComplejoAND(tiposDeDelivery = mutableSetOf(DeliveryComplejoOR(mutableSetOf(DeliveryHorarioSeguro(), DeliveryCobraCaro)),DeliveryEsCertificado)), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                localPuntuacionAlta.puntuar(4.8)

                val delHorarioSeguro = Delivery(tipoDeDelivery = DeliveryHorarioSeguro(), puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))
                val delCobraCaro = Delivery(tipoDeDelivery = DeliveryCobraCaro, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))
                val delEsCertificado = Delivery(tipoDeDelivery = DeliveryEsCertificado, puntosZona = setOf(Point(4, 2), Point(2, 4), Point(1, 1)))

                delHorarioSeguro.aceptaPedido(pedidoCertificado) shouldBe true
                delCobraCaro.aceptaPedido(pedidoCertificado) shouldBe false
                delEsCertificado.aceptaPedido(pedidoCertificado) shouldBe true

                deliveryCompuesto.aceptaPedido(pedidoCertificado) shouldBe true

            }
        }
    }
)