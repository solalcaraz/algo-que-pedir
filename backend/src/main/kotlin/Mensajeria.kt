package ar.edu.unsam.algo3

import java.time.LocalDate

data class Mensaje(
    val fechaEmision: LocalDate = LocalDate.now(),
    val asunto: String,
    val mensaje: String,
    var leido: Boolean = false
) {
    fun marcarComoLeido() {
        leido = true
    }
}

class InboxMensajes {
    private val mensajes: MutableList<Mensaje> = mutableListOf()

    fun agregarMensaje(mensaje: Mensaje) {
        mensajes.add(mensaje)
    }

    fun obtenerMensajes(): List<Mensaje> = mensajes.toList()

    fun obtenerMensajesNoLeidos(): List<Mensaje> = mensajes.filter { !it.leido }

    //elimina mensajes leidos que superen los diasAntiguedad de antiguedad
    fun eliminarMensajesAntiguosYLeidos(diasAntiguedad: Long = 30) {
        val fechaLimite = LocalDate.now().minusDays(diasAntiguedad)
        mensajes.removeIf { it.leido && it.fechaEmision.isBefore(fechaLimite) }
    }
}

data class Mail(val emisor: String, val destinatario: String, val asunto: String, val mensaje: String)

interface MailSender {
    fun sendMail(mail: Mail)
}

class MailService (var mailSender: MailSender) {
    fun sendPublicidadPlato(usuario: Usuario, plato: Plato) {
        val mail = Mail(
            emisor = "aqp@gmail.com",
            destinatario = usuario.mail,
            asunto = "Puede que quizas te guste...",
            mensaje = "quizas quieras probar: ${plato.nombre}"
        )
        mailSender.sendMail(mail)
    }
}