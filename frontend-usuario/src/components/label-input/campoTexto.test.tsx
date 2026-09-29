import { render, screen, waitFor } from '@testing-library/react'
import { test, describe, expect } from 'vitest'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/styles/theme'
import { CampoTexto } from './CampoTexto'
import userEvent from '@testing-library/user-event'

describe('input tests', () => {
    test('deberia mostrar un campo de texto', () => {
        render(
            <ChakraProvider value={theme}>
                <CampoTexto validacion={{esValido: true}} nombreLabel='Nombre' nombreTest='nombre' />
            </ChakraProvider>
        )
        expect(screen.getByTestId('input-nombre')).toBeTruthy()
    })
    
    test('no deberia mostrar el mensaje de error inicialmente aunque sea inválido', () => {
        render(
            <ChakraProvider value={theme}>
                <CampoTexto 
                    validacion={{esValido: false, mensajeError: 'Apellido inválido'}} 
                    nombreLabel='Apellido' 
                    nombreTest='apellido' 
                />
            </ChakraProvider>
        )
        expect(screen.getByTestId('input-apellido')).toBeTruthy()
        expect(screen.queryByText('Apellido inválido')).toBeNull()
    })

    test('deberia mostrar el mensaje de error después de onBlur', async () => {
        const user = userEvent.setup()
        render(
            <ChakraProvider value={theme}>
                <CampoTexto 
                    validacion={{esValido: false, mensajeError: 'Apellido inválido'}} 
                    nombreLabel='Apellido' 
                    nombreTest='apellido' 
                />
            </ChakraProvider>
        )
        
        const input = screen.getByTestId('input-apellido')
        await user.click(input)
        await user.tab() // Simula blur
        
        expect(screen.getByText('Apellido inválido')).toBeTruthy()
    })


    test('no deberia mostrar el mensaje de error cuando invalid=false', () => {
        render(
            <ChakraProvider value={theme}>
                <CampoTexto validacion={{esValido: true, mensajeError: 'Apellido inválido'}} nombreLabel='Nombre' nombreTest='nombre' />
            </ChakraProvider>
        )
        expect(screen.getByTestId('input-nombre')).toBeTruthy()
        expect(screen.queryByText('Apellido inválido')).toBeNull()
    })

    test('deberia aceptar props de Input como type y value', async () => {
        render(
            <ChakraProvider value={theme}>
                <CampoTexto validacion={{esValido: false}} nombreLabel='Edad' nombreTest='edad' type='number' value={30} />
            </ChakraProvider>
        )
        await waitFor(() => {
            const numeroEdad = (screen.getByTestId('input-edad') as HTMLInputElement).value
            expect(numeroEdad).toBe('30')
        })
    })
})