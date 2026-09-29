import { render, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import '@testing-library/jest-dom'
import LoginPage from '../../routes/(auth)/login/+page.svelte'

// Mock del servicio de autenticación
vi.mock('$lib/services/authService', () => ({
  login: vi.fn()
}))

let assignSpy: MockInstance<typeof window.location.assign>

import { login } from '$lib/services/authService'

describe('Página de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })

    delete (window as { location?: unknown }).location
    assignSpy = vi.fn()
    window.location = { assign: assignSpy, toString: () => '' } as unknown as Location & string
  })

  describe('Renderización inicial', () => {
    it('debería renderizar el logo', () => {
      const { container } = render(LoginPage)

      const logo = container.querySelector('.imagen-logo')
      expect(logo).toBeInTheDocument()
    })

    it('debería renderizar el nombre de la aplicación', () => {
      const { getByText } = render(LoginPage)

      expect(getByText('Algo que pedir')).toBeInTheDocument()
    })

    it('debería renderizar el campo de usuario', () => {
      const { container } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      expect(inputUsuario).toBeInTheDocument()
      expect(inputUsuario.type).toBe('text')
    })

    it('debería renderizar el campo de password', () => {
      const { container } = render(LoginPage)

      const inputPassword = container.querySelector('#password')
      expect(inputPassword).toBeInTheDocument()
      // Agregado: asegurar el tipo correcto del campo de contraseña
      expect((inputPassword as HTMLInputElement).type).toBe('password') 
    })

    it('debería renderizar el botón de iniciar sesión', () => {
      const { getByText } = render(LoginPage)

      const btnLogin = getByText('Iniciar Sesión')
      expect(btnLogin).toBeInTheDocument()
    })

    it('debería renderizar el enlace de registro', () => {
      const { getByText } = render(LoginPage)

      expect(getByText('¿No tienes una cuenta?')).toBeInTheDocument()
      expect(getByText('Regístrate')).toBeInTheDocument()
    })

    it('el enlace de registro debería apuntar a /registro', () => {
      const { container } = render(LoginPage)

      const link = container.querySelector('a[href="registro"]')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Validación de campos', () => {
    it('el campo usuario debería ser requerido', () => {
      const { container } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      expect(inputUsuario.required).toBe(true)
    })

    it('el campo password debería ser requerido', () => {
      const { container } = render(LoginPage)

      const inputPassword = container.querySelector('#password') as HTMLInputElement
      expect(inputPassword.required).toBe(true)
    })

    it('debería tener placeholder en el campo usuario', () => {
      const { container } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      expect(inputUsuario.placeholder).toBe('Escribir')
    })
  })

  describe('Login exitoso', () => {
    it('debería llamar al servicio de login con las credenciales correctas', async () => {
      vi.mocked(login).mockResolvedValue({ success: true })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(login).toHaveBeenCalledWith('testuser', 'testpass123') // Aserción corregida/añadida
      })
    })

    it('debería redirigir a / después de login exitoso', async () => {
      vi.mocked(login).mockResolvedValue({ success: true })
      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(assignSpy).toHaveBeenCalledWith('/')
      })
    })

    it('debería limpiar el campo de password después de login exitoso', async () => {
      vi.mocked(login).mockResolvedValue({ success: true })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        // Después de un login exitoso (y la posible redirección), el campo de password debería limpiarse.
        expect(inputPassword.value).toBe('') 
      })
    })
  })

  // --- Login fallido ---
  describe('Login fallido', () => {
    it('debería mostrar mensaje de error cuando las credenciales son incorrectas', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        message: 'Usuario o contraseña incorrecto. Vuelva a intentarlo.'
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'wronguser')
      await userEvent.type(inputPassword, 'wrongpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(getByText('Usuario o contraseña incorrecto. Vuelva a intentarlo.')).toBeInTheDocument()
      })
    })

    it('debería limpiar el campo de password después de error', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        message: 'Usuario o contraseña incorrecto. Vuelva a intentarlo.'
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'wronguser')
      await userEvent.type(inputPassword, 'wrongpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(inputPassword.value).toBe('')
      })
    })

    it('debería mostrar mensaje de error por defecto si no viene del servidor', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(getByText('Error al iniciar sesión')).toBeInTheDocument()
      })
    })

    it('no debería redirigir cuando el login falla', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        message: 'Error de autenticación'
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(login).toHaveBeenCalled()
      })

      expect(window.location.assign).not.toHaveBeenCalled()
    })
  })

  // --- Estado de carga ---
  describe('Estado de carga', () => {
    it('debería deshabilitar el botón mientras está cargando', async () => {
      // Mock que simula un retraso
      vi.mocked(login).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      // Verificar que el botón está deshabilitado inmediatamente
      expect(btnLogin).toBeDisabled()

      // Esperar a que termine la promesa y el botón se habilite
      await waitFor(() => {
        expect(btnLogin).not.toBeDisabled()
      })
    })

    it('debería cambiar el texto del botón mientras carga', async () => {
      vi.mocked(login).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      // El texto cambia a "Iniciando..." mientras espera
      await waitFor(() => {
        expect(getByText('Iniciando...')).toBeInTheDocument()
      })
      
      // El texto vuelve a "Iniciar Sesión" al finalizar
      await waitFor(() => {
        expect(getByText('Iniciar Sesión')).toBeInTheDocument()
      })
    })

    it('debería deshabilitar los campos de entrada mientras carga', async () => {
      vi.mocked(login).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123')
      await userEvent.click(btnLogin)

      expect(inputUsuario).toBeDisabled()
      expect(inputPassword).toBeDisabled()

      await waitFor(() => {
        expect(inputUsuario).not.toBeDisabled()
        expect(inputPassword).not.toBeDisabled()
      })
    })
  })

  // --- Manejo de errores del servidor ---
  describe('Manejo de errores del servidor', () => {
    it('debería manejar error de conexión', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        message: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.'
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(getByText(/Error de conexión/i)).toBeInTheDocument()
      })
    })

    it('debería manejar error del servidor', async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        message: 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.'
      })

      const { container, getByText } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement
      const btnLogin = getByText('Iniciar Sesión')

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass')
      await userEvent.click(btnLogin)

      await waitFor(() => {
        expect(getByText(/Error en el servidor/i)).toBeInTheDocument()
      })
    })
  })

  describe('Interacción con formulario', () => {
    it('debería enviar el formulario al presionar Enter', async () => {
      vi.mocked(login).mockResolvedValue({ success: true })

      const { container } = render(LoginPage)

      const inputUsuario = container.querySelector('#usuario') as HTMLInputElement
      const inputPassword = container.querySelector('#password') as HTMLInputElement

      await userEvent.type(inputUsuario, 'testuser')
      await userEvent.type(inputPassword, 'testpass123{Enter}') // Simular Enter

      await waitFor(() => {
        expect(login).toHaveBeenCalledWith('testuser', 'testpass123')
      })
    })

    it('no debería enviar el formulario si los campos están vacíos', async () => {
      const { getByText } = render(LoginPage)

      const btnLogin = getByText('Iniciar Sesión')
      await userEvent.click(btnLogin)
      
      expect(login).not.toHaveBeenCalled() 
    })
  })
})