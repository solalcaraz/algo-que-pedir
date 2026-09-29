import { Ingrediente, GrupoAlimenticio, type Origen } from '$lib/models/ingrediente.svelte'

function ingredienteBuilder(id: number, nombre: string, costoMercado: number, grupo: GrupoAlimenticio, origen: Origen) {
  const ingrediente = new Ingrediente()
  ingrediente.id = id
  ingrediente.nombre = nombre
  ingrediente.costoMercado = costoMercado
  ingrediente.grupoAlimenticio = grupo
  ingrediente.origenAnimal = origen
  return ingrediente
}

export const INGREDIENTES_MOCK: Ingrediente[] = [
  ingredienteBuilder(1, 'Tomate', 0.5, GrupoAlimenticio.FRUTAS_Y_VERDURAS, 'vegetal'),
  ingredienteBuilder(2, 'Pechuga de pollo', 3, GrupoAlimenticio.PROTEINAS, 'animal'),
  ingredienteBuilder(3, 'Arroz', 1, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, 'vegetal'),
  ingredienteBuilder(4, 'Leche', 2, GrupoAlimenticio.LACTEOS, 'animal'),
  ingredienteBuilder(5, 'Palta', 1.5, GrupoAlimenticio.FRUTAS_Y_VERDURAS, 'vegetal')
]
