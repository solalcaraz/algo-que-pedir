import { HStack, IconButton, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'


type ContadorProps = {
  valor: number
  min?: number
  max?: number
  onChange?: (valor: number) => void
}

export const Contador = ({ valor, min = 0, max = 10, onChange }: ContadorProps) => {
    const [nuevoValor, setValor] = useState(valor)
    const cambiarValor = (valorActualizado: number) => {
        setValor(valorActualizado)
        onChange?.(valorActualizado)
    }

    const sumar = () => {
        if (nuevoValor < max) { cambiarValor(nuevoValor + 1) }
    }

    const restar = () => {
        if (nuevoValor > min) { cambiarValor(nuevoValor - 1) }
    }

    return (
        <HStack alignItems="center">
        <IconButton rounded="full" onClick={restar} disabled={nuevoValor <= min} variant='subtle'> <CiCircleMinus /> </IconButton>
        <Text>{nuevoValor}</Text>
        <IconButton rounded="full" onClick={sumar} disabled={nuevoValor >= max} variant='subtle'> <CiCirclePlus /> </IconButton>
        </HStack>
    )
}
