package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.Repositorio
import ar.edu.unsam.algo3.repositorios.Repositorios
import ar.edu.unsam.algo3.servicios.ServicioRepositorios

class Administrador(val mailSender: MailSender) {
    val procesos = mutableListOf<ProcesosAdministracion>()

    fun agregarProceso(proceso: ProcesosAdministracion) = procesos.add(proceso)
    fun borrarProceso(proceso: ProcesosAdministracion) = procesos.remove(proceso)

    fun ejecutarProcesos() {
        procesos.forEach { proceso ->
            proceso.ejecutar()
            enviarMailProcesoCompletado(proceso)}
    }

    fun enviarMailProcesoCompletado(proceso: ProcesosAdministracion) {
        val mail = Mail(
            "proceso@mail.com",
            "admin@aqp.com.ar",
            "Se realizó el proceso ${proceso.nombre}",
            "Se realizó el proceso ${proceso.nombre}")

        mailSender.sendMail(mail)
    }
}

interface ProcesosAdministracion {
    fun ejecutar()
    val nombre: String
}

class BorrarMensajesViejos(repositorioLocal: Repositorio<Local>) : ProcesosAdministracion {
    override val nombre: String = "Borrar Mensajes Viejos"

    val locales = repositorioLocal.findAll()

    override fun ejecutar() {
        locales.forEach { it.inboxMensajes.eliminarMensajesAntiguosYLeidos() }
    }
}

class ActualizarIngredientes(val servicioRepositorios: ServicioRepositorios<Ingrediente>) : ProcesosAdministracion {
    override val nombre: String = "Actualizar Ingredientes"

    override fun ejecutar() {
        servicioRepositorios.actualizarRepositorio()
    }
}

class BorrarCuponesVencidos() : ProcesosAdministracion {
    override val nombre: String = "Borrar Cupones Vencidos"

    override fun ejecutar() {
        val cupones = Repositorios.cupon.findAll()

        val cuponesAEliminar = cupones.filter { it.noUtilizado() }

        cuponesAEliminar.forEach { Repositorios.cupon.delete(it) }
    }

}

class AgregarLocales(val repoLocales: Repositorio<Local>, val locales: List<Local>) : ProcesosAdministracion {
    override var nombre: String = "Agregar Locales"

    override fun ejecutar() {
        repoLocales.agregarDesdeLista(locales)
    }
}

