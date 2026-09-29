import axios from 'axios'

interface AuthResponse{
  success: boolean
  message?: string
  usuario?: string
  idLocal?: number
}

export async function login(usuario: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      'http://localhost:9000/api/auth/login',
      {
        usuario,
        password
      }
    )

    if (response.data.success) {
      // Login exitoso - guardar usuario e idLocal
      if (response.data.usuario) {
        sessionStorage.setItem('usuario', response.data.usuario)
      }
      if (response.data.idLocal !== undefined) {
        sessionStorage.setItem('idLocal', response.data.idLocal.toString())
      }
      return { success: true }
    } else {
      // Error en el login
      return {
        success: false,
        message:
          response.data.message || 'Usuario o contraseña incorrecto. Vuelva a intentarlo.'
      }
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return {
        success: false,
        message:
          err.response.data.message ||
          'Error en el servidor. Por favor, inténtelo de nuevo más tarde.'
      }
    } else {
      return {
        success: false,
        message: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.'
      }
    }
  }
}

export async function registro(
  usuario: string,
  password: string,
  confirmarPassword: string
): Promise<AuthResponse> {
  // Validación de contraseñas
  if (password !== confirmarPassword) {
    return {
      success: false,
      message: 'Las contraseñas no coinciden'
    }
  }

  try {
    const response = await axios.post<AuthResponse>(
      'http://localhost:9000/api/auth/registro',
      {
        usuario,
        password,
        confirmarPassword
      }
    )

    if (response.data.success) {
      return { success: true }
    } else {
      return {
        success: false,
        message: response.data.message || 'Error al crear la cuenta. Vuelva a intentarlo.'
      }
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return {
        success: false,
        message:
          err.response.data.message || 'Error en el servidor. Inténtelo de nuevo más tarde.'
      }
    } else {
      return {
        success: false,
        message: 'Error de conexión. Inténtelo de nuevo más tarde.'
      }
    }
  }
}