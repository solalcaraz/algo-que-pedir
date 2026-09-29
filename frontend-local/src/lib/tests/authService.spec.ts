import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login, registro } from '$lib/services/authService'
import axios from 'axios'

vi.mock('axios')

describe('AuthService', () => {
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
  })

  describe('login', () => {
    describe('Login exitoso', () => {
      it('debería retornar success true cuando las credenciales son correctas', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true,
            usuario: 'testuser',
            idLocal: 1
          }
        })

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(true)
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:9000/api/auth/login',
          {
            usuario: 'testuser',
            password: 'password123'
          }
        )
      })

      it('debería guardar el usuario en sessionStorage', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true,
            usuario: 'testuser',
            idLocal: 1
          }
        })

        await login('testuser', 'password123')

        expect(sessionStorage.setItem).toHaveBeenCalledWith('usuario', 'testuser')
      })

      it('debería guardar el idLocal en sessionStorage', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true,
            usuario: 'testuser',
            idLocal: 123
          }
        })

        await login('testuser', 'password123')

        expect(sessionStorage.setItem).toHaveBeenCalledWith('idLocal', '123')
      })

      it('no debería guardar usuario si no viene en la respuesta', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true,
            idLocal: 1
          }
        })

        await login('testuser', 'password123')

        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('usuario', expect.anything())
      })

      it('no debería guardar idLocal si no viene en la respuesta', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true,
            usuario: 'testuser'
          }
        })

        await login('testuser', 'password123')

        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('idLocal', expect.anything())
      })
    })

    describe('Login fallido', () => {
      it('debería retornar success false cuando las credenciales son incorrectas', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false,
            message: 'Usuario o contraseña incorrecto. Vuelva a intentarlo.'
          }
        })

        const result = await login('wronguser', 'wrongpass')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Usuario o contraseña incorrecto. Vuelva a intentarlo.')
      })

      it('debería retornar mensaje por defecto si no viene del servidor', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false
          }
        })

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Usuario o contraseña incorrecto. Vuelva a intentarlo.')
      })

      it('no debería guardar nada en sessionStorage cuando falla', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false,
            message: 'Error'
          }
        })

        await login('wronguser', 'wrongpass')

        expect(sessionStorage.setItem).not.toHaveBeenCalled()
      })
    })

    describe('Manejo de errores', () => {
      it('debería manejar error de Axios con respuesta del servidor', async () => {
        vi.mocked(axios.post).mockRejectedValue({
          isAxiosError: true,
          response: {
            data: {
              message: 'Error personalizado del servidor'
            }
          }
        })
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error personalizado del servidor')
      })

      it('debería manejar error de Axios sin mensaje personalizado', async () => {
        vi.mocked(axios.post).mockRejectedValue({
          isAxiosError: true,
          response: {
            data: {}
          }
        })
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
      })

      it('debería manejar error de conexión', async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error('Network error'))
        vi.mocked(axios.isAxiosError).mockReturnValue(false)

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error de conexión. Por favor, inténtelo de nuevo más tarde.')
      })

      it('debería manejar error 500 del servidor', async () => {
        vi.mocked(axios.post).mockRejectedValue({
          isAxiosError: true,
          response: {
            status: 500,
            data: {
              message: 'Error interno del servidor'
            }
          }
        })
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const result = await login('testuser', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error interno del servidor')
      })
    })
  })

  describe('registro', () => {
    describe('Registro exitoso', () => {
      it('debería retornar success true cuando el registro es exitoso', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true
          }
        })

        const result = await registro('newuser', 'password123', 'password123')

        expect(result.success).toBe(true)
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:9000/api/auth/registro',
          {
            usuario: 'newuser',
            password: 'password123',
            confirmarPassword: 'password123'
          }
        )
      })

      it('debería enviar todos los campos al backend', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: true
          }
        })

        await registro('testuser', 'pass123', 'pass123')

        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:9000/api/auth/registro',
          expect.objectContaining({
            usuario: 'testuser',
            password: 'pass123',
            confirmarPassword: 'pass123'
          })
        )
      })
    })

    describe('Validación de contraseñas', () => {
      it('debería retornar error si las contraseñas no coinciden', async () => {
        const result = await registro('testuser', 'password123', 'password456')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Las contraseñas no coinciden')
        expect(axios.post).not.toHaveBeenCalled()
      })

      it('no debería llamar al backend si las contraseñas no coinciden', async () => {
        await registro('testuser', 'pass1', 'pass2')

        expect(axios.post).not.toHaveBeenCalled()
      })
    })

    describe('Registro fallido', () => {
      it('debería retornar error cuando el usuario ya existe', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false,
            message: 'Usuario ya existe.'
          }
        })

        const result = await registro('existinguser', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Usuario ya existe.')
      })

      it('debería retornar mensaje por defecto si no viene del servidor', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false
          }
        })

        const result = await registro('testuser', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error al crear la cuenta. Vuelva a intentarlo.')
      })

      it('debería manejar error de campos requeridos', async () => {
        vi.mocked(axios.post).mockResolvedValue({
          data: {
            success: false,
            message: 'Usuario y contraseña son requeridos.'
          }
        })

        const result = await registro('', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Usuario y contraseña son requeridos.')
      })
    })

    describe('Manejo de errores', () => {
      it('debería manejar error de Axios con respuesta del servidor', async () => {
        vi.mocked(axios.post).mockRejectedValue({
          isAxiosError: true,
          response: {
            data: {
              message: 'Error en el registro'
            }
          }
        })
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const result = await registro('testuser', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error en el registro')
      })

      it('debería manejar error de Axios sin mensaje personalizado', async () => {
        vi.mocked(axios.post).mockRejectedValue({
          isAxiosError: true,
          response: {
            data: {}
          }
        })
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const result = await registro('testuser', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error en el servidor. Inténtelo de nuevo más tarde.')
      })

      it('debería manejar error de conexión', async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error('Network error'))
        vi.mocked(axios.isAxiosError).mockReturnValue(false)

        const result = await registro('testuser', 'password123', 'password123')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Error de conexión. Inténtelo de nuevo más tarde.')
      })
    })
  })
})