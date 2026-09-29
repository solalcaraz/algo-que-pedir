 package ar.edu.unsam.algo3

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import java.time.DayOfWeek

// Se usa sealed class para agrupar las excepciones del usuario. ninguna clase fuera de las definidas dentro del sealed class pueden heredar de ella.
// es correcto este uso de sealed class?
sealed class UsuarioException(mensaje: String) : Exception(mensaje) {
    class generalException(mensaje: String) : UsuarioException(mensaje)

    class IngredienteProhibido(val ingrediente: Ingrediente) :
        UsuarioException("El ingrediente ${ingrediente.nombre} está en la lista de prohibidos")

    class IngredientePreferido(val ingrediente: Ingrediente) :
        UsuarioException("El ingrediente ${ingrediente.nombre} está en la lista de preferidos")

    class LocalAPuntuarVencido(): UsuarioException("Ya se venció el plazo para puntuar el local")

    class LocalNoRegistrado(): UsuarioException("El local no esta registrado")

    class PedidoInvalido() : UsuarioException("No se puede establecer el pedido porque no cumple con los requisitos del usuario")

    class SinAccionesPendientes() : UsuarioException("No tenes acciones pendientes para ejecutar")
}

sealed class PedidoException(mensaje: String) : Exception(mensaje){
    class MedioDePagoInvalido : PedidoException("El medio de pago ingresado es invalido.")
    class PlatoNoEstaEnLocal : PedidoException("El plato que intentas agregar no pertenece al local.")
}

sealed class DeliveryException(mensaje: String) : Exception(mensaje) {
    class localFueraDeZonaDeTrabajo() : DeliveryException("El local se encuentra fuera de la zona de trabajo")
    class pedidoNoEstaPreparado() : DeliveryException("El pedido no se encuentra preparado")
    class entregaFueraDeZonaDeTrabajo() : DeliveryException("La entrega se encuentra fuera de la zona de trabajo")
    class zonaNoFormaPoligono() : DeliveryException("La zona tiene menos de 3 puntos")
}


sealed class LocalException(mensaje: String) : Exception(mensaje) {
    class puntajeFueraDeRango() : LocalException("El puntaje asignado está fuera de rango (1 a 5)")
}

sealed class ErrorException(mensaje: String) : Exception(mensaje) {
    @ResponseStatus(HttpStatus.NOT_FOUND)
    class NotFoundException(mensaje: String) : ErrorException(mensaje)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    class BusinessException(mensaje: String) : ErrorException(mensaje)
}

sealed class CuponException(mensaje: String) : Exception(mensaje) {
    class cuponExpiro() : CuponException("El cupon expiró.")
    class descuentoInvalido() : CuponException("El porcentaje del descuento debe estar entre 0 y 100.")
    class topeInvalido() : CuponException("El tope debe ser mayor a 0.")
    class diaInvalido(dia: DayOfWeek) : CuponException("El cupon no es aplicable en esta fecha, solo los dias ${dia}")
    class localInvalido() : CuponException("El cupon no es aplicable en este local")
    class cuponExcedido() : CuponException("Error! El descuento del cupon es mayor al monto total del pedido")
}

sealed class ObserverException(mensaje: String) : Exception(mensaje) {
    class ObjetivoInexistente() : ObserverException("Objetivo para auditar no configurado.")
}
