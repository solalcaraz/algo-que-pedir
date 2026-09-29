package ar.edu.unsam.algo3

interface ObjetivoAuditoria {
    fun cumpleObjetivos() : Boolean
    fun registrarValores(pedido: Pedido)
}

class ObjetivoVentasMinimas(val montoMinimo : Double) : ObjetivoAuditoria {
    var ventasAcumuladas: Double = 0.0
    override fun cumpleObjetivos(): Boolean {
        return ventasAcumuladas >= montoMinimo
    }

    override fun registrarValores(pedido: Pedido) {
        ventasAcumuladas += pedido.costoTotalPedido()
    }

}

class ObjetivoPedidosGrandes(val cantidadMinima: Int = 5) : ObjetivoAuditoria {
    var cantidadPedidosGrandes: Int = 0
    override fun cumpleObjetivos(): Boolean {
        return cantidadPedidosGrandes >= cantidadMinima
    }

    override fun registrarValores(pedido: Pedido) {
        if (pedido.platosDelPedido.size >= 3){
            cantidadPedidosGrandes++
        }
    }
}

class ObjetivoPlatosVeganos(val cantidadMinima: Int) : ObjetivoAuditoria {
    var cantidadPlatosVeganos: Int = 0
    override fun cumpleObjetivos(): Boolean {
        return cantidadPlatosVeganos >= cantidadMinima
    }

    override fun registrarValores(pedido: Pedido) {
        cantidadPlatosVeganos += pedido.platosDelPedido.count {it.esVegano()}
    }
}

class ObjetivoCombinado(val objetivos : List<ObjetivoAuditoria>) : ObjetivoAuditoria {
    override fun cumpleObjetivos(): Boolean {
        return objetivos.all { it.cumpleObjetivos() }
    }

    override fun registrarValores(pedido: Pedido) {
        objetivos.forEach { it.registrarValores(pedido) }
    }
}