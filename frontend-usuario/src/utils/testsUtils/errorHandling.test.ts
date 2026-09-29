import { describe, expect, test } from 'vitest'
import { getMensajeError } from '../errorHandling'
import { AxiosError, type AxiosResponse } from 'axios'

describe('error handling tests', () => {
  test('should return error message for TS Errors', () => {
    const error = new Error('test error')
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('test error')
  })

  test('should return error message for Axios errors (4xx)', () => {
    const error = new AxiosError('No se encontró o es inválido el dato', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      data: {
        message: 'No se encontró o es inválido el dato',
      }
    } as unknown as AxiosResponse)
    error.status = 400
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('No se encontró o es inválido el dato')
  })

  test('should return error message for Axios errors (5xx)', () => {
    const error = new AxiosError('Indice fuera de rango', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 500,
      data: {
        message: 'Indice fuera de rango',
      }
    } as unknown as AxiosResponse)
    error.status = 500
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('Ocurrió un error inesperado. Consulte al administrador del sistema')
  })
})