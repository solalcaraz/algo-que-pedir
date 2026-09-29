package ar.edu.unsam.algo3

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldHaveSize
import java.time.LocalDate

class MensajeriaSpec : DescribeSpec ({

    describe("Test Mensajeria") {

        it("Marcar como leido un mail, cambia el estado a leido") {
            val mensaje = Mensaje(LocalDate.now(), "Mensaje", "Mensaje generico")

            mensaje.leido shouldBe false
            mensaje.marcarComoLeido()
            mensaje.leido shouldBe true
        }

        it("Mantiene el estado de leido, si ya se leyo") {
            var mensaje = Mensaje(LocalDate.now(), "Mensaje", "Mensaje generico", leido = true)

            mensaje.leido shouldBe true
            mensaje.marcarComoLeido()
            mensaje.leido shouldBe true
        }

        it("Se agregan mensajes correctamente al Inbox Mensajes") {
            val inbox = InboxMensajes()
            val mensaje1 = Mensaje(LocalDate.now(), "Msj 1", "Contenido 1")
            val mensaje2 = Mensaje(LocalDate.now(), "Msj 2", "Contenido 2")

            inbox.agregarMensaje(mensaje1)
            inbox.obtenerMensajes() shouldHaveSize 1
            inbox.agregarMensaje(mensaje2)
            inbox.obtenerMensajes() shouldHaveSize 2
            inbox.obtenerMensajes() shouldContain mensaje1
            inbox.obtenerMensajes() shouldContain mensaje2
        }

        it("Obtener mensajes no leidos") {
            val inbox = InboxMensajes()
            val mensajeNoLeido = Mensaje(LocalDate.now(), "Mensaje No Leido", "No se leyó")

            inbox.agregarMensaje(mensajeNoLeido)
            inbox.obtenerMensajesNoLeidos() shouldHaveSize 1
            inbox.obtenerMensajesNoLeidos() shouldContain mensajeNoLeido
        }

        it("Se devuelve lista vacia cuando los mensajes se leyeron") {
            val inbox = InboxMensajes()
            val mensajeLeido = Mensaje(LocalDate.now(), "Mensaje Leido", "Se leyó", leido = true)

            inbox.agregarMensaje(mensajeLeido)
            inbox.obtenerMensajesNoLeidos().shouldBeEmpty()
        }

        val fechaAntigua = LocalDate.now().minusDays(31)
        it("Eliminar mensajes antiguos y leidos") {
            val inbox = InboxMensajes()
            val mensajeViejo = Mensaje(fechaAntigua, "Viejo", "Se leyo y es viejo", leido = true)

            inbox.agregarMensaje(mensajeViejo)
            inbox.eliminarMensajesAntiguosYLeidos()
            inbox.obtenerMensajes().shouldBeEmpty()
        }

        it("No se elimina mensaje no leido aunque sea antiguo") {
            val inbox = InboxMensajes()
            val mensajeViejoNoLeido = Mensaje(fechaAntigua, "Viejo", "No se leyo y es viejo")

            inbox.agregarMensaje(mensajeViejoNoLeido)
            inbox.eliminarMensajesAntiguosYLeidos()
            inbox.obtenerMensajes() shouldHaveSize 1
            inbox.obtenerMensajes() shouldContain mensajeViejoNoLeido
        }

        it("No se elimina mensaje reciente aunque se haya leido") {
            val inbox = InboxMensajes()
            val fechaReciente = LocalDate.now().minusDays(15)
            val mensajeReciente = Mensaje(fechaReciente, "Reciente", "Se leyo pero es recente", leido = true)

            inbox.agregarMensaje(mensajeReciente)
            inbox.eliminarMensajesAntiguosYLeidos()
            inbox.obtenerMensajes() shouldHaveSize 1
            inbox.obtenerMensajes() shouldContain mensajeReciente
        }
    }
})