import { render, waitFor, type SvelteComponentOptions } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom' // Import custom matchers
import PlatoPage from '../../routes/(app)/plato/[[id]]/+page.svelte'
import { PLATOS_MOCK } from '$lib/data/mocks/platosMock'
import { platosService } from '$lib/services/platoService'

vi.mock('axios')
vi.mock('$lib/utils/errorHandler', () => ({
  showError: vi.fn()
}))
vi.mock('$lib/utils/toasts/toasts', () => ({
  showToast: vi.fn()
}))
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

import axios from 'axios'
import { goto } from '$app/navigation'
import type { Component } from 'svelte'
import type { PageProps } from '../../routes/(app)/plato/[[id]]/$types'
import { showError } from '$lib/utils/errorHandler'
import { showToast } from '$lib/utils/toasts/toasts'

let defaultData: SvelteComponentOptions<Component<PageProps>>

describe('Página de edición/creación de platos', () => {
  
  describe('Edición de plato existente', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      const plato = PLATOS_MOCK[0] // Pasta cremosa con 3 ingredientes
      defaultData = { 
        data: { plato, nuevoPlato: false }, 
        params: { id: '1' } 
      }
    })

    it('debería renderizar el título correcto para edición', () => {
      const { getByText } = render(PlatoPage, defaultData)
      
      expect(getByText('Editar Plato: Pasta cremosa')).toBeInTheDocument()
    })

    it('debería mostrar los datos del plato en los inputs', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      const textareaDescripcion = container.querySelector('#descripcion') as HTMLTextAreaElement
      
      expect(inputNombre.value).toBe('Pasta cremosa')
      expect(textareaDescripcion.value).toBe('Deliciosa pasta con salsa cremosa')
    })

    it('debería mostrar el valor base del plato', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputValorBase = container.querySelector('#valorBase') as HTMLInputElement
      expect(inputValorBase.value).toBe('12.99')
    })

    it('debería renderizar los ingredientes del plato', () => {
      const { getByText } = render(PlatoPage, defaultData)
      
      expect(getByText('Tomate')).toBeInTheDocument()
      expect(getByText('Arroz')).toBeInTheDocument()
      expect(getByText('Leche')).toBeInTheDocument()
    })

    it('debería mostrar que el plato es de autor', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const switchAutor = container.querySelector('#esDeAutor') as HTMLInputElement
      expect(switchAutor?.checked).toBe(true)
    })

    it('debería mostrar que el plato está en promoción', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const switchPromo = container.querySelector('#estaEnPromocion') as HTMLInputElement
      expect(switchPromo?.checked).toBe(true)
    })

    it('debería mostrar el porcentaje de descuento cuando está en promoción', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputDescuento = container.querySelector('#porcentajeDescuento') as HTMLInputElement
      expect(inputDescuento).toBeInTheDocument()
      expect(inputDescuento.value).toBe('10')
    })

    it('debería mostrar el costo de producción', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const costoProduccion = container.querySelector('.contenedor_titulo-span span')
      expect(costoProduccion).toBeInTheDocument()
      expect(costoProduccion?.textContent).toContain(PLATOS_MOCK[0].costoProduccion.toFixed(2))
    })

    it('debería actualizar el plato correctamente', async () => {
      const platoActualizado = { ...PLATOS_MOCK[0].toJSON() }
      
      vi.mocked(axios.put).mockResolvedValue({ 
        data: platoActualizado, 
        status: 200 
      })
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => { expect(axios.put).toHaveBeenCalled() })
      await waitFor(() => { expect(showToast).toHaveBeenCalledWith('Plato actualizado con éxito', 'success') })
    })

    it('debería navegar a /menu después de actualizar exitosamente', async () => {
      const platoActualizado = { ...PLATOS_MOCK[0].toJSON() }
      
      vi.mocked(axios.put).mockResolvedValue({ 
        data: platoActualizado, 
        status: 200 
      })
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = await waitFor(() => getByTestId('btnGuardar'))
      await userEvent.click(btnGuardar)
      await waitFor(() => { expect(vi.mocked(goto)).toHaveBeenCalledWith('/menu') }, { timeout: 2000 })
    })

    it('debería mostrar error si falla la actualización', async () => {
      vi.mocked(axios.put).mockRejectedValue({
        response: {
          data: { message: 'Error inesperado' },
          status: 400
        }
      })
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => { expect(showError).toHaveBeenCalledWith('Error al guardar el plato', expect.objectContaining({
        response: expect.objectContaining({ data: expect.objectContaining({ message: 'Error inesperado' }) })
      })  ) })
    })

    it('debería deshabilitar los botones mientras guarda', async () => {
      vi.mocked(axios.put).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: {}, status: 200 }), 100))
      )
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      const btnDescartar = getByTestId('btnDescartar')
      
      await userEvent.click(btnGuardar)
      
      // Verificar que los botones están deshabilitados
      expect(btnGuardar).toBeDisabled()
      expect(btnDescartar).toBeDisabled()
      
      // Esperar a que termine
      await waitFor(() => {
        expect(btnGuardar).not.toBeDisabled()
        expect(btnDescartar).not.toBeDisabled()
      })
    })

    it('debería navegar atrás al descartar cambios con confirmación', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnDescartar = getByTestId('btnDescartar')
      await userEvent.click(btnDescartar)
      
      expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro de que desea descartar los cambios?')
      expect(goto).toHaveBeenCalledWith('/menu')
    })

    it('no debería navegar si se cancela el descarte', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnDescartar = getByTestId('btnDescartar')
      await userEvent.click(btnDescartar)
      
      expect(window.confirm).toHaveBeenCalled()
      expect(goto).not.toHaveBeenCalled()
    })

    it('debería habilitar el campo de descuento cuando está en promoción', () => {
      const plato = PLATOS_MOCK[3] // Hamburguesa con queso
      const { container } = render(PlatoPage, {
        data: { plato, nuevoPlato: false },
        params: { id: '4' }
      })
      
      const inputDescuento = container.querySelector('#porcentajeDescuento') as HTMLInputElement
      expect(inputDescuento).toBeInTheDocument()
    })

    it('no debería mostrar campo de descuento si no está en promoción', () => {
      const plato = PLATOS_MOCK[1] // Alitas picantes
      const { container } = render(PlatoPage, {
        data: { plato, nuevoPlato: false },
        params: { id: '2' }
      })
      
      const inputDescuento = container.querySelector('#porcentajeDescuento')
      expect(inputDescuento).not.toBeInTheDocument()
    })

    it('debería actualizar la vista previa de la imagen al cambiar el select', async () => {
      const { container } = render(PlatoPage, defaultData)
      
      const selectImagen = container.querySelector('#imagen') as HTMLSelectElement
      const imgPreview = container.querySelector('.editar-plato__imagen img') as HTMLImageElement
      
      const imagenInicial = imgPreview.src
      
      await userEvent.selectOptions(selectImagen, 'hamburguesa-con-queso.png')
      
      await waitFor(() => {
        expect(imgPreview.src).not.toBe(imagenInicial)
        expect(imgPreview.src).toContain('hamburguesa-con-queso.png')
      })
    })
  })

  describe('Creación de plato nuevo', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      const plato = platosService.crearPlatoVacio()
      defaultData = { 
        data: { plato, nuevoPlato: true }, 
        params: {} 
      }
    })

    it('debería renderizar el título correcto para nuevo plato', () => {
      const { getByText } = render(PlatoPage, defaultData)
      
      expect(getByText('Agregar nuevo plato')).toBeInTheDocument()
    })

    it('debería tener campos vacíos inicialmente', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      const textareaDescripcion = container.querySelector('#descripcion') as HTMLTextAreaElement
      
      expect(inputNombre.value).toBe('')
      expect(textareaDescripcion.value).toBe('')
    })

    it('debería tener valor base en 0 inicialmente', () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputValorBase = container.querySelector('#valorBase') as HTMLInputElement
      expect(inputValorBase.value).toBe('0')
    })

    it('no debería mostrar el switch de promoción en platos nuevos', () => {
      const plato = PLATOS_MOCK[1]
      const { container } = render(PlatoPage, defaultData = { data: { plato, nuevoPlato: false }, params: { id: '1' }})
      
      const switchPromo = container.querySelector('#estaEnPromocion')
      expect(switchPromo).not.toBeInTheDocument()
    })

    it('debería crear un plato nuevo correctamente', async () => {
      const platoCreado = {
        id: 99,
        nombre: 'Nuevo Plato',
        descripcion: 'Descripción del nuevo plato',
        valorBase: 30,
        imagenUrl: '/images/plato-nuevo.png',
        ingredientes: []
      }
      
      vi.mocked(axios.post).mockResolvedValue({ 
        data: platoCreado, 
        status: 201 
      })
      
      const { container, getByTestId } = render(PlatoPage, defaultData)
      
      // Llenar campos
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      const textareaDescripcion = container.querySelector('#descripcion') as HTMLTextAreaElement
      const inputValorBase = container.querySelector('#valorBase') as HTMLInputElement
      const selectImagen = container.querySelector('#imagen') as HTMLSelectElement
      
      await userEvent.clear(inputNombre)
      await userEvent.type(inputNombre, 'Nuevo Plato')
      await userEvent.clear(textareaDescripcion)
      await userEvent.type(textareaDescripcion, 'Descripción del nuevo plato')
      await userEvent.clear(inputValorBase)
      await userEvent.type(inputValorBase, '30')
      await userEvent.selectOptions(selectImagen, 'ensalada-huerta.png')
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Plato creado con éxito', 'success')
      }, { timeout: 3000 })
    })

    it('debería navegar a /menu después de crear exitosamente', async () => {
      const platoCreado = {
        id: 99,
        nombre: 'Nuevo Plato',
        descripcion: 'Descripción del nuevo plato',
        valorBase: 30,
        imagenUrl: '/images/plato-nuevo.png',
        ingredientes: []
      }
      
      vi.mocked(axios.post).mockResolvedValue({ 
        data: platoCreado, 
        status: 201 
      })
      
      const { container, getByTestId } = render(PlatoPage, defaultData)
      
      // Llenar campos mínimos
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      const textareaDescripcion = container.querySelector('#descripcion') as HTMLTextAreaElement
      const inputValorBase = container.querySelector('#valorBase') as HTMLInputElement
      const selectImagen = container.querySelector('#imagen') as HTMLSelectElement
      
      await userEvent.type(inputNombre, 'Nuevo Plato')
      await userEvent.type(textareaDescripcion, 'Descripción')
      await userEvent.clear(inputValorBase)
      await userEvent.type(inputValorBase, '30')
      await userEvent.selectOptions(selectImagen, 'ensalada-huerta.png')
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => {
        expect(goto).toHaveBeenCalledWith('/menu')
      }, { timeout: 2000 })
    })

    it('debería mostrar el texto correcto en el botón de guardar', () => {
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      expect(btnGuardar.textContent?.trim()).toBe('Agregar plato')
    })

    it('debería mostrar error al intentar crear sin datos requeridos', async () => {
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      // No debería llamar a axios
      expect(axios.post).not.toHaveBeenCalled()
    })
  })

  describe('Validaciones', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      const plato = platosService.crearPlatoVacio()
      defaultData = { 
        data: { plato, nuevoPlato: true }, 
        params: {} 
      }
    })

    it('no debería permitir guardar sin nombre', async () => {
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      expect(axios.post).not.toHaveBeenCalled()
      expect(axios.put).not.toHaveBeenCalled()
    })

    it('debería validar el plato antes de guardar', async () => {
      const { getByTestId } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      expect(axios.post).not.toHaveBeenCalled()
      expect(axios.put).not.toHaveBeenCalled()
    })

    it('debería mostrar error de validación para nombre vacío', async () => {
      const { getByTestId, getByText } = render(PlatoPage, defaultData)
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => {
        expect(getByText('Debe ingresar un nombre para el plato')).toBeInTheDocument()
      })
    })

    it('debería permitir guardar cuando todos los campos son válidos', async () => {
      vi.mocked(axios.post).mockResolvedValue({ 
        data: {}, 
        status: 201 
      })
      
      const { container, getByTestId } = render(PlatoPage, defaultData)
      
      // Llenar todos los campos requeridos
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      const textareaDescripcion = container.querySelector('#descripcion') as HTMLTextAreaElement
      const inputValorBase = container.querySelector('#valorBase') as HTMLInputElement
      const selectImagen = container.querySelector('#imagen') as HTMLSelectElement
      
      await userEvent.type(inputNombre, 'Plato válido')
      await userEvent.type(textareaDescripcion, 'Descripción válida')
      await userEvent.clear(inputValorBase)
      await userEvent.type(inputValorBase, '25')
      await userEvent.selectOptions(selectImagen, 'ensalada-huerta.png')
      
      const btnGuardar = getByTestId('btnGuardar')
      await userEvent.click(btnGuardar)
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })
    })

    it('debería validar el nombre con máximo 30 caracteres', async () => {
      const { container } = render(PlatoPage, defaultData)
      
      const inputNombre = container.querySelector('#nombre') as HTMLInputElement
      
      expect(inputNombre.maxLength).toBe(30)
    })
  })
})