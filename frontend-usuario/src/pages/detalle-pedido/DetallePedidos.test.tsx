import theme from '@/styles/theme'
import { MemoryRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { expect, test, describe, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { ListaPedidos } from '@/pages/detalle-pedido/ListaPedidos'

vi.mock('@/components/PedidoCard', () => ({
  PedidoCard: () => <div data-testid="mock-pedido-card" />
}))

vi.mock('@/mocks/pedidos', () => ({ 
  MOCK_PEDIDOS: [
    { id: 1, local: { nombre: 'A' }, estadoDelPedido: 'PENDIENTE', platosDelPedido: [], costoTotalPedido: 1 },
    { id: 2, local: { nombre: 'B' }, estadoDelPedido: 'PENDIENTE', platosDelPedido: [], costoTotalPedido: 1 },
    { id: 3, local: { nombre: 'C' }, estadoDelPedido: 'PENDIENTE', platosDelPedido: [], costoTotalPedido: 1 },
    { id: 4, local: { nombre: 'D' }, estadoDelPedido: 'ENTREGADO', platosDelPedido: [], costoTotalPedido: 1 },
  ]
}))

describe('Lista y Detalle de Pedidos', () => {
  test('en la lista de pedidosaparecen las 3 pestañas -Pendientes, Completados, Cancelados-', async () => {
    render(
      <MemoryRouter>
        <ChakraProvider value={theme}>
          <ListaPedidos />
        </ChakraProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId('test-pendientes')).toBeTruthy()
    expect(screen.getByTestId('test-completados')).toBeTruthy()
    expect(screen.getByTestId('test-cancelados')).toBeTruthy()
  })

    test('los pedidos pendiente se mueven a cancelados después de ser cancelados', async () => {
    
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <ChakraProvider value={theme}>
          <ListaPedidos />
        </ChakraProvider>
      </MemoryRouter>
    )

    const pestañaPendientes = await screen.findByRole('tab', { name: /pendientes/i })
    const pestañaCompletados = await screen.findByRole('tab', { name: /completados/i })
    const pestañaCancelados = await screen.findByRole('tab', { name: /cancelados/i })

    await user.click(pestañaPendientes)
    const cardMoe = await screen.findByText('Taberna de Moe')
    const cardKrusty = await screen.findByText('Krusty Burger')
    const cardMensita = await screen.findByText('Mensita')

    expect(cardMoe).toBeTruthy()
    expect(cardKrusty).toBeTruthy()
    expect(cardMensita).toBeTruthy()

    
    const botonesCancelar = await screen.findAllByRole('button', { name: /cancelar pedido/i })
    expect(botonesCancelar).toHaveLength(2)

    const boton1 = botonesCancelar[0]
    const boton2 = botonesCancelar[1]

    await user.click(boton1)
    await user.click(boton2)

    screen.debug()


  })

  })

