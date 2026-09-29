import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { Contador } from './contador'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

const renderContador = (valor: number, min?: number, max?: number) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <Contador valor={valor} min={min} max={max} />
    </ChakraProvider>
  )
}

describe('Contador', () => {
  test('se renderiza correctamente con el valor inicial', () => {
    renderContador(5)
    expect(screen.getByText('5')).toBeTruthy()
  })

  test('incrementa el valor cuando se hace click en sumar', async () => {
    const user = userEvent.setup()
    renderContador(5)
    
    const botonSumar = screen.getAllByRole('button')[1]
    await user.click(botonSumar)
    
    expect(screen.getByText('6')).toBeTruthy()
  })

  test('decrementa el valor cuando se hace click en restar', async () => {
    const user = userEvent.setup()
    renderContador(5)
    
    const botonRestar = screen.getAllByRole('button')[0]
    await user.click(botonRestar)
    
    expect(screen.getByText('4')).toBeTruthy()
  })

  test('no permite incrementar más allá del máximo', async () => {
    const user = userEvent.setup()
    renderContador(10, 0, 10)
    
    const botonSumar = screen.getAllByRole('button')[1]
    await user.click(botonSumar)
    
    expect(screen.getByText('10')).toBeTruthy()
  })

  test('no permite decrementar más allá del mínimo', async () => {
    const user = userEvent.setup()
    renderContador(0, 0, 10)
    
    const botonRestar = screen.getAllByRole('button')[0]
    await user.click(botonRestar)
    
    expect(screen.getByText('0')).toBeTruthy()
  })

  test('los botones se deshabilitan en los límites', () => {
    renderContador(10, 0, 10)
    
    const botones = screen.getAllByRole('button')
    const botonSumar = botones[1]
    
    expect(botonSumar).toHaveProperty('disabled', true)
  })
})