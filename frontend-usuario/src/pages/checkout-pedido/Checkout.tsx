import { Button } from '@/components/boton/boton'
import { Articulo } from '@/components/articulo-checkout/Articulo'
import { Heading, Stack, IconButton, Select, createListCollection, Portal, Flex, Text } from '@chakra-ui/react'
import { IoMdArrowBack } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { Pedido } from '@/domain/Pedido'
import { pedidoService } from '@/services/pedidoService'
import { useNavigate, useOutletContext, type ErrorResponse } from 'react-router-dom'
import { getMensajeError } from '@/utils/errorHandling'
import { toaster } from '@/components/chakra-toaster/toaster'
import { useOnInit } from '@/customHooks/useOnInit'
import type { CarritoContext } from '../layout-carrito/CarritoLayout'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'
import type { Usuario } from '@/domain/Usuario'
import { usuarioService } from '@/services/usuarioService'
import { distanciaService } from '@/services/distanciaService'
import { type MedioDePago, type LocalJSON, medioDePagoLabels } from '@/domain/Local'
import { localService } from '@/services/localService'


export const CheckoutPedido = () => {
    const navigate = useNavigate()
    const { carrito, decrementarPlato, limpiarCarrito } = useOutletContext<CarritoContext>()
    
    const [local, setLocal] = useState<LocalJSON | null>(null)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [medioSeleccionado, setMedioSeleccionado] = useState<MedioDePago>('EFECTIVO')
    
    const [tarifaEntregaMonto, setTarifaEntregaMonto] = useState(0)
    const [recargo, setRecargo] = useState(0)
    const [total, setTotal] = useState(0)
    const [distancia, setDistancia] = useState<string | null>(null)

    const [estaCargando, setEstaCargando] = useState(true)
    
    
    useOnInit(async () => {
        const idLocalStorage = localStorage.getItem('idUsuario')
        const userId = idLocalStorage !== null ? Number(idLocalStorage) : null
        if (!carrito.localId) {
            setEstaCargando(false)
            return
        }
        
        if (!userId) {
            toaster.create({ title: 'Error', description: 'Usuario no autenticado.', type: 'error' })
            navigate('/loginUsuario')
            setEstaCargando(false)
            return
        }

        try {
            const [localData, userData] = await Promise.all([
                localService.obtenerLocalPorId(carrito.localId),
                usuarioService.getById(userId)
            ])
            setLocal(localData)
            setUsuario(userData)

            if (localData && userData) {
                const distanciaCalculada = await distanciaService.obtenerDistancia(localData.idLocal!, userData.id!)
                setDistancia(distanciaCalculada)
            }
        } catch (error) {
            console.error('Error al cargar la información:', error)
            toaster.create({ title: 'Error', description: 'No se pudo cargar la información.', type: 'error' })
            navigate('/home')
        } finally {
            setEstaCargando(false)
        }
        setEstaCargando(false)
    })

    useEffect(() => { //Recalcula valores cuando cambia medio de pago
        if (!local) return

        // Monto de entrega
        const tarifaEntregaMonto = carrito.subtotal * local.tarifaEntrega
        setTarifaEntregaMonto(tarifaEntregaMonto)

        //Monto medio de pago
        const subtotalConEnvio = carrito.subtotal + tarifaEntregaMonto
        const tarifaMedioDePago = local.recargosMedioDePago[medioSeleccionado] || 0
        const tarifaMedioDePagoMonto = subtotalConEnvio * tarifaMedioDePago
        setRecargo(tarifaMedioDePagoMonto)

        //Monto total
        const montoTotal = carrito.subtotal + tarifaEntregaMonto + tarifaMedioDePagoMonto
        setTotal(montoTotal)
    }, [carrito.subtotal, local, medioSeleccionado])

    const confirmarPedido = async () => {
        if (!local) return

        const fechaPedido = new Date()
        const pedido = Pedido.fromCarrito(carrito, local, medioSeleccionado, total, fechaPedido, usuario!)

        try {
            await pedidoService.crearPedido(pedido)
            toaster.create({
                title: 'Pedido confirmado!',
                description: 'Tu pedido ha sido realizado con éxito.',
                type: 'success',
            })
            limpiarCarrito()
            navigate('/home')
        } catch (error: unknown) {
            const mensajeError = getMensajeError(error as ErrorResponse)
            toaster.create({
                title: 'No se pudo confirmar el pedido',
                description: mensajeError,
                type: 'error',
            })
        }
    }

    if (estaCargando) {
        return <LoadingSpinner mensaje = "Cargando checkout..." />
    }

    if (!local || carrito.items.length === 0) {
        return (
            <Flex direction="column" gap="4" align="center" justify="center" minH="80vh" width="100%">
                <Heading as="h1">Tu carrito está vacío</Heading>
                <Text>Agrega platos del menú para continuar.</Text>
                <Button onClick={() => local ? navigate(`/local/${local.idLocal}/platos`) : navigate('/home')}>
                    Volver al menú
                </Button>
            </Flex>
        )
    }

    const itemsSelect = local.mediosDePago.map((medio) => ({
        label: medioDePagoLabels[medio],
        value: medio,
    })
    )

    const collection = createListCollection({ items: itemsSelect })

    return(
        <main className="main-checkout">
            <Heading as="header" className="checkout-header">
                <IconButton variant="ghost" onClick={() => navigate(-1)}><IoMdArrowBack/></IconButton>
                <h1 className="checkout-titulo">Tu pedido</h1>
            </Heading>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Restaurante</Heading>
                <figure className="restaurante-figure">
                    <img className="imagen-restaurante" src={local.urlImagenLocal} alt='Imágen del restaurante'/>
                    <Stack as='figcaption' gap={0}>
                        <h3>{local.nombre}</h3>
                        <span className='texto-secundario-checkout'>{local.rating.toFixed(1)} ★ · {distancia} · {tarifaEntregaMonto.toFixed(2)}</span>
                    </Stack>
                </figure>
            </Stack>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Artículos</Heading>
                {carrito.items.map((item) => (
                    <Articulo 
                    key={item.plato.id} 
                    nombre={item.plato.nombre} 
                    cantidad={item.cantidad} 
                    precioUnitario={item.plato.precioUnitario}
                    onDecrement={() => decrementarPlato(item.plato.id)} />
                ))}
            </Stack>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Resumen</Heading>
                <article className="container-resumen">
                    <Stack>
                        <span className="texto-secundario-checkout">Subtotal</span>
                        <span className="texto-secundario-checkout">Recargo por tipo de pago</span>
                        <span className="texto-secundario-checkout">Tarifa de entrega</span>
                        <span className="texto-secundario-checkout">Total</span>
                    </Stack>
                    <Stack>
                        <span className="precio-resumen">${carrito.subtotal.toFixed(2)}</span>
                        <span className="precio-resumen">${recargo.toFixed(2)}</span>
                        <span className="precio-resumen">${tarifaEntregaMonto.toFixed(2)}</span>
                        <span className="precio-resumen">${total.toFixed(2)}</span>
                    </Stack>
                </article>
            </Stack>
            <Stack as="section" className="container-checkout">
                <Select.Root collection={collection} size="lg" value={[medioSeleccionado]}
                    onValueChange={(details) => {
                        const seleccionado = details.value[0] as MedioDePago
                        if (seleccionado) {
                            setMedioSeleccionado(seleccionado)
                        }
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Forma de pago</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {collection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Button className='boton-checkout' onClick={confirmarPedido}>Confirmar pedido</Button>
                <Button variant="secundario" className='boton-checkout' onClick={limpiarCarrito}>Limpiar carrito de compras</Button>
            </Stack>
        </main>
    )
}