import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/svelte'
import { load } from '../../routes/(app)/plato/[[id]]/+page'
import { PLATOS_MOCK } from '$lib/data/mocks/platosMock'

vi.mock('axios')

import axios from 'axios'

describe('+page.ts load - platos', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Crear nuevo plato', () => {
    it('devuelve un plato vacío cuando no hay id en params', async () => {
      const { plato, nuevoPlato } = await load({ 
        params: {}
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(nuevoPlato).toBe(true)
        expect(plato).toBeDefined()
        expect(plato.nombre).toBe('')
        expect(plato.valorBase).toBe(0)
      })
    })

    it('devuelve nuevoPlato=true cuando params.id es undefined', async () => {
      const { nuevoPlato } = await load({ 
        params: { id: undefined }
      } as Parameters<typeof load>[0])
      
      expect(nuevoPlato).toBe(true)
    })
  })

  describe('Editar plato existente', () => {
    it('devuelve el plato cuando el service responde OK', async () => {
      const platoJSON = PLATOS_MOCK[0].toJSON()
      vi.mocked(axios.get).mockResolvedValue({ data: platoJSON, status: 200 })
      
      const { plato, nuevoPlato } = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(nuevoPlato).toBe(false)
        expect(plato).toBeDefined()
        expect(plato.id).toBe(1)
        expect(plato.nombre).toBe('Pasta cremosa')
      })
    })

    it('devuelve el plato con sus ingredientes', async () => {
      const platoJSON = PLATOS_MOCK[0].toJSON()
      vi.mocked(axios.get).mockResolvedValue({ data: platoJSON, status: 200 })
      
      const { plato } = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(plato.ingredientes.length).toBe(3)
        expect(plato.ingredientes[0].nombre).toBe('Tomate')
        expect(plato.ingredientes[1].nombre).toBe('Arroz')
        expect(plato.ingredientes[2].nombre).toBe('Leche')
      })
    })

    it('devuelve plato de autor correctamente', async () => {
      const platoJSON = PLATOS_MOCK[0].toJSON()
      vi.mocked(axios.get).mockResolvedValue({ data: platoJSON, status: 200 })
      
      const { plato } = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(plato.esDeAutor).toBe(true)
      })
    })

    it('lanza error 400 cuando el id no es un número válido', async () => {
      try {
        await load({ 
          params: { id: 'abc' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect(error.status).toBe(400)
      }
    })

    it('lanza error 400 con mensaje descriptivo para id inválido', async () => {
      try {
        await load({ 
          params: { id: 'invalid' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect(error.status).toBe(400)
        expect(error.body.message).toContain('debe ser un número válido')
      }
    })
  })

  describe('Manejo de errores', () => {
    it('redirige a / cuando falla la carga del plato', async () => {
      const err = new Error('Not found')
      vi.mocked(axios.get).mockRejectedValue(err)
      
      try {
        await load({ 
          params: { id: '999' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error de redirección')
      } catch (error: unknown) {
        expect(error.status).toBe(302)
        expect(error.location).toBe('/')
      }
    })
  })
})