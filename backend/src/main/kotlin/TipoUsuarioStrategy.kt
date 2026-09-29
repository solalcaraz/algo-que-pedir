 package ar.edu.unsam.algo3

interface UsuarioStrategy {
    fun aceptaPlato(usuario: Usuario, plato: Plato) : Boolean
}

class UsuarioCombinadoStrategy(var requisitosParticulares: MutableSet<UsuarioStrategy> = mutableSetOf()) : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
      return requisitosParticulares.all { it.aceptaPlato(usuario, plato) }
    }
    fun agregarUsuarios(usuario: UsuarioStrategy) {
        requisitosParticulares.add(usuario)
    }
}

class UsuarioVeganoStrategy : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return plato.esVegano()
    }
}

class UsuarioExquisitoStrategy : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return plato.esdeAutor
    }
}

class UsuarioConservadorStrategy : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return usuario.ingredientesPreferidos.containsAll(plato.listaDeIngredientes)
    }
}

class UsuarioFielStrategy : UsuarioStrategy {
    val localesPreferidos : MutableSet<Local> = mutableSetOf()

    fun agregarLocalPreferido(local: Local) {
        localesPreferidos.add(local)
    }

    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return localesPreferidos.contains(plato.local)
    }
}

class UsuarioMarketingStrategy : UsuarioStrategy {
    var textoLlamativo = mutableSetOf<String>()

    fun agregarTexto(texto: String){
        textoLlamativo.add(texto)
    }

    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return textoLlamativo.any { Regex(it, RegexOption.IGNORE_CASE).containsMatchIn(plato.descripcion) }
    }
}

class UsuarioImpacienteStrategy : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return usuario.esLocalCercano(plato.local)
    }
}

class UsuarioGeneralStrategy : UsuarioStrategy {
    override fun aceptaPlato(usuario: Usuario, plato: Plato) = true;
}

class UsuarioCambianteDeEdadStrategy : UsuarioStrategy {
    fun criterioActual(usuario: Usuario) =
        if (usuario.obtenerEdad() % 2 == 0L) UsuarioExquisitoStrategy() else UsuarioConservadorStrategy()

    override fun aceptaPlato(usuario: Usuario, plato: Plato): Boolean {
        return criterioActual(usuario).aceptaPlato(usuario, plato)
    }
}