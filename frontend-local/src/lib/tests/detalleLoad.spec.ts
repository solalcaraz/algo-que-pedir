import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/svelte'
import { load } from '../../routes/(app)/detalle-pedido/[id]/+page'
import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'


import axios from 'axios'

vi.mock('axios')

const mockPedidoDetalle: PedidoDetalleDTO = {
  id: 1,
  cliente: {
    nombre: 'Juan Pérez',
    username: 'juanperez',
    
  },
  direccion: { 
    direccion: 'Av. Siempre Viva 123', 
    latitud: -34.6037, 
    longitud: -58.3816},
  platos: [
    {
      id: 1,
      nombre: 'Pizza Margarita',
      precio: 150.0,
      descripcion: 'Pizza clásica italiana',
      imagenUrl: 'images/pizza.jpg'
    },
    {
      id: 2,
      nombre: 'Hamburguesa Completa',
      precio: 120.0,
      descripcion: 'Hamburguesa con todos los ingredientes',
      imagenUrl: 'images/hamburguesa.jpg'
    }
  ],
  subtotal: 270.0,
  comisionDelivery: 30.0,
  incrementoPago: 10.0,
  total: 310.0,
  estado: 'Pendiente',
  medioDePago: 'Efectivo'
}

describe('+page.ts load - detalle pedido', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Carga exitosa de pedido', () => {
    it('devuelve los detalles del pedido cuando el service responde OK', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPedidoDetalle, status: 200 })
      
      const resultado = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(resultado).toBeDefined()
        expect(resultado.id).toBe(1)
        expect(resultado.cliente.nombre).toBe('Juan Pérez')
      })
    })

    it('devuelve los platos del pedido correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPedidoDetalle, status: 200 })
      
      const resultado = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(resultado.platos).toHaveLength(2)
        expect(resultado.platos[0].nombre).toBe('Pizza Margarita')
        expect(resultado.platos[1].nombre).toBe('Hamburguesa Completa')
      })
    })

    it('devuelve los datos del cliente correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPedidoDetalle, status: 200 })
      
      const resultado = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(resultado.cliente.nombre).toBe('Juan Pérez')
        expect(resultado.cliente.username).toBe('juanperez')
        expect(resultado.direccion.direccion).toBe('Av. Siempre Viva 123')
      })
    })

    it('devuelve los totales correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPedidoDetalle, status: 200 })
      
      const resultado = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(resultado.subtotal).toBe(270.0)
        expect(resultado.comisionDelivery).toBe(30.0)
        expect(resultado.incrementoPago).toBe(10.0)
        expect(resultado.total).toBe(310.0)
      })
    })

    it('devuelve el estado y medio de pago correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPedidoDetalle, status: 200 })
      
      const resultado = await load({ 
        params: { id: '1' } 
      } as Parameters<typeof load>[0])
      
      await waitFor(() => {
        expect(resultado.estado).toBe('Pendiente')
        expect(resultado.medioDePago).toBe('Efectivo')
      })
    })
  })

  describe('Validación de parámetros', () => {
    it('lanza error 400 cuando el id no es un número válido', async () => {
      try {
        await load({ 
          params: { id: 'abc' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(400)
        expect((error as { body: { message: string } }).body.message).toContain('inválido')
      }
    })

    it('lanza error 400 cuando el id es negativo', async () => {
      try {
        await load({ 
          params: { id: '-1' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(400)
      }
    })

    it('lanza error 400 cuando el id es cero', async () => {
      try {
        await load({ 
          params: { id: '0' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(400)
      }
    })
  })

  describe('Manejo de errores', () => {
    it('lanza error 404 cuando el pedido no existe', async () => {
      const axiosError = {
        response: { status: 404 }
      }
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValue(axiosError)
      
      try {
        await load({ 
          params: { id: '999' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(404)
      }
    })

    it('lanza error 400 para solicitud inválida', async () => {
      const axiosError = {
        response: { status: 400 }
      }
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValue(axiosError)
      
      try {
        await load({ 
          params: { id: '1' } 
        } as Parameters<typeof load>[0])
        expect.fail('Debería haber lanzado un error')
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(400)
      }
    })
  })
})