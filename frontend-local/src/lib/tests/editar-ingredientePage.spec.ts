import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor, screen } from '@testing-library/svelte'
import Page from '../../routes/(app)/editar-ingrediente/[id]/+page.svelte'
import { Ingrediente } from '$lib/models/ingrediente.svelte'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { tick } from 'svelte'

vi.mock('axios')
vi.mock('$lib/utils/errorHandler', () => ({
  showError: vi.fn()
}))
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

import axios from 'axios'
import { showError } from '$lib/utils/errorHandler'
import { REST_SERVER_URL } from '$lib/services/configuration'
import { goto } from '$app/navigation'

describe('Crear un nuevo ingrediente', () => {
  it('Al abrir la página debe mostrar un ingrediente vacío y las accinoes', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente: new Ingrediente(),
          nuevoIngrediente: true,
          readOnly: false,
        },
      }
    })

    const matchValue = (value: string, testid: string) => expect((getByTestId(testid) as HTMLInputElement).value).toBe(value)
    matchValue('', 'nombre')
    matchValue('0', 'costo')
    matchValue('', 'grupo')

    const origenSwitch = screen.getByTestId('origen')
    expect(origenSwitch).not.toBeChecked()

    const botonCrear = getByTestId('btnGuardar')
    expect(botonCrear.textContent).toBe('Crear ingrediente')
    expect(getByTestId('titulo').textContent).toBe('Nuevo Ingrediente')
  })

  it('Se muestran correctamente los errores de validación en fallo', async () => {
    const ingrediente = new Ingrediente()
    ingrediente.nombre = ''
    ingrediente.costoMercado = -2
    ingrediente.grupoAlimenticio = ''
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: true,
          readOnly: false,
        },
      }
    })

    const botonGuardar = getByTestId('btnGuardar')
    await userEvent.click(botonGuardar)

    expect(getByTestId('errorMessage-nombre').textContent).toBe('Debe ingresar un nombre para el ingrediente')
    expect(getByTestId('errorMessage-costoMercado').textContent).toBe('Debe ingresar un costo válido y mayor a 0')
    expect(getByTestId('errorMessage-grupoAlimenticio').textContent).toBe('Debe seleccionar un grupo alimenticio')
  })

  it('Si el ingrediente no tiene errores al clickear el botón debe enviarlo al backend', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente: new Ingrediente(),
          nuevoIngrediente: true,
          readOnly: false,
        },
      }
    })

    const type = async (testid: string, value: string) => {
      const input = getByTestId(testid) as HTMLInputElement
      await userEvent.clear(input)
      await userEvent.type(input, value)
    }
    await type('nombre', 'Tomate')
    await type('costo', '50')
    await userEvent.selectOptions(getByTestId('grupo'), 'Frutas y verduras')
    await userEvent.click(getByTestId('origen'))

    await tick()

    const botonGuardar = getByTestId('btnGuardar')
    await userEvent.click(botonGuardar)

    expect(axios.post).toHaveBeenCalledWith(`${REST_SERVER_URL}/ingrediente`, {
      nombre: 'Tomate',
      costoMercado: 50,
      grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
      origenAnimal: true
    })
    expect(goto).toHaveBeenCalledWith('/ingrediente')
  })
})

describe('Actualizar un nuevo ingrediente', () => {
  let ingrediente: Ingrediente

  beforeEach(() => {
    ingrediente = new Ingrediente()
    ingrediente.nombre = 'TestIngrediente'
    ingrediente.costoMercado = 23
    ingrediente.grupoAlimenticio = 'Azúcares y dulces'
    ingrediente.origenAnimal = 'animal'
  })

  it('Al iniciar la página debe mostrar la info del ingrediente y las acciones', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: false,
        },
      }
    })

    const matchValue = (value: string, testid: string) => expect((getByTestId(testid) as HTMLInputElement).value).toBe(value)
    matchValue('TestIngrediente', 'nombre')
    matchValue('23', 'costo')
    matchValue('Azúcares y dulces', 'grupo')

    const origenSwitch = screen.getByTestId('origen')
    expect(origenSwitch).toBeChecked()

    const botonGuardar = getByTestId('btnGuardar')
    expect(botonGuardar.textContent).toBe('Guardar cambios')
    expect(getByTestId('titulo').textContent).toBe('Editar Ingrediente')
  })

  it('Si el ingrediente tiene errores de validación debe mostrarlos', async () => {
    const ingrediente = new Ingrediente()
    ingrediente.costoMercado = -3
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: false,
        },
      }
    })

    const botonGuardar = getByTestId('btnGuardar')
    await userEvent.click(botonGuardar)

    expect(getByTestId('errorMessage-nombre').textContent).toBe('Debe ingresar un nombre para el ingrediente')
    expect(getByTestId('errorMessage-costoMercado').textContent).toBe('Debe ingresar un costo válido y mayor a 0')
    expect(getByTestId('errorMessage-grupoAlimenticio').textContent).toBe('Debe seleccionar un grupo alimenticio')
  })

  it('si el ingrediente no tiene errores al guardar se envía al back', async () => {
    const ingrediente =  new Ingrediente()
    ingrediente.id = 2
    ingrediente.nombre = 'TestIngrediente'
    ingrediente.costoMercado = 32
    ingrediente.grupoAlimenticio = 'Azúcares y dulces'
    ingrediente.origenAnimal = 'vegetal'
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: false,
        },
      }
    })

    const inputNombre = getByTestId('nombre') as HTMLInputElement
    await userEvent.clear(inputNombre)
    await userEvent.type(inputNombre, 'Nombre Cambiado')

    await tick()

    const botonGuardar = getByTestId('btnGuardar')
    await userEvent.click(botonGuardar)

    expect(axios.put).toHaveBeenCalledWith(`${REST_SERVER_URL}/ingrediente/2`, {
      id: 2,
      nombre: 'Nombre Cambiado',
      costoMercado: 32,
      grupoAlimenticio: 'AZUCARES_Y_DULCES',
      origenAnimal: false
    })
    expect(goto).toHaveBeenCalledWith('/ingrediente')
  })

  it('si el ingrediente falla al actualizar debe mostrar un mensaje de error', async() => {
    const ingrediente =  new Ingrediente()
    ingrediente.id = 2
    ingrediente.nombre = 'TestIngrediente'
    ingrediente.costoMercado = 32
    ingrediente.grupoAlimenticio = 'Azúcares y dulces'
    ingrediente.origenAnimal = 'vegetal'
    vi.mocked(axios.put).mockRejectedValue({ data: ingrediente, status: 500 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: false,
        },
      }
    })

    const inputNombre = getByTestId('nombre') as HTMLInputElement
    await userEvent.clear(inputNombre)
    await userEvent.type(inputNombre, 'Nombre Cambiado')

    await tick()

    const botonGuardar = getByTestId('btnGuardar')
    await userEvent.click(botonGuardar)

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Error al actualizar el ingrediente', expect.anything())
    })
  })
})

describe('Visualización de ingrediente en modo lectura', () => {
  let ingrediente: Ingrediente

  beforeEach(() => {
    ingrediente = new Ingrediente()
    ingrediente.nombre = 'Tomate'
    ingrediente.costoMercado = 0.5
    ingrediente.grupoAlimenticio = 'Frutas y verduras'
    ingrediente.origenAnimal = 'vegetal'
  })

  it('Al abrir la página en modo lectura debe mostrar el título Detalle Ingrediente', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: true,
        },
      }
    })
    expect(getByTestId('titulo').textContent).toBe('Detalle Ingrediente')
  })

  it('Los campos de entrada deben estar deshabilitados', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: true,
        },
      }
    })

    expect(getByTestId('nombre')).toBeDisabled()
    expect(getByTestId('costo')).toBeDisabled()
    expect(getByTestId('grupo')).toBeDisabled()
    expect(getByTestId('origen')).toBeDisabled()
  })

  it('Los botones de acción no deben estar presentes', async () => {
    const { queryByTestId } = render(Page, {
      props: {
        data: {
          ingrediente,
          nuevoIngrediente: false,
          readOnly: true,
        },
      }
    })

    expect(queryByTestId('btnGuardar')).not.toBeInTheDocument()
    expect(queryByTestId('btnDescartar')).not.toBeInTheDocument()
  })
})