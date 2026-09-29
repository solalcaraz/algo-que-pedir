// --- En src/mocks/pedidos.ts ---

import type { Pedido } from '@/pages/detalle-pedido/Pedido'

export const MOCK_PEDIDOS: Pedido[] = [
  {
    id: 1,
    local: {
      id: 101,
      nombre: 'Taberna de Moe',
      urlImagenLocal: 'https://static.wikia.nocookie.net/simpsons/images/c/c6/Moe%27s_Tavern.png',
    },
    estadoDelPedido: 'PENDIENTE',
    fechaPedido: '08/11/2025',
    platosDelPedido: [{}, {}],
    costoTotalPedido: 15000.00,
  },
  
  {
    id: 2,
    local: {
      id: 102,
      nombre: 'Krusty Burger',
      urlImagenLocal: 'https://www.universalorlando.com/webdata/k2/es/us/files/Images/gds/usf-krusty-burger-logo-b.png',
    },
    estadoDelPedido: 'PENDIENTE',
    fechaPedido: '08/11/2025',
    platosDelPedido: [{}, {}, {}, {}],
    costoTotalPedido: 9800.00,
  },

  {
    id: 3,
    local: {
      id: 103,
      nombre: 'Guerrín',
      urlImagenLocal: 'https://cloudfront-us-east-1.images.arcpublishing.com/elcronista/6NKPVBQT3ZG2POCEAIKLKUMQQE.jpg',
    },
    estadoDelPedido: 'ENTREGADO',
    fechaPedido: '07/11/2025',
    platosDelPedido: [{}],
    costoTotalPedido: 27000.00,
  },

  {
    id: 4,
    local: {
      id: 104,
      nombre: 'Mensita',
      urlImagenLocal: 'https://pbs.twimg.com/media/EeBtZCAWkAQcLJZ.jpg',
    },
    estadoDelPedido: 'CANCELADO',
    fechaPedido: '06/11/2025',
    platosDelPedido: [{}],
    costoTotalPedido: 7500,
  }
]