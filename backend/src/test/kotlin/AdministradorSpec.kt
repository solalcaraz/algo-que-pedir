package ar.edu.unsam.algo3
import ar.edu.unsam.algo3.repositorios.IngredienteSearcher
import ar.edu.unsam.algo3.repositorios.LocalSearcher
import ar.edu.unsam.algo3.repositorios.Repositorio
import ar.edu.unsam.algo3.repositorios.Repositorios
import ar.edu.unsam.algo3.servicios.ServicioRepositorios
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.extensions.time.withConstantNow
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import java.time.LocalDate

class AdministradorSpec : DescribeSpec ({
    isolationMode = IsolationMode.InstancePerTest

    describe("Test Administrador") {
        val mockMailSender = mockEmailSender()
        val admin = Administrador(mockMailSender)
        val mailProceso1 = Mail(
            "proceso@mail.com",
            "admin@aqp.com.ar",
            "Se realizó el proceso Proceso 1",
            "Se realizó el proceso Proceso 1")

        val mailProceso2 = Mail(
            "proceso@mail.com",
            "admin@aqp.com.ar",
            "Se realizó el proceso Proceso 2",
            "Se realizó el proceso Proceso 2"
        )

        beforeEach {
            // Limpiar repositorio antes de cada test
            Repositorios.cupon.memoria.clear()
            Repositorios.cupon.idActual = 0
        }

        it("El administrador ejecuta cada proceso y envia mails") {
            val proceso1 = mockk<ProcesosAdministracion>(relaxed = true)
            val proceso2 = mockk<ProcesosAdministracion>(relaxed = true)
            every { proceso1.nombre } returns "Proceso 1"
            every { proceso2.nombre } returns "Proceso 2"

            admin.agregarProceso(proceso1)
            admin.agregarProceso(proceso2)
            admin.ejecutarProcesos()

            verify(exactly = 1) { proceso1.ejecutar()}
            verify(exactly = 1) { proceso2.ejecutar()}
            verify(exactly = 1) { mockMailSender.sendMail(mailProceso1)}
            verify(exactly = 1) { mockMailSender.sendMail(mailProceso2) }
        }

        it("Borrar mensajes viejos"){
            val msj1 = mockk<InboxMensajes>(relaxed = true)
            val msj2 = mockk<InboxMensajes>(relaxed = true)
            val local1 = Local().apply {
                inboxMensajes = msj1
            }
            val local2 = Local().apply {
                inboxMensajes = msj2
            }

            val localRepoMock = mockRepositorioLocal()

            localRepoMock.create(local1)
            localRepoMock.create(local2)

          //  every { local1.inboxMensajes } returns msj1
            //every { local2.inboxMensajes } returns msj2

            val proceso = BorrarMensajesViejos(localRepoMock)
            proceso.ejecutar()

            verify { msj1.eliminarMensajesAntiguosYLeidos() }
            verify { msj2.eliminarMensajesAntiguosYLeidos() }
        }

        it("Actualizar ingredientes en el repositorio") {
            val servicio = mockk<ServicioRepositorios<Ingrediente>>(relaxed = true)
            val proceso = ActualizarIngredientes(servicio)

            proceso.ejecutar()
            verify { servicio.actualizarRepositorio() }
        }

        it("Agregar locales al repositorio") {
            val locales = listOf(
                Local("pepe"),
                Local("pepe2"),
                Local("pepe3", ).apply{id = 1} //verificar update
            )
            val proceso = AgregarLocales(Repositorios.local, locales)
            proceso.ejecutar()

            Repositorios.local.findAll().size shouldBe 2
            val pepe3Actualizado = Repositorios.local.getById(1)
            pepe3Actualizado.nombre shouldBe "pepe3"
        }

        it("Se borran los cupones que no se usan y son viejos") {
            val fechaFija = LocalDate.of(2025, 5, 15)
            withConstantNow(fechaFija){
                val proceso = BorrarCuponesVencidos()

                val cuponVencidoNoUsado = CuponTope(0.1, 0.05, 100.0).apply {
                    fechaEmision = fechaFija.minusDays(10) // Vencido
                    diasValido = 5
                    yaAplicado = false // No usado
                }

                val cuponValidoNoUsado = CuponTope(0.1, 0.05, 100.0).apply {
                    fechaEmision = fechaFija.minusDays(2) // Válido
                    diasValido = 7
                    yaAplicado = false // No usado
                }

                val cuponVencidoUsado = CuponTope(0.1, 0.05, 100.0).apply {
                    fechaEmision = fechaFija.minusDays(10) // Vencido
                    diasValido = 5
                    yaAplicado = true // Usado
                }

                Repositorios.cupon.create(cuponVencidoNoUsado)
                Repositorios.cupon.create(cuponValidoNoUsado)
                Repositorios.cupon.create(cuponVencidoUsado)

                Repositorios.cupon.findAll() shouldHaveSize 3

                proceso.ejecutar()

                val cuponesRestantes = Repositorios.cupon.findAll()
                cuponesRestantes.size shouldBe 2
                cuponesRestantes shouldNotContain cuponVencidoNoUsado
                cuponesRestantes shouldContain cuponValidoNoUsado
                cuponesRestantes shouldContain cuponVencidoUsado
            }

        }
    }
})

fun mockEmailSender(): MailSender {
    val mailSender = mockk<MailSender>(relaxed = true)
    return mailSender
}

fun mockRepositorioLocal(): Repositorio<Local> {
    val repositorio = Repositorio<Local>(LocalSearcher)
    repositorio.memoria.clear()
    return repositorio
}