import '@testing-library/jest-dom'
import { Local } from '$lib/models/local.svelte'
import { toast, type Toast } from '$lib/utils/toasts/toasts'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Page from '../../routes/(app)/perfil-local/+page.svelte'
import { render, screen, fireEvent } from '@testing-library/svelte'

describe('Dado el perfil de un local', () => {
  it('muestra y oculta el toast al descartar cambios', async () => {
    vi.useFakeTimers()

    const mockData = {
      localDataBackend: {
        nombre: 'Taberna de Moe',
        urlImagenLocal: 'https://www.clarin.com/img/2017/10/05/SkWTevV3-_1200x0.jpg',
        direccion: 'Av. Siempre Viva',
        altura: 742,
        latitud: 10,
        longitud: 10,
        porcentajeSobreCadaPlato: 3,
        porcentajeRegaliasDeAutor: 3,
        mediosDePago: ['QR', 'TARJETA'],
      }
    }
    render(Page, { props: { data: mockData } })

    let currentToast: Toast | null = null

    const unsubscribe = toast.subscribe((value: Toast | null) => {
      currentToast = value
    })

    //No debería haber ningún toast
    expect(currentToast).toBeNull()
    const botonDescartar = screen.getByTestId('descartar-cambios')
    await fireEvent.click(botonDescartar)

    //Después de la llamada al botón descartar, debería haber un toast cargado
    expect(currentToast).not.toBeNull()

    expect(currentToast?.message).toBe('No hay cambios para descartar')
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
}) // Fin test Perfil del Local - Toast

describe('Modelo del local', () => {
  let local: Local

  beforeEach(() => {
    local = new Local()
    local.idLocal = 1
  })

  it('asocia el error de dirección vacía al campo dirección', () => {
    local.nombreLocal = 'Taberna de Moe'
    local.direccion = ''

    local.validarLocal()

    expect(local.tieneError('direccion')).toBe(true)
    expect(local.tieneError('nombreLocal')).toBe(false)
  })

  it('envía al backend los medios de pago tildados con los nombres de su enum', () => {
    local.metodosDePago = { EFECTIVO: true, QR: false, TARJETA: true }

    expect(local.prepararDTO().mediosDePago).toEqual(['EFECTIVO', 'TARJETA'])
  })

  it('renderiza el perfil de un local que no acepta todos los medios de pago', () => {
    const mockData = {
      localDataBackend: {
        idLocal: 1,
        nombre: 'Taberna de Moe',
        urlImagenLocal: 'https://www.clarin.com/img/2017/10/05/SkWTevV3-_1200x0.jpg',
        direccion: 'Av. Siempre Viva',
        altura: 742,
        latitud: 10,
        longitud: 10,
        porcentajeSobreCadaPlato: 3,
        porcentajeRegaliasDeAutor: 3,
        mediosDePago: ['QR']
      }
    }
    render(Page, { props: { data: mockData } })

    expect(screen.getByLabelText('QR')).toBeChecked()
    expect(screen.getByLabelText('Efectivo')).not.toBeChecked()
    expect(screen.getByLabelText('Tarjeta')).not.toBeChecked()
  })
})

describe('Dado el perfil de un local', () => {
  it('el toast de descartar cambios muestra el mensaje que corresponde', async () => {
    vi.useFakeTimers()

    const mockData = {
      localDataBackend: {
        idLocal: 1,
        nombre: 'Taberna de Moe',
        urlImagenLocal: 'https://www.clarin.com/img/2017/10/05/SkWTevV3-_1200x0.jpg',
        direccion: 'Av. Siempre Viva',
        altura: 742,
        latitud: 10,
        longitud: 10,
        porcentajeSobreCadaPlato: 3,
        porcentajeRegaliasDeAutor: 3,
        mediosDePago: ['QR', 'TARJETA'],
      }
    }
    render(Page, { props: { data: mockData } })

    let currentToast: Toast | null = null

    const unsubscribe = toast.subscribe((value: Toast | null) => {
      currentToast = value
    })

    const botonDescartar = screen.getByTestId('descartar-cambios')
    await fireEvent.click(botonDescartar)

    expect(currentToast?.message).toBe('No hay cambios para descartar')

    const nombreInput = screen.getByTestId('nombre-local') as HTMLInputElement
    await fireEvent.input(nombreInput, { target: { value: 'Mensita' } })
    await fireEvent.click(botonDescartar)

    expect(currentToast?.message).toBe('Cambios descartados')
    expect(nombreInput.value).toBe('Taberna de Moe')

    unsubscribe()
    vi.useRealTimers()
  })
}) // Fin test mensajes del toast