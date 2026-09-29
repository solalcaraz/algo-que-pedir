import { describe, expect, test } from 'vitest'
import { CompositeValidacion, validacionStrategy } from '../validacionStrategy'

describe('TextoRequerido', () => {
  test('valida texto no vacío', () => {
    const resultado = validacionStrategy.textoRequerido.esValido('texto', 'Nombre')
    expect(resultado.esValido).toBe(true)
  })

  test('rechaza texto vacío', () => {
    const resultado = validacionStrategy.textoRequerido.esValido('', 'Nombre')
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('El campo Nombre es requerido')
  })

  test('rechaza texto con solo espacios', () => {
    const resultado = validacionStrategy.textoRequerido.esValido('   ', 'Apellido')
    expect(resultado.esValido).toBe(false)
  })
})

describe('ValorRequerido', () => {
  test('valida valor distinto de cero', () => {
    const resultado = validacionStrategy.valorRequerido.esValido(5, 'Cantidad')
    expect(resultado.esValido).toBe(true)
  })

  test('rechaza valor cero', () => {
    const resultado = validacionStrategy.valorRequerido.esValido(0, 'Cantidad')
    expect(resultado.esValido).toBe(false)
  })
})

describe('ValorPositivo', () => {
  test('valida número positivo', () => {
    const resultado = validacionStrategy.valorPositivo.esValido(10)
    expect(resultado.esValido).toBe(true)
  })

  test('rechaza número negativo', () => {
    const resultado = validacionStrategy.valorPositivo.esValido(-5)
    expect(resultado.esValido).toBe(false)
  })

  test('rechaza cero', () => {
    const resultado = validacionStrategy.valorPositivo.esValido(0)
    expect(resultado.esValido).toBe(false)
  })
})

describe('RangoNumerico', () => {
  test('valida valor dentro del rango', () => {
    const resultado = validacionStrategy.rangoNumerido.esValido(25, undefined, { min: 18, max: 100 })
    expect(resultado.esValido).toBe(true)
  })

  test('rechaza valor menor al mínimo', () => {
    const resultado = validacionStrategy.rangoNumerido.esValido(10, undefined, { min: 18, max: 100 })
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('Debe estar entre 18 y 100')
  })

  test('rechaza valor mayor al máximo', () => {
    const resultado = validacionStrategy.rangoNumerido.esValido(150, undefined, { min: 18, max: 100 })
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('Debe estar entre 18 y 100')
  })

  test('acepta valores en los extremos', () => {
    const resultadoMin = validacionStrategy.rangoNumerido.esValido(18, undefined, { min: 18, max: 100 })
    const resultadoMax = validacionStrategy.rangoNumerido.esValido(100, undefined, { min: 18, max: 100 })
    
    expect(resultadoMin.esValido).toBe(true)
    expect(resultadoMax.esValido).toBe(true)
  })

  test('lanza error si no se proporciona rango', () => {
    expect(() => {
      validacionStrategy.rangoNumerido.esValido(50)
    }).toThrow('Se requiere un rango definido')
  })
})

describe('CompositeValidacion', () => {
  test('valida cuando todas las estrategias son válidas', () => {
    const composite = new CompositeValidacion()
    composite.agregar(validacionStrategy.valorRequerido)
    composite.agregar(validacionStrategy.valorPositivo)
    
    const resultado = composite.esValido(10)
    expect(resultado.esValido).toBe(true)
  })

  test('falla cuando alguna estrategia falla', () => {
    const composite = new CompositeValidacion()
    composite.agregar(validacionStrategy.valorRequerido)
    composite.agregar(validacionStrategy.valorPositivo)
    
    const resultado = composite.esValido(-3, 'Edad')
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('Debe ser un número positivo')
  })

  test('concatena mensajes de error', () => {
    const composite = new CompositeValidacion()
    composite.agregar(validacionStrategy.valorRequerido)
    composite.agregar(validacionStrategy.valorPositivo)
    
    const resultado = composite.esValido(0, 'Edad')
    expect(resultado.mensajeError).toContain('.')
    expect(resultado.mensajeError).toBe('El campo Edad es requerido. Debe ser un número positivo')
  })

  test('permite agregar estrategias dinámicamente', () => {
    const composite = new CompositeValidacion()
    expect(composite.esValido(5).esValido).toBe(true)
    
    composite.agregar(validacionStrategy.valorPositivo)
    expect(composite.esValido(5).esValido).toBe(true)
    expect(composite.esValido(-5).esValido).toBe(false)
  })
})