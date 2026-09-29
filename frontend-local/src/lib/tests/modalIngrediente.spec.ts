import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import ModalIngredientes from '../utils/modales/ListaIngredientes/ModalIngredientes.svelte'
import { INGREDIENTES_MOCK } from '$lib/data/mocks/ingredientesMock'
import type { Ingrediente } from '$lib/models/ingrediente.svelte'

vi.mock('$lib/services/ingredienteService')
vi.mock('$lib/utils/errorHandler', () => ({
  showError: vi.fn()
}))

import { ingredientesService } from '$lib/services/ingredienteService'
import { showError } from '$lib/utils/errorHandler'

describe('ModalIngredientes', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Carga inicial de ingredientes', () => {
    it('debería mostrar mensaje de carga inicialmente', () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockImplementation(
        () => new Promise(() => {}) // Promise que nunca se resuelve
      )

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      expect(getByText('Cargando ingredientes...')).toBeTruthy()
    })

    it('debería cargar todos los ingredientes correctamente', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
        expect(getByText('Pechuga de pollo')).toBeTruthy()
        expect(getByText('Arroz')).toBeTruthy()
        expect(getByText('Leche')).toBeTruthy()
        expect(getByText('Palta')).toBeTruthy()
      })
    })

    it('debería mostrar error si falla la carga de ingredientes', async () => {
      const error = new Error('Error de conexión')
      vi.mocked(ingredientesService.todosLosIngredientes).mockRejectedValue(error)

      render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith('Error al cargar ingredientes', error)
      })
    })
  })

  describe('Filtrado de ingredientes disponibles', () => {
    it('debería mostrar todos los ingredientes si no hay ingredientes actuales', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
        expect(getByText('Pechuga de pollo')).toBeTruthy()
        expect(getByText('Arroz')).toBeTruthy()
        expect(getByText('Leche')).toBeTruthy()
        expect(getByText('Palta')).toBeTruthy()
      })
    })

    it('debería filtrar ingredientes que ya están en el plato', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const ingredientesActuales = [INGREDIENTES_MOCK[0], INGREDIENTES_MOCK[2]] // Tomate y Arroz

      const { getByText, queryByText } = render(ModalIngredientes, {
        ingredientesActuales,
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        // No deberían aparecer los ingredientes actuales
        expect(queryByText('Tomate')).toBeNull()
        expect(queryByText('Arroz')).toBeNull()
        
        // Deberían aparecer los demás
        expect(getByText('Pechuga de pollo')).toBeTruthy()
        expect(getByText('Leche')).toBeTruthy()
        expect(getByText('Palta')).toBeTruthy()
      })
    })

    it('debería mostrar mensaje cuando no hay ingredientes disponibles', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      // Todos los ingredientes ya están en el plato
      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: INGREDIENTES_MOCK,
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('No hay más ingredientes disponibles')).toBeTruthy()
      })
    })
  })

  describe('Selección de ingredientes', () => {
    it('debería permitir seleccionar un ingrediente', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      // Buscar el checkbox del ingrediente Tomate
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      const tomateCheckbox = checkboxes[0] as HTMLInputElement

      await userEvent.click(tomateCheckbox)

      await waitFor(() => {
        expect(getByText('1 ingrediente seleccionado')).toBeTruthy()
      })
    })

    it('debería permitir seleccionar múltiples ingredientes', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      
      await userEvent.click(checkboxes[0] as HTMLElement) // Tomate
      await userEvent.click(checkboxes[1] as HTMLElement) // Pechuga de pollo
      await userEvent.click(checkboxes[2] as HTMLElement) // Arroz

      await waitFor(() => {
        expect(getByText('3 ingredientes seleccionados')).toBeTruthy()
      })
    })

    it('debería permitir deseleccionar un ingrediente', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      const checkbox = checkboxes[0] as HTMLElement

      // Seleccionar
      await userEvent.click(checkbox)
      await waitFor(() => {
        expect(getByText('1 ingrediente seleccionado')).toBeTruthy()
      })

      // Deseleccionar
      await userEvent.click(checkbox)
      await waitFor(() => {
        expect(getByText('0 ingredientes seleccionados')).toBeTruthy()
      })
    })

    it('debería usar singular cuando hay 1 ingrediente seleccionado', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement)

      await waitFor(() => {
        expect(getByText('1 ingrediente seleccionado')).toBeTruthy()
      })
    })

    it('debería usar plural cuando hay más de 1 ingrediente seleccionado', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement)
      await userEvent.click(checkboxes[1] as HTMLElement)

      await waitFor(() => {
        expect(getByText('2 ingredientes seleccionados')).toBeTruthy()
      })
    })
  })

  describe('Confirmación de ingredientes', () => {
    it('debería tener el botón deshabilitado sin selección', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        const boton = getByText(/Agregar \(0\)/).closest('button') as HTMLButtonElement
        expect(boton.disabled).toBe(true)
      })
    })

    it('debería habilitar el botón cuando hay selección', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement)

      await waitFor(() => {
        const boton = getByText(/Agregar \(1\)/).closest('button') as HTMLButtonElement
        expect(boton.disabled).toBe(false)
      })
    })

    it('debería llamar onAgregar con los ingredientes seleccionados', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)
      const onAgregar = vi.fn()

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      // Seleccionar Tomate y Pechuga de pollo
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement) // Tomate
      await userEvent.click(checkboxes[1] as HTMLElement) // Pechuga

      const boton = getByText(/Agregar \(2\)/)
      await userEvent.click(boton)

      await waitFor(() => {
        expect(onAgregar).toHaveBeenCalledWith([
          INGREDIENTES_MOCK[0], // Tomate
          INGREDIENTES_MOCK[1]  // Pechuga de pollo
        ])
      })
    })

    it('debería limpiar la selección después de confirmar', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement)

      await waitFor(() => {
        expect(getByText('1 ingrediente seleccionado')).toBeTruthy()
      })

      const boton = getByText(/Agregar \(1\)/)
      await userEvent.click(boton)

      await waitFor(() => {
        expect(getByText('0 ingredientes seleccionados')).toBeTruthy()
      })
    })

    it('debería mostrar el contador correcto en el botón', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      
      // Sin selección
      expect(getByText(/Agregar \(0\)/)).toBeTruthy()

      // Con 1 selección
      await userEvent.click(checkboxes[0] as HTMLElement)
      await waitFor(() => {
        expect(getByText(/Agregar \(1\)/)).toBeTruthy()
      })

      // Con 2 selecciones
      await userEvent.click(checkboxes[1] as HTMLElement)
      await waitFor(() => {
        expect(getByText(/Agregar \(2\)/)).toBeTruthy()
      })
    })

    it('debería pasar solo los ingredientes seleccionados, no todos', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)
      const onAgregar = vi.fn()

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar
      })

      await waitFor(() => {
        expect(getByText('Tomate')).toBeTruthy()
      })

      // Seleccionar solo el primer ingrediente
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      await userEvent.click(checkboxes[0] as HTMLElement)

      const boton = getByText(/Agregar \(1\)/)
      await userEvent.click(boton)

      await waitFor(() => {
        expect(onAgregar).toHaveBeenCalledTimes(1)
        const ingredientesAgregados = onAgregar.mock.calls[0][0] as Ingrediente[]
        expect(ingredientesAgregados).toHaveLength(1)
        expect(ingredientesAgregados[0]).toEqual(INGREDIENTES_MOCK[0])
      })
    })
  })

  describe('Renderizado de tabla', () => {
    it('debería mostrar las columnas correctas', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(INGREDIENTES_MOCK)

      const { getByText } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        expect(getByText('Nombre')).toBeTruthy()
        expect(getByText('Grupo')).toBeTruthy()
        expect(getByText('Origen')).toBeTruthy()
        expect(getByText('Acciones')).toBeTruthy()
      })
    })

    it('debería renderizar todos los ingredientes disponibles en la tabla', async () => {
      vi.mocked(ingredientesService.todosLosIngredientes).mockResolvedValue(
        [INGREDIENTES_MOCK[0], INGREDIENTES_MOCK[1], INGREDIENTES_MOCK[2]]
      )

      const { container } = render(ModalIngredientes, {
        ingredientesActuales: [],
        onAgregar: vi.fn()
      })

      await waitFor(() => {
        const filas = container.querySelectorAll('tbody tr')
        expect(filas.length).toBe(3)
      })
    })
  })
})