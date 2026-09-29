import axios from 'axios'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { getPedidosPorEstados } from './detallePedidoService'

vi.mock('axios')

describe('getPedidosPorEstados', () => {
  afterEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  test('usa el usuario logueado al momento de la consulta, no el que había al cargar la app', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] })

    localStorage.setItem('idUsuario', '3')
    await getPedidosPorEstados(['PENDIENTE'])

    expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/usuarios/3/pedidos', { params: { estado: 'PENDIENTE' } })
  })
})
