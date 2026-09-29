import { LuX } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import type { Pedido } from "@/pages/detalle-pedido/Pedido"
import { ConfirmDrawer } from "../confirm-modal/ConfirmModal"
import { useConfirmModal } from "@/customHooks/useConfirmModal"
import { Button, Card, Image, Grid, GridItem, VStack } from "@chakra-ui/react"

interface PedidoCardProps {
  order: Pedido
  onCancel?: (id: number) => void
  mostrarCancelacion?: boolean
}

export const PedidoCard = ({ order, onCancel, mostrarCancelacion }: PedidoCardProps) => {
  const navigate = useNavigate()
  const { isOpen, ask, cancel: closeDrawer } = useConfirmModal()

  const clickearCard = () => {
    navigate(`/detalle-pedido/${order.id}`, { state: { pedido: order } })
  }

  const cancelarPedido = (e: React.MouseEvent) => {
    e.stopPropagation()
    ask(() => onCancel && onCancel(order.id))
  }

  return (
    <>
      <Card.Root w="100%" variant="elevated" overflow="hidden">
        <Card.Body p={0}>
          <Grid
            templateColumns="100px 1fr auto"
            templateRows="auto auto auto"
            w="100%"
            onClick={clickearCard}
            _hover={{ cursor: "pointer", bg: "gray.50" }}
          >
            <GridItem gridRow="1 / 4" gridColumn="1 / 2">
              <Image
                src={order.local.urlImagenLocal}
                alt={order.local.nombre}
                width="100px"
                height="100%"
                objectFit="fill"
              />
            </GridItem>

            <GridItem gridRow="1 / 4" gridColumn="2 / 3" p={2} display="flex" alignItems="center">
              <VStack align="start" gap={0}>
                <Card.Title fontSize="sm" mb={0}>
                  {order.local.nombre}
                </Card.Title>
                <Card.Description fontSize="s" color="gray.600">
                  Total: ${order.costoTotalPedido.toFixed(2)}
                </Card.Description>
                <Card.Description fontSize="s" color="gray.600">
                  {order.fechaPedido} - {order.cantidadDePlatos} artículos
                </Card.Description>
              </VStack>
            </GridItem>

            <GridItem gridRow="1 / 4" gridColumn="3 / 4" display="flex" alignItems="center" justifyContent="center" p={3}>
              {mostrarCancelacion && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    aria-label="Cancelar pedido"
                    onClick={cancelarPedido}
                  >
                    <LuX size={20} />
                  </Button>
                )}
            </GridItem>
          </Grid>
        </Card.Body>
      </Card.Root>

      <ConfirmDrawer
        open={isOpen}
        onConfirm={() => {
          onCancel && onCancel(order.id)
          closeDrawer()
        }}
        onCancel={closeDrawer}
        message="¿Estás seguro que querés cancelar este pedido?"
      />
    </>
  )
}

export default PedidoCard
