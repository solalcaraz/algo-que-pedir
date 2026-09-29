import { render, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import { get } from 'svelte/store'
import RegistroPage from '../../routes/(auth)/registro/+page.svelte'
import { registro } from '$lib/services/authService'
import { toast } from '$lib/utils/toasts/toasts'
import { goto } from '$app/navigation'

vi.mock('$lib/services/authService', () => ({
  registro: vi.fn()
}))

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

const completarYEnviar = async (container: HTMLElement) => {
  const user = userEvent.setup()
  await user.type(container.querySelector('#usuario') as HTMLInputElement, 'nuevoLocal')
  await user.type(container.querySelector('#password') as HTMLInputElement, 'clave123')
  await user.type(container.querySelector('#confirmar') as HTMLInputElement, 'clave123')
  await user.click(container.querySelector('button[type="submit"]') as HTMLButtonElement)
}

describe('Página de registro del local', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toast.set(null)
  })

  it('avisa que la cuenta se creó y lleva al login cuando el registro sale bien', async () => {
    vi.mocked(registro).mockResolvedValue({ success: true })
    const { container } = render(RegistroPage)

    await completarYEnviar(container)

    await waitFor(() => {
      expect(get(toast)?.message).toBe('Cuenta creada con éxito')
      expect(goto).toHaveBeenCalledWith('/login')
    })
  })

  it('muestra el error y se queda en la página cuando el registro falla', async () => {
    vi.mocked(registro).mockResolvedValue({ success: false, message: 'Usuario ya existe.' })
    const { container, findByText } = render(RegistroPage)

    await completarYEnviar(container)

    expect(await findByText('Usuario ya existe.')).toBeInTheDocument()
    expect(goto).not.toHaveBeenCalled()
  })
})
