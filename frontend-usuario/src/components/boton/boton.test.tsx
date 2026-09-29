import { render, screen } from '@testing-library/react'
import { test, describe, expect } from 'vitest'
import { Button } from './boton'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/styles/theme'

describe('boton tests', () => {
    test('deberia mostrar el boton primario', () => {
        render(
            <ChakraProvider value={theme}>
                <Button data-testid='boton'>Boton primario</Button>
            </ChakraProvider>
        )
        expect(screen.getByTestId('boton').innerHTML).toBe('Boton primario')
    })

    test('deberia aplicar la variante secundaria', () => {
        render(
            <ChakraProvider value={theme}>
                <Button data-testid='secundario' variant='secundario'>Boton secundario</Button>
            </ChakraProvider>
        )
        expect(screen.getByTestId('secundario')).toBeTruthy()
        expect(screen.getByTestId('secundario').innerHTML).toBe('Boton secundario')
    })
})