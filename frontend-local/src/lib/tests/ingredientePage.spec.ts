import { waitFor, render, type SvelteComponentOptions } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import IngredientePage from '../../routes/(app)/ingrediente/+page.svelte'
import { Ingrediente } from '$lib/models/ingrediente.svelte'

vi.mock('axios')
vi.mock('$lib/utils/errorHandler', () => ({
  showError: vi.fn()
}))
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn().mockResolvedValue(true)
}))
vi.mock('$lib/utils/toasts/toasts', () => ({
  showToast: vi.fn()
}))

import axios from 'axios'

import { invalidate, goto } from '$app/navigation'
import type { Component } from 'svelte'
import type { PageProps } from '../../routes/(app)/ingrediente/$types'
import { showError } from '$lib/utils/errorHandler'
import { showToast } from '$lib/utils/toasts/toasts'

let defaultData: SvelteComponentOptions<Component<PageProps>>

const tomate = new Ingrediente()
tomate.id = 1
tomate.nombre = 'Tomate'
tomate.costoMercado = 0.5
tomate.grupoAlimenticio = 'Frutas y verduras'
tomate.origenAnimal = 'vegetal'

const arroz = new Ingrediente()
arroz.id = 2
arroz.nombre = 'Arroz'
arroz.costoMercado = 1.2
arroz.grupoAlimenticio = 'Cereales y tubérculos'
arroz.origenAnimal = 'vegetal'

const pollo = new Ingrediente()
pollo.id = 3
pollo.nombre = 'Pechuga de pollo'
pollo.costoMercado = 3.5
pollo.grupoAlimenticio = 'Proteínas'
pollo.origenAnimal = 'animal'

const mockIngredientes: () => Ingrediente[] = () => [tomate, arroz, pollo]

const mockInvalidate: (rerender: (props: Partial<PageProps>) => Promise<void>, updatedList: Ingrediente[])=>void = (rerender, updatedList) => {
  vi.mocked(invalidate).mockImplementationOnce(async () => {
    await rerender({data: {ingredientes: updatedList}, params: {}})
  })
}

describe('Pagina de ingredientes', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    defaultData = { data: { ingredientes: mockIngredientes() }, params: {} }
  })

  it ('renderiza las filas con ingredientes', async () => {
    const { getByTestId } = render(IngredientePage, defaultData)

    await waitFor(() => {
      expect(getByTestId('ingrediente-1')).toBeInTheDocument()
      expect(getByTestId('ingrediente-2')).toBeInTheDocument()
      expect(getByTestId('ingrediente-3')).toBeInTheDocument()
    })
  })
  
  it('renderiza los precios correctamente', async () => {
    const { getByTestId } = render(IngredientePage, defaultData)
    
    await waitFor(() => {
      expect(getByTestId('costo-1').textContent).toBe('$0.50')
      expect(getByTestId('costo-2').textContent).toBe('$1.20')
      expect(getByTestId('costo-3').textContent).toBe('$3.50')
    })
  })

  it('Crear Ingrediente navega a /editar-ingrediente/nuevo', async () => {
    const { getByTestId } = render(IngredientePage, defaultData)
    
    const botonCrear = await waitFor(() => getByTestId('crear'))
    await userEvent.click(botonCrear)
    expect(vi.mocked(goto)).toHaveBeenCalledWith('/editar-ingrediente/nuevo')
  })

  it('Click en editar navega a editar-ingrediente/:id', async () => {
    const { getByTestId } = render(IngredientePage, defaultData)

    const botonEditar = await waitFor(() => getByTestId('editar-2'))
    await userEvent.click(botonEditar)
    expect(vi.mocked(goto)).toHaveBeenCalledWith('/editar-ingrediente/2?readOnly=false')
  })

  it('Click en ver navega a editar-ingrediente/:id con readOnly=true', async () => {
    const { getByTestId } = render(IngredientePage, defaultData)

    const botonVer = await waitFor(() => getByTestId('ver-2'))
    await userEvent.click(botonVer)
    expect(vi.mocked(goto)).toHaveBeenCalledWith('/editar-ingrediente/2?readOnly=true')
  })

  it('Eliminar el ingrediente elimina, invalida, ingrediente deja de estar en la lista y muestra toast', async () => {
    const ingredientes = mockIngredientes()
    vi.mocked(axios.delete).mockResolvedValue({ data: ingredientes[1], status: 200})
    const { getByTestId, queryByTestId, rerender } = render(IngredientePage, defaultData)
    const updatedList = [
      Object.assign(new Ingrediente(), ingredientes[0]),
      Object.assign(new Ingrediente(), ingredientes[2])
    ]
    mockInvalidate(rerender, updatedList)
    const botonEliminar = await waitFor(() => getByTestId('eliminar-2'))
    await userEvent.click(botonEliminar)
    await waitFor(() => {
      expect(queryByTestId('costo-2')).toBeNull()
      expect(invalidate).toHaveBeenCalledWith('ingredientes:list')
      expect(showToast).toHaveBeenCalledWith('Ingrediente eliminado con éxito', 'success')
    })
  })

  it('Fallo al eliminar ingrediente muestra showError y luego invalida', async () => {
    vi.mocked(axios.delete).mockRejectedValue({ error: { repsponse: { data: { message: 'Unexpecteed error'}}}, status: 400})
    const { getByTestId } = render(IngredientePage, defaultData)

    const botonEliminar = await waitFor(() => getByTestId('eliminar-2'))
    await userEvent.click(botonEliminar)
    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Error al eliminar el ingrediente', expect.anything())
    })
  })
})