import { describe, it, expect } from 'vitest'
import { Ingrediente, GrupoAlimenticio, type IngredienteJSON } from '../models/ingrediente.svelte'

describe('Ingrediente', () => {
  describe('fromJson', () => {
    it('debe crear un Ingrediente desde un JSON válido', () => {
      const json: IngredienteJSON = {
        id: 1,
        nombre: 'Leche',
        costoMercado: 1.5,
        grupoAlimenticio: 'LACTEOS',
        origenAnimal: true,
      }
      const ingrediente = Ingrediente.fromJson(json)
      expect(ingrediente.id).toBe(1)
      expect(ingrediente.nombre).toBe('Leche')
      expect(ingrediente.costoMercado).toBe(1.5)
      expect(ingrediente.grupoAlimenticio).toBe(GrupoAlimenticio.LACTEOS)
      expect(ingrediente.origenAnimal).toBe('animal')
    })
  })

  describe('validarIngrediente', () => {
    it('no debe agregar errores para un ingrediente válido', () => {
      const ingrediente = new Ingrediente()
      ingrediente.nombre = 'Arroz'
      ingrediente.costoMercado = 2
      ingrediente.grupoAlimenticio = GrupoAlimenticio.CEREALES_Y_TUBERCULOS
      ingrediente.validarIngrediente()
      expect(ingrediente.invalid()).toBe(false)
    })

    it('debe agregar un error si el nombre está vacío', () => {
      const ingrediente = new Ingrediente()
      ingrediente.costoMercado = 2
      ingrediente.grupoAlimenticio = GrupoAlimenticio.CEREALES_Y_TUBERCULOS
      ingrediente.validarIngrediente()
      expect(ingrediente.tieneError('nombre')).toBe(true)
      expect(ingrediente.mensajesError('nombre')).toContain('Debe ingresar un nombre para el ingrediente')
    })

    it('debe agregar un error si el costo es cero o negativo', () => {
      const ingrediente = new Ingrediente()
      ingrediente.nombre = 'Azúcar'
      ingrediente.costoMercado = 0
      ingrediente.grupoAlimenticio = GrupoAlimenticio.AZUCARES_Y_DULCES
      ingrediente.validarIngrediente()
      expect(ingrediente.tieneError('costoMercado')).toBe(true)
      expect(ingrediente.mensajesError('costoMercado')).toContain('Debe ingresar un costo válido y mayor a 0')
    })

    it('debe agregar un error si el grupo no está seleccionado', () => {
      const ingrediente = new Ingrediente()
      ingrediente.nombre = 'Aceite'
      ingrediente.costoMercado = 3
      ingrediente.grupoAlimenticio = ''
      ingrediente.validarIngrediente()
      expect(ingrediente.tieneError('grupoAlimenticio')).toBe(true)
      expect(ingrediente.mensajesError('grupoAlimenticio')).toContain('Debe seleccionar un grupo alimenticio')
    })
  })

  describe('toJSON', () => {
    it('debe convertir un Ingrediente a su representación JSON', () => {
      const ingrediente = new Ingrediente()
      ingrediente.id = 5
      ingrediente.nombre = 'Pollo'
      ingrediente.costoMercado = 5
      ingrediente.grupoAlimenticio = GrupoAlimenticio.PROTEINAS
      ingrediente.origenAnimal = 'animal'

      const json = ingrediente.toJSON()

      expect(json.id).toBe(5)
      expect(json.nombre).toBe('Pollo')
      expect(json.costoMercado).toBe(5)
      expect(json.grupoAlimenticio).toBe('PROTEINAS')
      expect(json.origenAnimal).toBe(true)
    })
  })

  describe('esAnimal getter/setter', () => {
    it('debe devolver true si el origen es animal', () => {
      const ingrediente = new Ingrediente()
      ingrediente.origenAnimal = 'animal'
      expect(ingrediente.esAnimal).toBe(true)
    })

    it('debe devolver false si el origen es vegetal', () => {
      const ingrediente = new Ingrediente()
      ingrediente.origenAnimal = 'vegetal'
      expect(ingrediente.esAnimal).toBe(false)
    })

    it('debe establecer el origen como animal cuando esAnimal se establece en true', () => {
      const ingrediente = new Ingrediente()
      ingrediente.esAnimal = true
      expect(ingrediente.origenAnimal).toBe('animal')
    })

    it('debe establecer el origen como vegetal cuando esAnimal se establece en false', () => {
      const ingrediente = new Ingrediente()
      ingrediente.esAnimal = false
      expect(ingrediente.origenAnimal).toBe('vegetal')
    })
  })

  describe('Manejo de errores', () => {
    it('debe agregar y verificar errores correctamente', () => {
      const ingrediente = new Ingrediente()
      ingrediente.agregarError('test', 'mensaje de prueba')
      expect(ingrediente.tieneError('test')).toBe(true)
      expect(ingrediente.tieneError('otro')).toBe(false)
      expect(ingrediente.mensajesError('test')).toBe('mensaje de prueba')
    })

    it('invalid() debe devolver true si hay errores', () => {
      const ingrediente = new Ingrediente()
      ingrediente.agregarError('test', 'error')
      expect(ingrediente.invalid()).toBe(true)
    })
  })
})
