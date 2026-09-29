import { beforeEach, describe, expect, it } from 'vitest'
import { Plato, type PlatoJSON } from '$lib/models/plato.svelte'
import { INGREDIENTES_MOCK } from '$lib/data/mocks/ingredientesMock'
import { PLATOS_MOCK } from '$lib/data/mocks/platosMock'

describe('Plato', () => {
  let plato: Plato

  beforeEach(() => {
    // creo este plato para tenerlo lo mas controlado posible    
    plato = new Plato()
    plato.id = 1
    plato.nombre = 'Hamburguesa Completa'
    plato.descripcion = 'Deliciosa hamburguesa con todos los ingredientes'
    plato.imagenUrl = '/images/hamburguesa.jpg'
    plato.valorBase = 25
    plato.costoProduccion = 0
  })

  describe('Manejo de ingredientes', () => {
    it('debe agregar un ingrediente correctamente', () => {
      plato.agregarIngrediente(INGREDIENTES_MOCK[0])
      
      expect(plato.ingredientes).toHaveLength(1)
      expect(plato.ingredientes[0]).toEqual(INGREDIENTES_MOCK[0])
    })

    it('no debe agregar un ingrediente duplicado', () => {
      plato.agregarIngrediente(INGREDIENTES_MOCK[0])
      plato.agregarIngrediente(INGREDIENTES_MOCK[0])
      
      expect(plato.ingredientes).toHaveLength(1)
    })

    it('debe agregar múltiples ingredientes diferentes', () => {
      const ingrediente1 = INGREDIENTES_MOCK[1]
      const ingrediente2 = INGREDIENTES_MOCK[2]
      const ingrediente3 = INGREDIENTES_MOCK[3]
      
      plato.agregarIngrediente(ingrediente1)
      plato.agregarIngrediente(ingrediente2)
      plato.agregarIngrediente(ingrediente3)
      
      expect(plato.ingredientes).toHaveLength(3)
    })

    it('debe eliminar un ingrediente por id', () => {    
      PLATOS_MOCK[1].eliminarIngrediente(2)
      
      expect(PLATOS_MOCK[1].ingredientes).toHaveLength(1)
      expect(PLATOS_MOCK[1].ingredientes[0].id).toBe(5)
    })

    it('debe mantener los ingredientes si se intenta eliminar un id inexistente', () => {
      PLATOS_MOCK[0].eliminarIngrediente(99999)
      
      expect(PLATOS_MOCK[0].ingredientes).toHaveLength(3)
    })
  })

  describe('Conversión fromJson', () => {
    it('debe crear un plato desde JSON correctamente', () => {
      const platoJSON: PlatoJSON = {
        id: 1,
        nombre: 'Pizza Margherita',
        descripcion: 'Pizza clásica italiana',
        imagenNombre: 'pizza.jpg',
        valorBase: 800,
        esDeAutor: true,
        esNuevo: false,
        estaEnPromo: false,
        porcentajeDescuento: 0,
        costoProduccion: 300,
        listaDeIngredientes: [
          { id: 1, nombre: 'Tomate', grupoAlimenticio: 'Verduras', origenAnimal: false, costoMercado: 50 },
          { id: 2, nombre: 'Mozzarella', grupoAlimenticio: 'Lácteos', origenAnimal: true, costoMercado: 150 }
        ]
      }

      const platoFromJson = Plato.fromJson(platoJSON)

      expect(platoFromJson.id).toBe(1)
      expect(platoFromJson.nombre).toBe('Pizza Margherita')
      expect(platoFromJson.descripcion).toBe('Pizza clásica italiana')
      expect(platoFromJson.valorBase).toBe(800)
      expect(platoFromJson.esDeAutor).toBe(true)
      expect(platoFromJson.ingredientes).toHaveLength(2)
      expect(platoFromJson.ingredientes[0].nombre).toBe('Tomate')
    })

    it('debe crear un plato sin ingredientes si no vienen en el JSON', () => {
      const platoJSON: PlatoJSON = {
        id: 1,
        nombre: 'Pizza Margherita',
        descripcion: 'Pizza clásica italiana',
        imagenNombre: 'pizza.jpg',
        valorBase: 800,
        esDeAutor: true,
        esNuevo: false,
        estaEnPromo: false,
        porcentajeDescuento: 0,
        costoProduccion: 300,
        listaDeIngredientes: []
      }

      const platoFromJson = Plato.fromJson(platoJSON)

      expect(platoFromJson.ingredientes).toHaveLength(0)
    })

    it('debe manejar listaDeIngredientes undefined', () => {
      const platoJSON = {
        id: 1,
        nombre: 'Pizza Margherita',
        descripcion: 'Pizza clásica italiana',
        imagenNombre: 'pizza.jpg',
        valorBase: 800,
        esDeAutor: true,
        esNuevo: false,
        estaEnPromo: false,
        porcentajeDescuento: 0,
        costoProduccion: 300
      } as PlatoJSON

      const platoFromJson = Plato.fromJson(platoJSON)

      expect(platoFromJson.ingredientes).toHaveLength(0)
    })
  })

  describe('Conversión toJSON', () => {
    it('debe convertir a JSON correctamente', () => {
      const tomate = INGREDIENTES_MOCK[0]
      const pollo = INGREDIENTES_MOCK[1]
      plato.agregarIngrediente(tomate)
      plato.agregarIngrediente(pollo)

      const json = plato.toJSON()

      expect(json).toEqual({
        id: 1,
        nombre: 'Hamburguesa Completa',
        descripcion: 'Deliciosa hamburguesa con todos los ingredientes',
        imagenNombre: 'hamburguesa.jpg',
        valorBase: 25,
        esDeAutor: false,
        esNuevo: false,
        estaEnPromo: false,
        porcentajeDescuento: 0,
        costoProduccion: 0,
        listaDeIngredientes: [
          { id: 1, nombre: 'Tomate', grupoAlimenticio: 'FRUTAS_Y_VERDURAS', origenAnimal: false, costoMercado: 0.5 },
          { id: 2, nombre: 'Pechuga de pollo', grupoAlimenticio: 'PROTEINAS', origenAnimal: true, costoMercado: 3 }
        ]
      })
    })

    it('debe extraer correctamente el nombre de la imagen de la URL', () => {
      plato.imagenUrl = '/images/platos/especial.jpg'
      const json = plato.toJSON()

      expect(json.imagenNombre).toBe('especial.jpg')
    })

    it('debe usar imagen por defecto si imagenUrl está vacía', () => {
      plato.imagenUrl = ''
      const json = plato.toJSON()

      expect(json.imagenNombre).toBe('plato-nuevo.png')
    })

    it('debe convertir id null a undefined en JSON', () => {
      plato.id = null
      const json = plato.toJSON()

      expect(json.id).toBeUndefined()
    })

    it('debe convertir correctamente cuando está en promoción', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = 25
      const json = plato.toJSON()

      expect(json.estaEnPromo).toBe(true)
      expect(json.porcentajeDescuento).toBe(25)
    })
  })

  describe('Manejo de errores', () => {
    it('debe saber si tiene error en un campo específico', () => {
      plato.agregarError('nombre', 'Debe ingresar un nombre para el plato')
      
      expect(plato.tieneError('nombre')).toBe(true)
      expect(plato.tieneError('descripcion')).toBe(false)
    })

    it('debe agregar un error correctamente', () => {
      plato.agregarError('nombre', 'Debe ingresar un nombre para el plato')
      
      expect(plato.errors).toHaveLength(1)
      expect(plato.errors[0].campo).toBe('nombre')
      expect(plato.errors[0].mensaje).toBe('Debe ingresar un nombre para el plato')
    })

    it('debe devolver los mensajes de error de un campo', () => {
      plato.agregarError('porcentajeDescuento', 'Debe ingresar un porcentaje de descuento')
      plato.agregarError('porcentajeDescuento', 'El porcentaje debe estar entre 1% y 100%')
      
      const mensajes = plato.mensajesError('porcentajeDescuento')
      
      expect(mensajes).toBe('Debe ingresar un porcentaje de descuento. El porcentaje debe estar entre 1% y 100%')
    })

    it('debe devolver string vacío si no hay errores en el campo', () => {
      const mensajes = plato.mensajesError('nombre')
      
      expect(mensajes).toBe('')
    })

    it('debe saber si es inválido - caso feliz', () => {
      plato.nombre = ''
      plato.validarPlato()
      
      expect(plato.invalid()).toBe(true)
    })

    it('debe saber si es inválido - caso sin errores', () => {
      plato.validarPlato()
      
      expect(plato.invalid()).toBe(false)
    })
  })

  describe('Validaciones', () => {
    it('validación incorrecta de nombre vacío', () => {
      plato.nombre = ''
      plato.validarPlato()
      
      expect(plato.tieneError('nombre')).toBe(true)
      expect(plato.mensajesError('nombre')).toBe('Debe ingresar un nombre para el plato')
    })

    it('validación incorrecta de nombre solo con espacios', () => {
      plato.nombre = '   '
      plato.validarPlato()
      
      expect(plato.tieneError('nombre')).toBe(true)
    })

    it('validación incorrecta de descripción vacía', () => {
      plato.descripcion = ''
      plato.validarPlato()
      
      expect(plato.tieneError('descripcion')).toBe(true)
      expect(plato.mensajesError('descripcion')).toBe('Debe ingresar una descripción')
    })

    it('validación incorrecta de descripción solo con espacios', () => {
      plato.descripcion = '   '
      plato.validarPlato()
      
      expect(plato.tieneError('descripcion')).toBe(true)
    })

    it('validación incorrecta de imagen vacía', () => {
      plato.imagenUrl = ''
      plato.validarPlato()
      
      expect(plato.tieneError('imagen')).toBe(true)
      expect(plato.mensajesError('imagen')).toBe('Debe seleccionar una imagen')
    })

    it('validación incorrecta de valorBase negativo', () => {
      plato.valorBase = -100
      plato.validarPlato()
      
      expect(plato.tieneError('valorBase')).toBe(true)
      expect(plato.mensajesError('valorBase')).toContain('El precio debe ser mayor a 0')
    })

    it('validación incorrecta de valorBase en cero', () => {
      plato.valorBase = 0
      plato.validarPlato()
      
      expect(plato.tieneError('valorBase')).toBe(true)
      expect(plato.mensajesError('valorBase')).toBe('El precio debe ser mayor a 0')
    })

    it('validación incorrecta de porcentajeDescuento en cero cuando está en promoción', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = 0
      plato.validarPlato()
      
      expect(plato.tieneError('porcentajeDescuento')).toBe(true)
      expect(plato.mensajesError('porcentajeDescuento')).toContain('El porcentaje debe estar entre 1% y 100%')
    })

    it('validación incorrecta de porcentajeDescuento negativo cuando está en promoción', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = -10
      plato.validarPlato()
      
      expect(plato.tieneError('porcentajeDescuento')).toBe(true)
    })

    it('validación incorrecta de porcentajeDescuento mayor o igual a 100', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = 100
      plato.validarPlato()
      
      expect(plato.tieneError('porcentajeDescuento')).toBe(true)
      expect(plato.mensajesError('porcentajeDescuento')).toBe('El porcentaje debe estar entre 1% y 100%')
    })

    it('validación incorrecta de porcentajeDescuento mayor a 100', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = 150
      plato.validarPlato()
      
      expect(plato.tieneError('porcentajeDescuento')).toBe(true)
    })

    it('no debe validar porcentajeDescuento si no está en promoción', () => {
      plato.estaEnPromocion = false
      plato.porcentajeDescuento = 0
      plato.validarPlato()
      
      expect(plato.tieneError('porcentajeDescuento')).toBe(false)
    })

    it('debe limpiar errores previos al validar nuevamente', () => {
      plato.nombre = ''
      plato.validarPlato()
      expect(plato.errors.length).toBeGreaterThan(0)
      
      plato.nombre = 'Hamburguesa Completa'
      plato.validarPlato()
      expect(plato.tieneError('nombre')).toBe(false)
    })

    it('validación correcta con todos los campos válidos', () => {
      plato.validarPlato()
      
      expect(plato.invalid()).toBe(false)
      expect(plato.errors).toHaveLength(0)
    })

    it('validación correcta con promoción válida', () => {
      plato.estaEnPromocion = true
      plato.porcentajeDescuento = 25
      plato.validarPlato()
      
      expect(plato.invalid()).toBe(false)
    })

    it('debe acumular múltiples errores en diferentes campos', () => {
      plato.nombre = ''
      plato.descripcion = ''
      plato.imagenUrl = ''
      plato.valorBase = 0
      plato.validarPlato()
      
      expect(plato.errors.length).toBeGreaterThanOrEqual(4)
      expect(plato.tieneError('nombre')).toBe(true)
      expect(plato.tieneError('descripcion')).toBe(true)
      expect(plato.tieneError('imagen')).toBe(true)
      expect(plato.tieneError('valorBase')).toBe(true)
    })
  })
})