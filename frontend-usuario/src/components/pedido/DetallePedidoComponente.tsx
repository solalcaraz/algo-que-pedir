import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../chakra-toaster/toaster'
import ResumenDetallePedido from './DetallePedidoItems'
import { Articulo } from '../articulo-checkout/Articulo'
import { type PedidoDetalleProps } from '@/types/pedidoDetalleProps'
import { Heading, VStack, HStack, IconButton, Text, Image } from '@chakra-ui/react'


export const PedidoDetalle = ({
  restaurante,
  articulos,
  subtotal,
  recargo,
  tarifaEntrega,
  distancia,
  total,
  medioDePago
}: PedidoDetalleProps) => {

  const navigate = useNavigate()

  const volver = () => {
    navigate(-1)
  }

  return (
    <VStack className="main-checkout" align="stretch" w="100%" p={4}>
      <HStack as="header" justify="start" align="center" mb={6}>
        <IconButton aria-label="Volver" variant="ghost" onClick={volver}>
          <IoMdArrowBack />
        </IconButton>
        <Heading as="h1" size="md">Tu pedido</Heading>
      </HStack>

      <VStack align="stretch" mb={6}>
        <Heading as="h2" size="sm" mb={3}>Restaurante</Heading>
        <HStack align="center">
          <Image
            src={restaurante.urlImagenLocal}
            alt={`Imagen de ${restaurante.nombre}`}
            boxSize="100px"
            objectFit="cover"
            mr={4}
          />
          <VStack align="start">
            <Text fontWeight="bold">{restaurante.nombre}</Text>
            <Text fontSize="sm" color="gray.600">
              Puntuación: 🍽️{restaurante.rating} - {distancia} -
              Envío ${tarifaEntrega.toFixed(2)}</Text>
          </VStack>
        </HStack>
      </VStack>

      <VStack align="stretch" mb={6}>
        <Heading as="h2" size="xl" mb={3}>Artículos</Heading>

        {articulos.map((articulo, idArt) => (
          <Articulo
            key={idArt}
            nombre={articulo.nombre}
            cantidad={articulo.cantidad}
            precioUnitario={articulo.precioUnitario}
            onDecrement={function (): void {
              toaster.create({
                description: 'No es posible cancelar este artículo, el pedido ya está hecho',
                type: 'warning'
              })
            }} />
        ))}
      </VStack>

      <ResumenDetallePedido
        items={[
          { label: 'Subtotal', value: subtotal },
          { label: 'Recargo por tipo de pago', value: recargo },
          { label: 'Tarifa de entrega', value: tarifaEntrega },
          { label: 'Total', value: total, bold: true }
        ]}
      />


      <HStack w="100%" justify="space-between">
        <Text>Forma de Pago</Text>
        <Text fontWeight="medium">{medioDePago}</Text>
      </HStack>
    </VStack>
  )
}
