import { HStack, IconButton, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'


type ContadorProps = {
  valor: number
  min?: number
  max?: number
}

export const Contador = ({ valor, min = 0, max = 10 }: ContadorProps) => {
    const [nuevoValor, setValor] = useState(valor)
    const sumar = () => {
        if (nuevoValor < max) { setValor(nuevoValor + 1) } 
    }

    const restar = () => {
        if (nuevoValor > min) { setValor(nuevoValor - 1) }
    }

    return (
        <HStack alignItems="center">
        <IconButton rounded="full" onClick={restar} disabled={nuevoValor <= min} variant='subtle'> <CiCircleMinus /> </IconButton>
        <Text>{nuevoValor}</Text>
        <IconButton rounded="full" onClick={sumar} disabled={nuevoValor >= max} variant='subtle'> <CiCirclePlus /> </IconButton>
        </HStack>
    )
}
