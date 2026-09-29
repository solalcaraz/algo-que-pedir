import { render, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import DetallePedidoPage from '../../routes/(app)/detalle-pedido/[id]/+page.svelte'
import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

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
    },
    {
      id: 2,
      nombre: 'Hamburguesa Completa',
      precio: 120.0,
      descripcion: 'Hamburguesa con todos los ingredientes',
      imagenUrl: 'images/hamburguesa.jpg'
    },
    {
      id: 2,
      nombre: 'Hamburguesa Completa',
      precio: 120.0,
      descripcion: 'Hamburguesa con todos los ingredientes',
      imagenUrl: 'images/hamburguesa.jpg'
    }
  ],
  subtotal: 390.0,
  comisionDelivery: 30.0,
  incrementoPago: 10.0,
  total: 430.0,
  estado: 'Pendiente',
  medioDePago: 'Efectivo'
}

describe('Página de detalle de pedido', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderización de información básica', () => {
    it('debería renderizar el número de pedido', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText(/Pedido #1/i)).toBeInTheDocument()
    })

    it('debería mostrar el estado del pedido', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Estado del Pedido')).toBeInTheDocument()
      expect(getByText('Pendiente')).toBeInTheDocument()
    })

    it('debería mostrar el badge con el color correcto para estado Pendiente', () => {
      const { container } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const badge = container.querySelector('.estado-badge')
      expect(badge).toHaveStyle({ backgroundColor: '#ff9800' })
    })

    it('debería mostrar el badge con el color correcto para estado Entregado', () => {
      const pedidoEntregado = { ...mockPedidoDetalle, estado: 'ENTREGADO' }
      const { container } = render(DetallePedidoPage, { data: pedidoEntregado })
  
      const badge = container.querySelector('.estado-badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveStyle({ backgroundColor: '#4caf50'})
    })

    it('debería mostrar el badge con el color correcto para estado Cancelado', () => {
      const pedidoCancelado = { ...mockPedidoDetalle, estado: 'CANCELADO' }
      const { container } = render(DetallePedidoPage, { data: pedidoCancelado })
      
      const badge = container.querySelector('.estado-badge')
      expect(badge).toHaveStyle({ backgroundColor: '#f44336' })
    })
  })

  describe('Información del cliente', () => {
    it('debería mostrar el nombre del cliente', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Juan Pérez')).toBeInTheDocument()
    })

    it('debería mostrar el username del cliente', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('juanperez')).toBeInTheDocument()
    })

    it('debería mostrar la dirección de entrega', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Av. Siempre Viva 123')).toBeInTheDocument()
    })

    it('debería renderizar la sección de cliente', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Cliente')).toBeInTheDocument()
    })

    it('debería renderizar la sección de dirección de entrega', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Dirección de entrega')).toBeInTheDocument()
    })
  })

  describe('Resumen del pedido', () => {
    it('debería mostrar todos los platos', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Pizza Margarita')).toBeInTheDocument()
      expect(getByText('Hamburguesa Completa')).toBeInTheDocument()
    })

    it('debería agrupar platos duplicados y mostrar cantidad', async () => {
      render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      await waitFor(() => {
        // Debe haber 2 filas: 1 para pizza (cantidad 1) y 1 para hamburguesa (cantidad 2)
        const rows = document.querySelectorAll('tbody tr')
        expect(rows).toHaveLength(2)
      })
    })

    it('debería mostrar las descripciones de los platos', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Pizza clásica italiana')).toBeInTheDocument()
      expect(getByText('Hamburguesa con todos los ingredientes')).toBeInTheDocument()
    })

    it('debería mostrar los precios formateados correctamente', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('$150.00')).toBeInTheDocument()
      expect(getByText('$120.00')).toBeInTheDocument()
    })

    it('debería mostrar las imágenes de los platos', () => {
      const { container } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const images = container.querySelectorAll('img.icono')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('Información de pago', () => {
    it('debería mostrar el subtotal', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Subtotal')).toBeInTheDocument()
      expect(getByText('$390.00')).toBeInTheDocument()
    })

    it('debería mostrar la comisión del delivery', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Comisión del delivery')).toBeInTheDocument()
      expect(getByText('$30.00')).toBeInTheDocument()
    })

    it('debería mostrar el incremento por tipo de pago cuando existe', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Incremento por tipo de pago')).toBeInTheDocument()
      expect(getByText('$10.00')).toBeInTheDocument()
    })

    it('no debería mostrar incremento por tipo de pago cuando es 0', () => {
      const pedidoSinIncremento = { ...mockPedidoDetalle, incrementoPago: 0 }
      const { queryByText } = render(DetallePedidoPage, { data: pedidoSinIncremento })
      
      expect(queryByText('Incremento por tipo de pago')).not.toBeInTheDocument()
    })

    it('debería mostrar el total', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Total')).toBeInTheDocument()
      expect(getByText('$430.00')).toBeInTheDocument()
    })

    it('debería destacar visualmente el total', () => {
      const { container } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const totalLabel = container.querySelector('.total-label')
      const totalAmount = container.querySelector('.total-amount')
      
      expect(totalLabel).toBeInTheDocument()
      expect(totalAmount).toBeInTheDocument()
    })
  })

  describe('Método de pago', () => {
    it('debería mostrar el método de pago', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Método de Pago')).toBeInTheDocument()
      expect(getByText(/Pago con Efectivo/i)).toBeInTheDocument()
    })

    it('debería mostrar el icono del método de pago', () => {
      const { container } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const iconoPago = container.querySelector('.metodo-pago img.icono')
      expect(iconoPago).toBeInTheDocument()
    })
  })

  describe('Navegación', () => {
    it('debería tener un botón volver', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const btnVolver = getByText('Volver')
      expect(btnVolver).toBeInTheDocument()
    })

    it('debería navegar atrás al hacer click en volver', async () => {
      const historySpy = vi.spyOn(window.history, 'back')
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      const btnVolver = getByText('Volver')
      await userEvent.click(btnVolver)
      
      expect(historySpy).toHaveBeenCalled()
    })
  })

  describe('Tabla de platos', () => {
    it('debería mostrar las columnas correctas', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Plato')).toBeInTheDocument()
      expect(getByText('Cantidad')).toBeInTheDocument()
      expect(getByText('Precio')).toBeInTheDocument()
    })

    it('debería mostrar el resumen del pedido como título', () => {
      const { getByText } = render(DetallePedidoPage, { data: mockPedidoDetalle })
      
      expect(getByText('Resumen del Pedido')).toBeInTheDocument()
    })
  })

  describe('Casos edge', () => {
    it('debería manejar un pedido sin platos', () => {
      const pedidoVacio = { ...mockPedidoDetalle, platos: [] }
      const { container } = render(DetallePedidoPage, { data: pedidoVacio })
      
      const rows = container.querySelectorAll('tbody tr')
      expect(rows).toHaveLength(0)
    })

    it('debería manejar platos con precio 0', () => {
      const pedidoPrecio0 = {
        ...mockPedidoDetalle,
        platos: [{
          id: 3,
          nombre: 'Plato Gratis',
          precio: 0,
          descripcion: 'Promoción',
          imagenUrl: 'images/gratis.jpg'
        }]
      }
      const { getByText } = render(DetallePedidoPage, { data: pedidoPrecio0 })
      
      expect(getByText('$0.00')).toBeInTheDocument()
    })

    it('debería manejar direcciones largas', () => {
      const pedidoDireccionLarga = {
        ...mockPedidoDetalle,
        cliente: {
          ...mockPedidoDetalle.cliente,
          
        },
        direccion: { direccion: 'Avenida de los Constituyentes 1234, Piso 5, Departamento B, Ciudad Autónoma de Buenos Aires', latitud: -34.6037, longitud: -58.3816}
      }
      const { getByText } = render(DetallePedidoPage, { data: pedidoDireccionLarga })
      
      expect(getByText(/Avenida de los Constituyentes/i)).toBeInTheDocument()
    })
  })
})