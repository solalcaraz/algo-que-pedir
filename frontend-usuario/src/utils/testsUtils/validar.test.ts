import { describe, expect, test } from 'vitest'
import { validar } from '../validar'
import { CompositeValidacion, validacionStrategy } from '../validacionStrategy'

describe('validar', () => {
  test('valida texto requerido correctamente', () => {
    const resultado = validar('texto', 'textoRequerido', 'Nombre')
    expect(resultado.esValido).toBe(true)
    expect(resultado.mensajeError).toBeUndefined()
  })

  test('detecta texto vacío', () => {
    const resultado = validar('', 'textoRequerido', 'Nombre')
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('El campo Nombre es requerido')
  })

  test('valida valor positivo correctamente', () => {
    const resultado = validar(5, 'valorPositivo')
    expect(resultado.esValido).toBe(true)
  })

  test('detecta valor no positivo', () => {
    const resultado = validar(-5, 'valorPositivo')
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('Debe ser un número positivo')
  })

  test('valida rango numérico correctamente', () => {
    const resultado = validar(25, 'rangoNumerido', undefined, { min: 18, max: 100 })
    expect(resultado.esValido).toBe(true)
  })

  test('detecta valor fuera de rango', () => {
    const resultado = validar(150, 'rangoNumerido', undefined, { min: 18, max: 100 })
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('Debe estar entre 18 y 100')
  })

  test('funciona con CompositeValidacion', () => {
    const composite = new CompositeValidacion()
    composite.agregar(validacionStrategy.valorPositivo)
    composite.agregar(validacionStrategy.valorRequerido)
    
    const resultado = validar(10, composite)
    expect(resultado.esValido).toBe(true)
  })

  test('CompositeValidacion detecta múltiples errores', () => {
    const composite = new CompositeValidacion()
    composite.agregar(validacionStrategy.valorRequerido)
    composite.agregar(validacionStrategy.valorPositivo)
    
    const resultado = validar(null!, composite, 'Edad')
    expect(resultado.esValido).toBe(false)
    expect(resultado.mensajeError).toBe('El campo Edad es requerido. Debe ser un número positivo')
  })
})