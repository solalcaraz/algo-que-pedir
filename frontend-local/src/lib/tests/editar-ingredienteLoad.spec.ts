import { describe, expect, it, vi } from 'vitest'
import { load } from '../../routes/(app)/editar-ingrediente/[id]/+page'

vi.mock('axios')

vi.mock('@sveltejs/kit', () => ({
  redirect: vi.fn()
}))

import { redirect } from '@sveltejs/kit'
import axios from 'axios'

describe('Load de editar-ingrediente', () => {
  it('para un ingrediente nuevo lo crea', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: {} })
    const { ingrediente, nuevoIngrediente, readOnly } = await load({ params: { id: 'nuevo' }, url: new URL('http://localhost') } as unknown as Parameters<typeof load>[0])
    expect(ingrediente.nombre).toBe('')
    expect(ingrediente.costoMercado).toBe(0)
    expect(ingrediente.grupoAlimenticio).toBe('')
    expect(ingrediente.origenAnimal).toBe('vegetal')
    expect(nuevoIngrediente).toBe(true)
    expect(readOnly).toBe(false)
  })

  it('para un ingrediente existente lo carga', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: {
      id: 1,
      nombre: 'Tomate',
      costoMercado: 0.5,
      grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
      origenAnimal: false,
    }, status: 200 })

    const { ingrediente, nuevoIngrediente, readOnly } = await load({ params: { id: '1' }, url: new URL('http://localhost') } as unknown as Parameters<typeof load>[0])
    expect(ingrediente.id).toBe(1)
    expect(ingrediente.nombre).toBe('Tomate')
    expect(ingrediente.costoMercado).toBe(0.5)
    expect(ingrediente.grupoAlimenticio).toBe('Frutas y verduras')
    expect(ingrediente.origenAnimal).toBe('vegetal')
    expect(nuevoIngrediente).toBe(false)
    expect(readOnly).toBe(false)
  })

  it('para un ingrediente existente lo carga en modo lectura', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: {
      id: 1,
      nombre: 'Tomate',
      costoMercado: 0.5,
      grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
      origenAnimal: false,
    }, status: 200 })

    const { ingrediente, nuevoIngrediente, readOnly } = await load({ params: { id: '1' }, url: new URL('http://localhost?readOnly=true') } as unknown as Parameters<typeof load>[0])
    expect(ingrediente.id).toBe(1)
    expect(ingrediente.nombre).toBe('Tomate')
    expect(ingrediente.costoMercado).toBe(0.5)
    expect(ingrediente.grupoAlimenticio).toBe('Frutas y verduras')
    expect(ingrediente.origenAnimal).toBe('vegetal')
    expect(nuevoIngrediente).toBe(false)
    expect(readOnly).toBe(true)
  })

  it('para un ingrediente inexistente lanza error y va a página de error', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce({ status: 404, message: 'Ingrediente no encontrado' })
    await expect(load({ params: { id: '555' }, url: new URL('http://localhost') } as unknown as Parameters<typeof load>[0])).rejects.toEqual(redirect(302, '/ingrediente'))
  })
})    