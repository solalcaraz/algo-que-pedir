import { useState } from 'react'
import type { Pedido } from './Pedido'
import { useOnInit } from '@/customHooks/useOnInit'
import { LuCheck, LuClock, LuCircleX } from 'react-icons/lu'
import { toaster } from '@/components/chakra-toaster/toaster'
import { PedidoCard } from '../../components/pedido/PedidoCard'
import { getPedidosPorEstados } from '@/services/detallePedidoService'
import { cancelarPedidoService } from '@/services/detallePedidoService'
import { VStack, Heading, Spinner, Tabs, Text } from '@chakra-ui/react'

export const ListaPedidos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tabActual, setTabActual] = useState('pendientes')
  const [pedidosCancelados, setPedidosCancelados] = useState<Pedido[]>([])
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([])
  const [pedidosCompletados, setPedidosCompletados] = useState<Pedido[]>([])

  const estadoPedido = [
    {
      value: 'pendientes',
      pedidos: pedidosPendientes,
      emptyMessage: 'No tenés pedidos pendientes'
    },
    {
      value: 'completados',
      pedidos: pedidosCompletados,
      emptyMessage: 'No tenés pedidos completados'
    },
    {
      value: 'cancelados',
      pedidos: pedidosCancelados,
      emptyMessage: 'No tenés pedidos cancelados'
    }
  ]

  const cargarPedidosPorEstados = async (
    estados: string[],
    setter: (p: Pedido[]) => void
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const pedidos = await getPedidosPorEstados(estados)
      setter(pedidos)

    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelarPedidoBackend = async (id: number) => {
    const pedido = pedidosPendientes.find(p => p.id === id)
    if (!pedido) return

    try {
      await cancelarPedidoService(id)

      // Esto es para sacar el pedido cancelado de la lista de pendientes
      // sin tener que actualizar la página ni volver a pegarle al backend
      setPedidosPendientes(prev => prev.filter(p => p.id !== id))

      toaster.create({
        description: 'El pedido se canceló correctamente',
        type: 'success'
      })

    } catch (error) {
      console.error(error)

      toaster.create({
        description: 'No se pudo cancelar el pedido',
        type: 'error'
      })
    }
  }

  const cargarCancelados = () => cargarPedidosPorEstados(['CANCELADO'], setPedidosCancelados)
  const cargarCompletados = () => cargarPedidosPorEstados(['ENTREGADO'], setPedidosCompletados)
  const cargarPendientes = () => cargarPedidosPorEstados(['PENDIENTE', 'PREPARADO'], setPedidosPendientes)

  useOnInit(() => {
    cargarPendientes()
  })

  if (error) return (
    <VStack flex={1} justify="center" color="red.500">
      <Heading>Error al cargar</Heading>
      {error}
    </VStack>
  )

  return (
    <VStack w="100%" maxW="container.md" mx="auto" p={4} gap={4}>
      <Tabs.Root
        value={tabActual}
        onValueChange={(details) => {
          const value = details.value
          setTabActual(value)
          if (value === 'pendientes') cargarPendientes()
          if (value === 'completados') cargarCompletados()
          if (value === 'cancelados') cargarCancelados()
        }}
        variant="line"
        w="100%"
      >
        <Tabs.List>
          <Tabs.Trigger value="pendientes"><LuClock /> Pendientes</Tabs.Trigger>
          <Tabs.Trigger value="completados"><LuCheck /> Completados</Tabs.Trigger>
          <Tabs.Trigger value="cancelados"><LuCircleX /> Cancelados</Tabs.Trigger>
        </Tabs.List>

        {estadoPedido.map(tab => (
          <Tabs.Content
            key={tab.value}
            value={tab.value}
            hidden={tabActual !== tab.value}
          >
            <VStack gap={4} mt={4} align="stretch">
              {isLoading && tabActual === tab.value ? (
                <VStack colorPalette="teal">
                  <Spinner size="xl" animationDuration="0.8s" />
                  <Text>Cargando pedidos...</Text>
                </VStack>
              ) : tab.pedidos.length > 0 ? (
                tab.pedidos.map(pedido => (
                  <PedidoCard
                    key={pedido.id}
                    order={pedido}
                    onCancel={tab.value === 'pendientes' ? cancelarPedidoBackend : undefined}
                    mostrarCancelacion={tab.value === 'pendientes'}
                  />
                ))
              ) : (
                tab.emptyMessage
              )}
            </VStack>
          </Tabs.Content>
        ))}

      </Tabs.Root>
    </VStack>
  )
  //Fin return
}
