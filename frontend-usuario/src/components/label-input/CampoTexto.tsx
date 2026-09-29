import type { validar } from '@/utils/validar'
import { Field, Input, type InputProps } from '@chakra-ui/react'
import { useState } from 'react'

interface CampoTextoProps extends InputProps {
    nombreLabel: string
    nombreTest: string
    validacion: ReturnType<typeof validar>
    required?: boolean
}

export const CampoTexto = ({ required=true, nombreLabel, nombreTest, validacion, ...rest }: CampoTextoProps) => {
    const [tocado, setTocado] = useState(false)
    const tieneError = tocado && !validacion.esValido
    
    return (
        
        <Field.Root invalid={tieneError} required={required} >
            <Field.Label>{nombreLabel}</Field.Label>
            <Input data-testid={`input-${nombreTest}`} onBlur={() => setTocado(true)} {...rest}/>
            <Field.ErrorText>{validacion.mensajeError}</Field.ErrorText>
        </Field.Root>
    )
}