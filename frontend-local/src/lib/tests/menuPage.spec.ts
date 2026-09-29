import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, type SvelteComponentOptions } from '@testing-library/svelte'
import '@testing-library/jest-dom' // Import custom matchers
import MenuPage from '../../routes/(app)/menu/+page.svelte'
import { PLATOS_MOCK } from '$lib/data/mocks/platosMock'

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

import { goto } from '$app/navigation'
import type { Component } from 'svelte'
import type { PageProps } from '../../routes/(app)/menu/$types'

let defaultData: SvelteComponentOptions<Component<PageProps>>

describe('Página de gestión del menú', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    defaultData = { 
      data: { platos: PLATOS_MOCK }, 
      params: {} 
    }
  })

  describe('Renderizado inicial', () => {
    it('debería renderizar el título de la página', () => {
      const { getByText } = render(MenuPage, defaultData)
      
      expect(getByText('Gestión del Menú')).toBeTruthy()
    })

    it('debería renderizar el subtítulo', () => {
      const { getByText } = render(MenuPage, defaultData)
      
      expect(getByText('Platos Disponibles')).toBeTruthy()
    })

    it('debería renderizar el botón de agregar nuevo plato', () => {
      const { getByText } = render(MenuPage, defaultData)
      
      expect(getByText('Agregar nuevo plato')).toBeTruthy()
    })
  })

  describe('Lista de platos', () => {
    it('debería renderizar todos los platos del mock', () => {
      const { getByText } = render(MenuPage, defaultData)
      
      expect(getByText('Pasta cremosa')).toBeTruthy()
      expect(getByText('Alitas picantes')).toBeTruthy()
      expect(getByText('Ensalada de la Huerta')).toBeTruthy()
      expect(getByText('Hamburguesa con queso')).toBeTruthy()
      expect(getByText('Pescado y Papas Fritas')).toBeTruthy()
      expect(getByText('Pizza Vegetariana')).toBeTruthy()
      expect(getByText('Pastel de Chocolate')).toBeTruthy()
    })

    it('debería renderizar la cantidad correcta de items', () => {
      const { container } = render(MenuPage, defaultData)
      
      const items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(7)
    })

    it('debería renderizar cada plato con su enlace correcto', () => {
      const { container } = render(MenuPage, defaultData)
      
      const links = container.querySelectorAll('.lista-menu > a')
      
      expect(links[0].getAttribute('href')).toBe('./plato/1')
      expect(links[1].getAttribute('href')).toBe('./plato/2')
      expect(links[2].getAttribute('href')).toBe('./plato/3')
      expect(links[3].getAttribute('href')).toBe('./plato/4')
      expect(links[4].getAttribute('href')).toBe('./plato/5')
      expect(links[5].getAttribute('href')).toBe('./plato/6')
      expect(links[6].getAttribute('href')).toBe('./plato/7')
    })

    it('debería usar el id del plato en el href', () => {
      const { container } = render(MenuPage, defaultData)
      
      const primerLink = container.querySelector('.lista-menu > a') as HTMLAnchorElement
      
      expect(primerLink.href).toContain('plato/1')
    })
  })

  describe('Navegación', () => {
    it('debería navegar a la página de nuevo plato al hacer click en el botón', async () => {
      const { getByText } = render(MenuPage, defaultData)
      
      const botonAgregar = getByText('Agregar nuevo plato')
      await userEvent.click(botonAgregar)
      
      expect(goto).toHaveBeenCalledWith('./plato/')
    })

    it('debería llamar a goto una sola vez', async () => {
      const { getByText } = render(MenuPage, defaultData)
      
      const botonAgregar = getByText('Agregar nuevo plato')
      await userEvent.click(botonAgregar)
      
      expect(goto).toHaveBeenCalledTimes(1)
    })
  })

  describe('Casos edge', () => {
    it('debería renderizar correctamente sin platos', () => {
      const { container, getByText } = render(MenuPage, {
        data: { platos: [] }
      })
      
      expect(getByText('Gestión del Menú')).toBeTruthy()
      const items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(0)
    })

    it('debería renderizar correctamente con un solo plato', () => {
      const { container, getByText } = render(MenuPage, {
        data: { platos: [PLATOS_MOCK[0]] }
      })
      
      expect(getByText('Pasta cremosa')).toBeTruthy()
      const items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(1)
    })

    it('debería mantener el orden de los platos del mock', () => {
      const { container } = render(MenuPage, defaultData)
      
      const nombres = Array.from(container.querySelectorAll('.lista-menu > a'))
        .map(link => link.textContent?.trim())
      
      expect(nombres[0]).toContain('Pasta cremosa')
      expect(nombres[1]).toContain('Alitas picantes')
      expect(nombres[2]).toContain('Ensalada de la Huerta')
    })
  })

  describe('Renderizado de ItemMenu', () => {
    it('debería pasar el plato correcto a cada ItemMenu', () => {
      const { getByText } = render(MenuPage, defaultData)
      
      // Verificar que se renderizan las descripciones de los platos
      expect(getByText('Deliciosa pasta con salsa cremosa')).toBeTruthy()
      expect(getByText('Alitas de pollo picantes con salsa para mojar')).toBeTruthy()
    })

    it('debería renderizar ItemMenu para cada plato en la lista', () => {
      const { container } = render(MenuPage, defaultData)
      
      // Cada link contiene un ItemMenu
      const links = container.querySelectorAll('.lista-menu > a')
      expect(links.length).toBe(PLATOS_MOCK.length)
    })
  })

  describe('Reactividad', () => {
    it('debería actualizar la lista cuando cambian los platos', async () => {
      const { container, rerender } = render(MenuPage, defaultData)
      
      let items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(7)
      
      // Actualizar con menos platos
      await rerender({
        data: { platos: [PLATOS_MOCK[0], PLATOS_MOCK[1]] }
      })
      
      items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(2)
    })

    it('debería mostrar la lista vacía cuando se eliminan todos los platos', async () => {
      const { container, rerender } = render(MenuPage, defaultData)
      
      let items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(7)
      
      await rerender({
        data: { platos: [] }
      })
      
      items = container.querySelectorAll('.lista-menu > a')
      expect(items.length).toBe(0)
    })
  })
})