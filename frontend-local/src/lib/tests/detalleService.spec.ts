import { beforeEach, describe, expect, it, vi } from 'vitest'
import { detalleService } from '$lib/services/detalleService'
import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'
import axios from 'axios'

vi.mock('axios')

const mockPedidoDetalle: PedidoDetalleDTO = {
  id: 1,
  cliente: {
    nombre: 'Juan Pérez',
    username: 'juanperez'
  },
  direccion: { 
    direccion: 'Av. Siempre Viva 123', 
    latitud: -34.6037, 
    longitud: -58.3816
  },
  platos: [
    {
      id: 1,
      nombre: 'Pizza Margarita',
      precio: 150.0,
      descripcion: 'Pizza clásica italiana',
      imagenUrl: 'images/pizza.jpg'
    }
  ],
  subtotal: 150.0,
  comisionDelivery: 30.0,
  incrementoPago: 10.0,
  total: 190.0,
  estado: 'Pendiente',
  medioDePago: 'Efectivo'
}

describe('DetalleService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('obtenerDetallePedido', () => {
    it('debería obtener los detalles de un pedido correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: mockPedidoDetalle,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/detalle-pedido/1')
      expect(resultado).toEqual(mockPedidoDetalle)
    })

    it('debería llamar al endpoint correcto con el id proporcionado', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: mockPedidoDetalle,
        status: 200
      })

      await detalleService.obtenerDetallePedido(42)

      expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/detalle-pedido/42')
    })

    it('debería retornar todos los campos del pedido', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: mockPedidoDetalle,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.id).toBe(1)
      expect(resultado.cliente).toBeDefined()
      expect(resultado.platos).toBeDefined()
      expect(resultado.subtotal).toBe(150.0)
      expect(resultado.comisionDelivery).toBe(30.0)
      expect(resultado.incrementoPago).toBe(10.0)
      expect(resultado.total).toBe(190.0)
      expect(resultado.estado).toBe('Pendiente')
      expect(resultado.medioDePago).toBe('Efectivo')
    })

    it('debería retornar la información del cliente correctamente', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: mockPedidoDetalle,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.cliente.nombre).toBe('Juan Pérez')
      expect(resultado.cliente.username).toBe('juanperez')
      expect(resultado.direccion.direccion).toBe('Av. Siempre Viva 123')
    })

    it('debería retornar los platos del pedido', async () => {
      const pedidoConVariosPlatos = {
        ...mockPedidoDetalle,
        platos: [
          {
            id: 1,
            nombre: 'Pizza Margarita',
            precio: 150.0,
            descripcion: 'Pizza clásica',
            imagenUrl: 'images/pizza.jpg'
          },
          {
            id: 2,
            nombre: 'Hamburguesa',
            precio: 120.0,
            descripcion: 'Hamburguesa completa',
            imagenUrl: 'images/hamburguesa.jpg'
          }
        ]
      }

      vi.mocked(axios.get).mockResolvedValue({
        data: pedidoConVariosPlatos,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.platos).toHaveLength(2)
      expect(resultado.platos[0].nombre).toBe('Pizza Margarita')
      expect(resultado.platos[1].nombre).toBe('Hamburguesa')
    })

    it('debería manejar un pedido sin incremento de pago', async () => {
      const pedidoSinIncremento = {
        ...mockPedidoDetalle,
        incrementoPago: 0
      }

      vi.mocked(axios.get).mockResolvedValue({
        data: pedidoSinIncremento,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.incrementoPago).toBe(0)
    })

    it('debería manejar diferentes estados de pedido', async () => {
      const pedidoEntregado = {
        ...mockPedidoDetalle,
        estado: 'Entregado'
      }

      vi.mocked(axios.get).mockResolvedValue({
        data: pedidoEntregado,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.estado).toBe('Entregado')
    })

    it('debería manejar diferentes medios de pago', async () => {
      const pedidoTarjeta = {
        ...mockPedidoDetalle,
        medioDePago: 'Tarjeta de Crédito'
      }

      vi.mocked(axios.get).mockResolvedValue({
        data: pedidoTarjeta,
        status: 200
      })

      const resultado = await detalleService.obtenerDetallePedido(1)

      expect(resultado.medioDePago).toBe('Tarjeta de Crédito')
    })

    it('debería propagar errores cuando el pedido no existe', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Pedido no encontrado' }
        }
      })

      await expect(detalleService.obtenerDetallePedido(999)).rejects.toThrow()
    })

    it('debería propagar errores de servidor', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      })

      await expect(detalleService.obtenerDetallePedido(1)).rejects.toThrow()
    })

    it('debería propagar errores de red', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

      await expect(detalleService.obtenerDetallePedido(1)).rejects.toThrow()
    })
  })
})