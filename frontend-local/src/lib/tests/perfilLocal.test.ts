import '@testing-library/jest-dom'
import { Local } from '$lib/models/local.svelte'
import { toast, type Toast } from '$lib/utils/toasts/toasts'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Page from '../../routes/(app)/perfil-local/+page.svelte'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ProfileCard from '$lib/components/perfil-local/profile-card.svelte'

describe('ProfileCard', () => {
  it('renderiza el título correctamente', () => {
    render(ProfileCard, { props: { title: 'Perfil del Local' } })
    const heading = screen.getByText('Perfil del Local')
    expect(heading).toBeInTheDocument()
  })
})

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          nombre: 'Mi Local',
          urlImagenLocal: 'https://example.com/imagen.png',
          direccion: 'Calle Falsa',
          altura: 123,
          latitud: -34.6,
          longitud: -58.4,
          porcentajeSobreCadaPlato: 10,
          porcentajeRegaliasDeAutor: 15,
          mediosDePago: ['QR', 'EFECTIVO']
        }
      })
    ),
    put: vi.fn(() => Promise.resolve({ data: {} }))
  }
}))

describe('Perfil del Local - Toasts', () => {
  it('muestra un Toast cuando se descartan cambios', async () => {
    vi.useFakeTimers()

    render(Page)

    let currentToast: Toast | null = null

    const unsubscribe = toast.subscribe((value: Toast | null) => {
      currentToast = value
    })

    //No debería haber ningún toast
    expect(currentToast).toBeNull() 

    const botonDescartar = await screen.findByText(/Descartar cambios/i)
    await fireEvent.click(botonDescartar)

    //Después de la llamada al botón descartar, debería haber un toast cargado
    expect(currentToast).not.toBeNull()

    expect(currentToast?.message).toBe('Cambios descartados')
    expect(currentToast?.type).toBe('warning')
    expect(currentToast?.duration).toBe(3000)

    vi.advanceTimersByTime(1000)

    //Después de 1 segundo, el toast debería seguir estando
    expect(currentToast).not.toBeNull()

    vi.advanceTimersByTime(3000)

    //Una vez pasados los 3 segundos, el toast debería eliminarse
    //y nuevamente no debería heber ninguno
    expect(currentToast).toBeNull()

    unsubscribe()

    vi.useRealTimers()
  })
})

describe('Restaurar valores originales', () => {
  let local: Local

  beforeEach(() => {
    local = new Local()

    // Datos del local, como si los cargara el backend
    local.nombreLocal = 'Taberna de Moe'
    local.urlImagen = 'https://www.clarin.com/img/2017/10/05/SkWTevV3-_1200x0.jpg'
    local.direccion = 'Av. Siempre Viva'
    local.altura = 742
    local.porcentajeApp = 3
    local.porcentajeAutor = 3
    local.metodosDePago = { QR: true, Efectivo: false, Transferencia: true }

    // Copia original para después restaurarla
    local.copiaOriginal()
  })

  it('debería restaurar los valores originales luego de modificar los campos', () => {
    local.nombreLocal = 'Starbucks'
    local.porcentajeApp = 99
    local.metodosDePago.QR = false

    expect(local.nombreLocal).toBe('Starbucks')

    local.restaurarValores()

    expect(local.porcentajeApp).toBe(3)
    expect(local.metodosDePago.QR).toBe(true)
    expect(local.nombreLocal).toBe('Taberna de Moe')
  })
})