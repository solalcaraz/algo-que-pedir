import { showToast } from '$lib/utils/toasts/toasts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    return error.response.data.status < 500 ? error.response.data.message : 'Ocurrió un error, consulte al administrador del sistema.'
  } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
    return 'Ocurrió un problema de conexión con el servidor. Intente nuevamente más tarde'
  } else if (error.message) {
    return error.message
  } else {
    return 'Error desconocido'
  }
}

export const showError = (operation: string, error: unknown) => {
  // eslint-disable-next-line no-console
  console.info(operation, error)
  showToast(`${getErrorMessage(error)}`, 'error')
}