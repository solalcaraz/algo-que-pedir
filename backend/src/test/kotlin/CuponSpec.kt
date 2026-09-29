package ar.edu.unsam.algo3

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.extensions.time.withConstantNow
import io.kotest.matchers.comparables.shouldBeGreaterThan
import io.kotest.matchers.comparables.shouldBeLessThan
import io.kotest.matchers.shouldBe
import io.mockk.*
import java.time.*

class CuponSpec : DescribeSpec ({
    isolationMode = IsolationMode.InstancePerTest

    describe("Test de Cupon") {

        var cupon = CuponTope(0.1, 0.1, 10000.0) //Cupon generico para los primeros tests
        val local = Local()

        var pedido = Pedido(local = local)
        var pedidoMock = mockk<Pedido>()

        val diaLunes = DayOfWeek.MONDAY
        var fechaFija : LocalDate
        val cuponDia = CuponDia(0.1, diaLunes)

        it("Se vencio el cupon") {
            var cuponVencido = cupon.apply {
                fechaEmision = LocalDate.now().minusDays(8)
            }
            shouldThrow<CuponException.cuponExpiro> { pedido.costoTotalConCupon(cuponVencido) }
        }
        it("Ya se aplico el cupon y se quiere volver a usar"){
            cupon.aplicarDescuentoDelCupon(pedido)
            cupon.yaAplicado shouldBe true

            shouldThrow<CuponException.cuponExpiro> { pedido.costoTotalConCupon(cupon) }
        }
        it("El descuento base esta fuera de rango del porcentaje valido"){
            var cuponPorcentajeInvalido = cupon.apply{
                porcentajeDescuento = 1.5
            }
            shouldThrow<CuponException.descuentoInvalido> { cuponPorcentajeInvalido.porcentajeBaseValido() }
        }
        it("NO se puede aplicar el cupon porque se descuenta mas de lo que se gasta"){
            //Configuro el comportamiento del mock
            every { pedidoMock.costoTotalPedido() } returns 50.0

            //Se crea un cupon con descuento alto
            val cuponAlto = cupon.apply{
                porcentajeDescuento = 0.6
                porcentajeEspecial = 0.5
                tope = 200.0
            }

            //Excepcion
            shouldThrow<CuponException.cuponExcedido> {
                cuponAlto.aplicarDescuentoDelCupon(pedidoMock)
            }
        }
        it("Se aplica un descuento donde tengo el pedido gratis"){
            //Configuro el comportamiento del mock
            every { pedidoMock.costoTotalPedido() } returns 100.0

            //Se crea un cupon con descuento alto
            val cuponAlto = cupon.apply{
                porcentajeDescuento = 0.9
                porcentajeEspecial = 0.7
                tope = 1000.0
            }

            //Excepcion
            shouldThrow<CuponException.cuponExcedido> {
                cuponAlto.aplicarDescuentoDelCupon(pedidoMock)
            }
        }
        describe("Test para el cupon del dia") {

            it("Se aplica el descuento para un pedido el Lunes") {
                fechaFija = LocalDate.of(2025,4,28)

                withConstantNow(fechaFija) {
                    var pedidoComun = spyk(pedido)                              //spyk te permite usar un objeto real pero mockearle algunos metodos
                    every { pedidoComun.costoTotalPedido() } returns 1000.0
                    pedidoComun.costoTotalConCupon(cuponDia) shouldBeLessThan pedidoComun.costoTotalPedido()
                }
            }
            it("NO se aplica el descuento por ser un dia invalido") {
                fechaFija = LocalDate.of(2025, 4, 29)
                withConstantNow(fechaFija) {
                    shouldThrow<CuponException.diaInvalido> { cuponDia.validarAplicacion(pedido) }
                }
            }
            it("Se aplica el descuento para un pedido con un plato especial el Lunes") {
                //Se crean mocks para dos pedidos
                val pedidoConPlatoEspecial = mockk<Pedido>()
                val pedidoSinPlatoEspecial = mockk<Pedido>()

                //Se configura el comportamiento
                every { pedidoConPlatoEspecial.tienePlatoLanzadoEl(diaLunes) } returns true
                every { pedidoSinPlatoEspecial.tienePlatoLanzadoEl(diaLunes) } returns false

                //Se mockea el costoTotalPedido para ambos
                every { pedidoConPlatoEspecial.costoTotalPedido() } returns 1000.0
                every { pedidoSinPlatoEspecial.costoTotalPedido() } returns 1000.0

                //Se calculan descuentos
                val descuentoConEspecial = cuponDia.descuentoEspecial(pedidoConPlatoEspecial)
                val descuentoSinEspecial = cuponDia.descuentoEspecial(pedidoSinPlatoEspecial)

                descuentoConEspecial shouldBeGreaterThan descuentoSinEspecial
            }
        }
        describe("Test para el cupon de los locales") {
            val localValido: MutableSet<Local> = mutableSetOf(local)
            val cuponLocal = CuponLocal(0.1, localValido)

            it("Se aplica el descuento para un pedido NO certificado") {
                var pedidoNoCertificado = spyk(pedido)

                every { pedidoNoCertificado.esCertificado() } returns false     //Mockeo el metodo para hacerlo no certificado
                every { pedidoNoCertificado.costoTotalPedido() } returns 8000.0

                var pedidoConDescuento = pedidoNoCertificado.costoTotalConCupon(cuponLocal)

                pedidoConDescuento shouldBeLessThan pedidoNoCertificado.costoTotalPedido()       //8000-800(base)-500(especial - noCertificado)
            }
            it("Se aplica el descuento para un pedido certificado") {
                val pedidoCertificado = spyk(pedido)

                //Se configura el comportamiento
                every { pedidoCertificado.esCertificado() } returns true

                //Se verifica el valor del descuento
                cuponLocal.descuentoEspecial(pedidoCertificado) shouldBe 1000.0
            }
            it("NO se aplica el descuento porque el local no esta en la lista") {
                val otroLocal = Local()
                val otroPedido = Pedido(local = otroLocal)

                shouldThrow<CuponException.localInvalido> {
                    cuponLocal.validarAplicacion(otroPedido)
                }
            }
        }
        describe("Test para el cupon con tope") {
            it("Se aplica correctamente un descuento que es menor al tope") {
                val cuponMenorTope = cupon.apply{       //Aplica el base + especial ($100) que es menor al tope ($800)
                    porcentajeDescuento = 0.1
                    porcentajeEspecial = 0.1
                    tope = 800.0
                }
                every { pedidoMock.costoTotalPedido() } returns 500.0
                cuponMenorTope.calcularDescuentoTotal(pedidoMock) shouldBe 100.0
            }
            it("Se aplica un descuento que respeta el tope") {
                val cuponTopeRespetado = cupon.apply{
                    porcentajeDescuento = 0.1
                    porcentajeEspecial = 0.5                //Aplica el base (0.1*2000=200) + el tope (500)
                    tope = 500.0                            //Rechaza el descuento especial (0.5*2000=1000)
                }
                every { pedidoMock.costoTotalPedido() } returns 2000.0
                cuponTopeRespetado.calcularDescuentoTotal(pedidoMock) shouldBe 700.0
            }
            it("El tope es negativo y el cupon no se crea"){
                shouldThrow<CuponException.topeInvalido> { CuponTope(1.0, 0.5, -5.0) }
            }
            it("El descuento especial es invalido y el cupon no se crea"){
                shouldThrow<CuponException.descuentoInvalido> { CuponTope(1.0, 3.0 , 5.0) }
            }
        }
    }
})