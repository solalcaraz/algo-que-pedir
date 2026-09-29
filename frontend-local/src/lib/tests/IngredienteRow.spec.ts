import { render, screen, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import IngredienteRow from '../components/ingredientes/IngredienteRow.svelte'
import { Ingrediente } from '../models/ingrediente.svelte'
import { createRawSnippet } from 'svelte'
import palta from '$lib/assets/palta.svg'
import cow from '$lib/assets/cow.svg'

const tomate = new Ingrediente()
tomate.id = 1
tomate.nombre = 'Tomate'
tomate.grupoAlimenticio = 'Frutas y verduras'
tomate.origenAnimal = 'vegetal'

describe('IngredienteRow', () => {
  it('debe renderizar la informacion del ingrediente', () => {
    render(IngredienteRow, { ingrediente: tomate })

    expect(screen.getByTestId('nombre-1')).toHaveTextContent('Tomate')
    expect(screen.getByTestId('grupo-1')).toHaveTextContent('Frutas y verduras')
    const origenCell = screen.getByTestId('origen-1')
    const img = within(origenCell).getByRole('img')
    expect(img).toHaveAttribute('src', palta)
  })

  it('debe llamar a la funcion eliminar cuando se hace click en el boton de eliminar', async () => {
    const eliminarMock = vi.fn()
    render(IngredienteRow, { ingrediente: tomate, eliminar: eliminarMock })

    const botonEliminar = screen.getByRole('button')
    await userEvent.click(botonEliminar)

    expect(eliminarMock).toHaveBeenCalledTimes(1)
  })

  it('debe renderizar las columnas extra', () => {
    render(IngredienteRow, {
      ingrediente: tomate,
      columnasExtra: createRawSnippet(() => ({ render: () => `<td>Columna extra</td>` }))
    })

    expect(screen.getByText('Columna extra')).toBeInTheDocument()
  })

  it('debe renderizar las acciones extra y no el boton de eliminar', () => {
    render(IngredienteRow, {
      ingrediente: tomate,
      acciones: createRawSnippet(() => ({ render: () => `<button>Accion extra</button>` }))
    })

    expect(screen.getByText('Accion extra')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /eliminar/i })).not.toBeInTheDocument()
  })

  it('debe renderizar los snippets de columnasExtra y acciones', () => {
    render(IngredienteRow, {
      ingrediente: tomate,
      columnasExtra: createRawSnippet(() => ({ render: () => `<td>Mock Columna</td>` })),
      acciones: createRawSnippet(() => ({ render: () => `<td>Mock Accion</td>` }))
    })

    expect(screen.getByText('Mock Columna')).toBeInTheDocument()
    expect(screen.getByText('Mock Accion')).toBeInTheDocument()
  })

  it('debe renderizar el icono de origen animal', () => {
    const carne = new Ingrediente()
    carne.id = 2
    carne.origenAnimal = 'animal'
    render(IngredienteRow, { ingrediente: carne })

    const origenCell = screen.getByTestId('origen-2')
    const img = within(origenCell).getByRole('img')
    expect(img).toHaveAttribute('src', cow)
  })

  it('debe aplicar atributos extra a la fila tr', () => {
    render(IngredienteRow, { ingrediente: tomate, class: 'fila-especial' })

    expect(screen.getByRole('row')).toHaveClass('fila-especial')
  })
})
