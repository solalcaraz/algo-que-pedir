import theme from '@/styles/theme'
import { MemoryRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { ListaPedidos } from '@/pages/detalle-pedido/ListaPedidos'
import type { EstadoPedido, Pedido } from './Pedido'
import { cancelarPedidoService, getPedidosPorEstados } from '@/services/detallePedidoService'

vi.mock('@/services/detallePedidoService', () => ({
  getPedidosPorEstados: vi.fn(),
  cancelarPedidoService: vi.fn()
}))

const crearPedido = (id: number, nombreLocal: string, estadoPedido: EstadoPedido): Pedido => ({
  id,
  local: {
    idLocal: id,
    nombre: nombreLocal,
    urlImagenLocal: '',
    rating: 0,
    reviews: '',
    mediosDePago: [],
    tarifaEntrega: 0,
    recargosMedioDePago: {}
  },
  estadoPedido,
  fechaPedido: '1 de octubre',
  platosDelPedido: [],
  cantidadDePlatos: 1,
  costoTotalPedido: 100
})

const renderLista = () =>
  render(
    <MemoryRouter>
      <ChakraProvider value={theme}>
        <ListaPedidos />
      </ChakraProvider>
    </MemoryRouter>
  )

describe('Lista de pedidos del usuario', () => {
  beforeEach(() => {
    vi.mocked(getPedidosPorEstados).mockResolvedValue([
      crearPedido(1, 'Taberna de Moe', 'PENDIENTE'),
      crearPedido(2, 'Krusty Burger', 'PREPARADO')
    ])
    vi.mocked(cancelarPedidoService).mockResolvedValue(undefined)
  })

  test('muestra las pestañas Pendientes, Completados y Cancelados y arranca con los pendientes', async () => {
    renderLista()

    expect(screen.getByRole('tab', { name: /pendientes/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /completados/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /cancelados/i })).toBeTruthy()

    expect(await screen.findByText('Taberna de Moe')).toBeTruthy()
    expect(screen.getByText('Krusty Burger')).toBeTruthy()
    expect(getPedidosPorEstados).toHaveBeenCalledWith(['PENDIENTE', 'PREPARADO'])
  })

  test('al confirmar la cancelación, el pedido sale de la lista de pendientes', async () => {
    const user = userEvent.setup()
    renderLista()
    await screen.findByText('Taberna de Moe')

    const [cancelarMoe] = screen.getAllByRole('button', { name: /cancelar pedido/i })
    await user.click(cancelarMoe)
    await user.click(await screen.findByRole('button', { name: 'Sí' }))

    expect(cancelarPedidoService).toHaveBeenCalledWith(1)
    await waitFor(() => expect(screen.queryByText('Taberna de Moe')).toBeNull())
    expect(screen.getByText('Krusty Burger')).toBeTruthy()
  })
})
