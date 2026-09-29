package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.repositorios.TipoRepositorio
import java.time.LocalDate
import java.time.temporal.ChronoUnit


class Usuario(
    var nombre: String = "",
    var apellido: String = "",
    var direccion: Direccion = Direccion(),
    var usuario: String = "",
    val password: String = "",
    var fechaNacimiento: LocalDate = LocalDate.now(),
    var distanciaMaximaCercana: Double = 0.0,
    val fechaCreacionCuenta: LocalDate = LocalDate.now(),
    var strategyPuntuacionLocal : PuntuacionLocalStrategy = mismoPuntaje(3.0),
    var tipoDeUsuario: UsuarioStrategy = UsuarioGeneralStrategy(),
    val gestorObservers: GestorObserversPedido = GestorObserversPedido(),
    val mail: String = ""
): TipoRepositorio() {
    val ingredientesPreferidos: MutableSet<Ingrediente> = mutableSetOf()
    val ingredientesProhibidos: MutableSet<Ingrediente> = mutableSetOf()
    val localesAPuntuar:MutableMap<Local, LocalDate> = mutableMapOf()
    var listaPedidosPendientes : MutableList<Pedido> = mutableListOf()
    var listaAccionesPendientes : MutableList<CommandUsuario> = mutableListOf()

    fun esIngredienteProhibido(ingrediente: Ingrediente) = ingredientesProhibidos.contains(ingrediente)
    fun esIngredientePreferido(ingrediente: Ingrediente) = ingredientesPreferidos.contains(ingrediente)

    fun agregarPreferido(ingrediente: Ingrediente) {
        if (esIngredienteProhibido(ingrediente)) {
            throw UsuarioException.IngredienteProhibido(ingrediente)
        }
        ingredientesPreferidos.add(ingrediente)
    }

    fun agregarProhibido(ingrediente: Ingrediente) {
        if (esIngredientePreferido(ingrediente)) {
            throw UsuarioException.IngredientePreferido(ingrediente)
        }
        ingredientesProhibidos.add(ingrediente)
    }

    fun obtenerEdad() = ChronoUnit.YEARS.between(fechaNacimiento, LocalDate.now())

    fun esLocalCercano(local: Local): Boolean {
        val distancia = direccion.distanciaCon(local.direccion)
        return distancia <= distanciaMaximaCercana
    }

    fun confirmarPedidoEntregado(pedido: Pedido) {
        pedido.pedidoEntregado()
        agregarLocalAPuntuar(pedido.local, pedido.fechaPedido)
        gestorObservers.notificarPedidoRealizado(pedido)
    }

    fun agregarLocalAPuntuar(local: Local, fechaConfirmacion: LocalDate) {
        localesAPuntuar[local] = fechaConfirmacion
    }

    fun estaATiempoDePuntuar(date:LocalDate): Boolean = ChronoUnit.DAYS.between(date, LocalDate.now()) <= 7


    fun puntuarLocal(local:Local, puntuacion: Double, review: String){
        val fechaLimite = localesAPuntuar[local] ?: throw UsuarioException.LocalNoRegistrado()
        if(estaATiempoDePuntuar(fechaLimite)){
            local.puntuar(puntuacion)
            local.agregarReview(review)
            localesAPuntuar.remove(local)
        } else {
            throw UsuarioException.LocalAPuntuarVencido()
        }
    }

    fun eliminarPreferido(ingrediente: Ingrediente) {
        ingredientesPreferidos.remove(ingrediente)
    }

    fun eliminarProhibido(ingrediente: Ingrediente) {
        ingredientesProhibidos.remove(ingrediente)
    }

    fun antiguedadEnPlataforma() = ChronoUnit.YEARS.between(fechaCreacionCuenta, LocalDate.now())

    fun noTieneIngredientesAEvitar(plato : Plato) : Boolean{
        if(plato.contieneIngredientesProhibidos(this)){
            throw UsuarioException.generalException("El plato tiene ingredientes prohibidos")
        }else return true
    }

    fun aceptaPlato(plato: Plato): Boolean = noTieneIngredientesAEvitar(plato) && tipoDeUsuario.aceptaPlato(this, plato)

    fun establecerPedido(pedido: Pedido) {
        if(validacionPlatosPedido(pedido)){
            listaPedidosPendientes.add(pedido)
        }else{
            throw UsuarioException.PedidoInvalido()
        }
    }
    fun validacionPlatosPedido(pedido : Pedido) : Boolean = pedido.platosDelPedido.all{ aceptaPlato(it) }

    fun agregarAccion(accion: CommandUsuario) {
        listaAccionesPendientes.add(accion)
    }
    fun ejecutarAccionesPendientes() {
        if(listaAccionesPendientes.isNotEmpty()){
            listaAccionesPendientes.forEach { it.execute(this) }
            listaAccionesPendientes.clear()
        }else{
            throw UsuarioException.SinAccionesPendientes()
        }
    }

    fun devolverNombreCompleto() : String {
        return "${nombre} ${apellido}"
    }

    fun actualizar(usuarioActualizado: Usuario) {
        nombre = usuarioActualizado.nombre
        apellido = usuarioActualizado.apellido
        direccion = usuarioActualizado.direccion
        distanciaMaximaCercana = usuarioActualizado.distanciaMaximaCercana
        tipoDeUsuario = usuarioActualizado.tipoDeUsuario

        // Los ingredientes ya llegan validados desde el service
        ingredientesPreferidos.clear()
        ingredientesPreferidos.addAll(usuarioActualizado.ingredientesPreferidos)
        ingredientesProhibidos.clear()
        ingredientesProhibidos.addAll(usuarioActualizado.ingredientesProhibidos)
    }

    fun validar() {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(apellido.isNotBlank()) { "El apellido no puede estar vacío" }
    }
}


