import { Plato } from '$lib/models/plato.svelte'
import { INGREDIENTES_MOCK } from '$lib/data/mocks/ingredientesMock'

const INGREDIENTES_A = [
  INGREDIENTES_MOCK[0],
  INGREDIENTES_MOCK[2],
  INGREDIENTES_MOCK[3]
]
const INGREDIENTES_B = [
  INGREDIENTES_MOCK[1],
  INGREDIENTES_MOCK[4]
]

// builder de plato para que use correctamente metodos
function PlatosBuilder(Init: Partial<Plato>){
  const plato = new Plato()
  plato.id = Init.id ?? null
  plato.nombre = Init.nombre ?? ''
  plato.descripcion = Init.descripcion ?? ''
  plato.imagenUrl = Init.imagenUrl ?? ''
  plato.valorBase = Init.valorBase ?? 0
  plato.esDeAutor = Init.esDeAutor ?? false
  plato.estaEnPromocion = Init.estaEnPromocion ?? false
  plato.esNuevo = Init.esNuevo ?? false
  plato.porcentajeDescuento = Init.porcentajeDescuento ?? 0
  plato.ingredientes = Init.ingredientes ?? []
  plato.errors = Init.errors ?? []

  return plato
}


export const PLATOS_MOCK: Plato[] = [
  PlatosBuilder({
    id: 1,
    nombre: 'Pasta cremosa',
    descripcion: 'Deliciosa pasta con salsa cremosa',
    imagenUrl: '/src/lib/assets/pasta-cremosa.png',
    valorBase: 12.99,
    esDeAutor: true,
    estaEnPromocion: true,
    esNuevo: false,
    porcentajeDescuento: 10,
    ingredientes: INGREDIENTES_A,
    errors: [],
  }),
  PlatosBuilder({
    id: 2,
    nombre: 'Alitas picantes',
    descripcion: 'Alitas de pollo picantes con salsa para mojar',
    imagenUrl: '/src/lib/assets/alitas-picantes.png',
    valorBase: 9.99,
    esNuevo: true,
    ingredientes: INGREDIENTES_B,
    errors: []
  }),
  PlatosBuilder({
    id: 3,
    nombre: 'Ensalada de la Huerta',
    descripcion: 'Ensalada fresca con hojas mixtas y vinagreta',
    imagenUrl: '/src/lib/assets/ensalada-huerta.png',
    valorBase: 7.50,
    errors: [],
    esDeAutor: true
  }),
  PlatosBuilder({
    id: 4,
    nombre: 'Hamburguesa con queso',
    descripcion: 'Hamburguesa clásica con queso y papas fritas',
    imagenUrl: '/src/lib/assets/hamburguesa-con-queso.png',
    valorBase: 10.50,
    errors: [],
    estaEnPromocion: true
  }),
  PlatosBuilder({
    id: 5,
    nombre: 'Pescado y Papas Fritas',
    descripcion: 'Pescado crujiente y papas fritas con salsa tártara',
    imagenUrl: '/src/lib/assets/pescado-papas-fritas.png',
    valorBase: 11.75,
    ingredientes: INGREDIENTES_A,
    errors: []
  }),
  PlatosBuilder({
    id: 6,
    nombre: 'Pizza Vegetariana',
    descripcion: 'Pizza vegetariana con ingredientes variados',
    imagenUrl: '/src/lib/assets/pizza-vegetariana.png',
    valorBase: 14.25,
    ingredientes: INGREDIENTES_B,
    errors: []
  }),
  PlatosBuilder({
    id: 7,
    nombre: 'Pastel de Chocolate',
    descripcion: 'Pastel de chocolate rico con glaseado',
    imagenUrl: '/src/lib/assets/pastel-chocolate.png',
    valorBase: 6.50,
    ingredientes: INGREDIENTES_A,
    errors: []
  })
]

