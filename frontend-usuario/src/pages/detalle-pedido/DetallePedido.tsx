import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { agruparPlatos } from '@/utils/agruparPlatos'
import { VStack, Spinner, Heading, Text } from '@chakra-ui/react'
import { obtenerDetallePedido } from '@/services/detallePedidoService'
import { PedidoDetalle } from '@/components/pedido/DetallePedidoComponente'

export const PaginaDetallePedido = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [pedido, setPedido] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  if (!pedido && !loading && id) {
    setLoading(true)

    obtenerDetallePedido(+id)
      .then(data => {
        const articulosAgrupados = agruparPlatos(data.platosDelPedido)

        setPedido({
          ...data,
          articulos: articulosAgrupados,
        })

        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <VStack p={4}>
        <Spinner size="xl" />
        <Text>Cargando pedido...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack p={4}>
        <Heading>Error</Heading>
        <Text>{error}</Text>
      </VStack>
    )
  }

  if (!pedido) {
    return (
      <VStack p={4}>
        <Text>No se encontró el pedido con ID "{id}"</Text>
      </VStack>
    )
  }

  return (
    <PedidoDetalle
      restaurante={pedido.local}
      articulos={pedido.articulos}
      subtotal={pedido.costoSubtotalPedido}
      recargo={pedido.recargoMedioDePago}
      tarifaEntrega={pedido.tarifaEntrega}
      distancia={pedido.distancia}
      total={pedido.costoTotalPedido}
      medioDePago={pedido.medioDePago}
      isCheckout={false}
    />
  )
}