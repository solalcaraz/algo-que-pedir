import './articulo.css'
import '@/pages/checkout-pedido/checkout.css'
import { Stack, IconButton, HStack } from '@chakra-ui/react'
import { IoMdClose } from 'react-icons/io'


interface ArticuloProps {
  nombre: string
  cantidad: number
  precioUnitario: number
  onDecrement: () =>  void
}

export const Articulo = ({ nombre, cantidad, precioUnitario, onDecrement }: ArticuloProps) => {
    const precioTotal = precioUnitario * cantidad

    return(
        <article>
            <HStack className='plato-precio'>
                <h3>{nombre}</h3>
                <span className='precio-total'>${precioTotal.toFixed(2)}</span>
            </HStack>
            <HStack className='detalle-icono'>
                <Stack gap={0}>
                <span className='texto-secundario-checkout'>Cantidad: {cantidad}</span>
                <span className='texto-secundario-checkout'>Precio unitario: ${precioUnitario.toFixed(2)}</span>
                </Stack>
                <IconButton variant="ghost" mt="-2" onClick={onDecrement}><IoMdClose /></IconButton>
            </HStack>
        </article>
    )
}
