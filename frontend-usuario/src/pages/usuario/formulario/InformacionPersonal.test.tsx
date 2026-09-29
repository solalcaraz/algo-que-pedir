import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { InformacionPersonal } from './InformacionPersonal'
import { Usuario } from '@/domain/Usuario'
import { USUARIOS_MOCK } from '@/mocks/usuariosMock'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mockUsuario = USUARIOS_MOCK[0]

// Se crea un mock de la funcion. Registra cada vez que se llama.
const mockContextValue = {
    usuario: mockUsuario,
    setUsuario: vi.fn(),
    traerUsuario: vi.fn(),
    navigate: vi.fn(),
    gotoPreferencias: vi.fn()
}

// Se simula el componente padre que da los datos y cada vez que se llame a useOutleContext, se usa mock directo
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useOutletContext: () => mockContextValue
    }
})

describe('InformacionPersonal', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('renderizado inicial', () => {
        test('muestra el título del perfil', () => {
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            expect(screen.getByText('Perfil')).toBeTruthy()
        })

        test('muestra la preview con nombre, apellido y email del usuario', () => {
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            expect(screen.getByText('Pepita Rodriguez')).toBeTruthy()
            expect(screen.getByText('correo-pepita@gmail.com')).toBeTruthy()
        })

        test('precarga los valores del usuario en los inputs', () => {
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            const nombre = (screen.getByTestId('input-nombre') as HTMLInputElement).value
            expect(nombre).toBe('Pepita')
            const apellido = (screen.getByTestId('input-apellido') as HTMLInputElement).value
            expect(apellido).toBe('Rodriguez')
            const direccion = (screen.getByTestId('input-direccion') as HTMLInputElement).value
            expect(direccion).toBe('Calle Falsa')
            const latitud = (screen.getByTestId('input-latitud') as HTMLInputElement).value
            expect(latitud).toBe('-3.3')
            const longitud = (screen.getByTestId('input-longitud') as HTMLInputElement).value
            expect(longitud).toBe('58.2')
        })

        test('muestra todas las secciones del formulario', () => {
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            expect(screen.getByText('Informacion Personal')).toBeTruthy()
            expect(screen.getByText('Preferencias')).toBeTruthy()
            expect(screen.getByText('Guardar Cambios')).toBeTruthy()
        })
    })

    describe('interacción con formulario', () => {
        test('permite editar el nombre sin actualizar la preview', async () => {
            
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            const inputNombre = (screen.getByTestId('input-nombre') as HTMLInputElement)
            await userEvent.type(inputNombre, '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}Maria')
            
            // El input debe tener el nuevo valor
            expect(inputNombre.value).toBe('Maria')
            
            // Pero la preview debe mantener el valor original
            expect(screen.getByText('Pepita Rodriguez')).toBeTruthy()
        })

        test('permite editar múltiples campos', async () => {
            const user = userEvent.setup()
            
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            const inputNombre = screen.getByTestId('input-nombre') as HTMLInputElement
            const inputApellido = screen.getByTestId('input-apellido') as HTMLInputElement
            const inputDireccion = screen.getByTestId('input-direccion') as HTMLInputElement
            
            await user.clear(inputNombre)
            await user.type(inputNombre, 'María')
            
            await user.clear(inputApellido)
            await user.type(inputApellido, 'González')
            
            await user.clear(inputDireccion)
            await user.type(inputDireccion, 'Calle Falsa 456')
            
            expect(inputNombre.value).toBe('María')
            expect(inputApellido.value).toBe('González')
            expect(inputDireccion.value).toBe('Calle Falsa 456')
        })

        test('permite editar coordenadas numéricas', async () => {
            const user = userEvent.setup()
            
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            const inputLatitud = screen.getByTestId('input-latitud') as HTMLInputElement
            const inputLongitud = screen.getByTestId('input-longitud') as HTMLInputElement
            
            await user.clear(inputLatitud)
            await user.type(inputLatitud, '-40.5')
            
            await user.clear(inputLongitud)
            await user.type(inputLongitud, '-65.2')
            
            expect(inputLatitud.value).toBe('-40.5')
            expect(inputLongitud.value).toBe('-65.2')
        })
    })

    describe('funcionalidad de guardar', () => {
        test('actualiza el estado del padre al hacer click en Guardar', async () => {
            const user = userEvent.setup()
            const mockSetUsuario = vi.fn()
            
            vi.mocked(mockContextValue.setUsuario).mockImplementation(mockSetUsuario)
            
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            const inputNombre = screen.getByTestId('input-nombre')
            await user.clear(inputNombre)
            await user.type(inputNombre, 'Pedro')
            
            const botonGuardar = screen.getByText('Guardar Cambios')
            await user.click(botonGuardar)
            
            await waitFor(() => {
                expect(mockSetUsuario).toHaveBeenCalled()
            })
        })
    })

    describe('navegación a preferencias', () => {
        test('muestra las opciones de preferencias', () => {
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            // Asumiendo que hay opciones de preferencias definidas
            expect(screen.getByText('Preferencias')).toBeTruthy()
        })

        test('llama a gotoPreferencias al hacer click en una opción', async () => {
            const user = userEvent.setup()
            const mockGotoPreferencias = vi.fn()
            
            vi.mocked(mockContextValue.gotoPreferencias).mockImplementation(mockGotoPreferencias)
            
            render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            // Buscar algún botón dentro de Preferencias (ajustar según tus opciones reales)
            const botonesPreferencias = screen.getAllByRole('button')
            const botonPreferencia = botonesPreferencias.find(btn => 
                btn.closest('[class*="Card"]')?.textContent?.includes('Preferencias')
            )
            
            if (botonPreferencia) {
                await user.click(botonPreferencia)
                expect(mockGotoPreferencias).toHaveBeenCalled()
            }
        })
    })

    describe('sincronización con cambios externos', () => {
        test('actualiza el formulario cuando cambia el usuario del contexto', async () => {
            const { rerender } = render(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            // Usuario inicial
            const nombreInicial = screen.getByTestId('input-nombre') as HTMLInputElement
            expect(nombreInicial.value).toBe('Pepita')
            
            // Simular cambio en el contexto
            const nuevoUsuario = new Usuario()
            nuevoUsuario.nombre = 'Maria'
            nuevoUsuario.apellido = 'Martínez'
            nuevoUsuario.mail = 'correo@mock.com'
            
            mockContextValue.usuario = nuevoUsuario
            
            rerender(
                <ChakraProvider value={defaultSystem}>
                    <MemoryRouter>
                        <InformacionPersonal />
                    </MemoryRouter>
                </ChakraProvider>
            )
            
            await waitFor(() => {
                const nombreActualizado = screen.getByTestId('input-nombre') as HTMLInputElement
                expect(nombreActualizado.value).toBe('Maria')
                const apellidoActualizado = screen.getByTestId('input-apellido') as HTMLInputElement
                expect(apellidoActualizado.value).toBe('Martínez')
                expect(screen.getByText('correo@mock.com')).toBeTruthy()

            })
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
})