import { Box, IconButton, Image, Heading, VStack, Text, Flex, HStack, Tabs, useDisclosure, Card } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { Plato, type PlatoJSON } from '@/domain/Plato'

import { CardPlato } from '@/components/card-plato/cardPlato'
import { PlatoModal } from '@/components/plato-modal/platoModal'
import { Button } from '@/components/boton/boton'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'
import { toaster } from '@/components/chakra-toaster/toaster'
import { useState } from 'react'

import { platoService } from '@/services/platoService'
import { localService } from '@/services/localService'
import { useOnInit } from '@/customHooks/useOnInit'
import type { CarritoContext } from '../layout-carrito/CarritoLayout'

interface LocalInfo {
    nombre: string,
    urlImagenLocal: string,
    rating: number,
    cantidadReviews: number,
    reviews: string[],
    pedidos?: number
}


export const DetalleLocal = () => {
    const navigate = useNavigate()
    
    const { carrito, setPlatoCantidad } = useOutletContext<CarritoContext>()

    const volverAlHome = () => {
        navigate('/home')
    }

    const irAlCheckout = () => {
        navigate('/checkout-pedido')
    }
    
    const { idLocal } = useParams<{ idLocal: string }>()
    const localID = Number(idLocal)

    const [local, setLocal] = useState<LocalInfo | null>(null)
    const [estaCargando, setEstaCargando] = useState(true)
    const [errorCarga, setErrorCarga] = useState<string | null>(null)
    
    const [platos, setPlatos] = useState<Plato[]>([])
    const [platoSeleccionado, setPlatoSeleccionado] = useState<Plato | null>(null)
    
    const { open, onOpen, onClose } = useDisclosure()
    
    const handlePlatoClickeado = (plato: Plato) => {
        setPlatoSeleccionado(plato)
        onOpen()
    }

    const handleAgregarPlato = (plato : Plato, cantidad : number) => {
        setPlatoCantidad(plato, cantidad, localID)
        onClose()
    }
           
    const obtenerCantidadActual = (plato: Plato) => {
        return carrito.cantidadPorPlato(plato.id)
    }
        
    const cargarDatos = async () => {
        setEstaCargando(true)
        setErrorCarga(null)

        if (!localID || Number.isNaN(localID)) {
            toaster.create({ title: 'Error', description: 'El id del local es invalido!', type: 'error' })
            setErrorCarga('El id del local es invalido!') 
            setEstaCargando(false)
            return
        }

        try {
            const [localData, platosData] = await Promise.all([
                localService.obtenerLocalPorId(localID),
                platoService.obtenerPlatosPorLocal(localID)
            ])

            setLocal({
                nombre: localData.nombre,
                urlImagenLocal: localData.urlImagenLocal,
                rating: localData.rating,
                cantidadReviews: localData.cantidadReviews,
                reviews: localData.reviews,
                pedidos: localData.cantidadPedidos
            })

            setPlatos(platosData.map((plato: PlatoJSON) => Plato.fromJSON(plato)))
        } catch (error) {
            console.error('Error cargando los platos del local', error)
            toaster.create({ title: 'Error', description: 'No se pudieron cargar los platos del local.', type: 'error' })
            setErrorCarga('No se pudo cargar los platos del local')
        } finally {
            setEstaCargando(false)
        }
    }

    useOnInit(() => {
        cargarDatos()
    })

    if (estaCargando) {
        return (<LoadingSpinner mensaje="platos del local" />)
    }

    if (errorCarga || !local) {
        return (
            <Flex direction="column" gap="4" align="center" justify="center" minH="100vh" width="100%">
                <Text>{errorCarga}</Text>
                <Button onClick={volverAlHome} colorScheme="red">Volver</Button>
            </Flex>
        )
    }


    return (
        <Box>
            <VStack marginTop="0.5rem" align="stretch" gap="3">

                <Flex direction="row" justify="space-between" w="100%" align="center" p="">
                    <IconButton aria-label="Volver atras" onClick={() => navigate(-1)} bg="none" color="black">
                        <IoArrowBack />
                    </IconButton>
                    <Heading size="md" fontWeight="semibold" textAlign="center">{local.nombre}</Heading>
                    <Box w="40px" />
                </Flex>

                <Image src={local.urlImagenLocal} alt="Foto del local" w="100%" h="250px" objectFit="cover" />

                <Flex direction="column" align="flex-start" gap="0.5rem" px="1rem">
                    <Heading size="xl" fontWeight="bold">{local.nombre}</Heading>

                    <HStack fontSize="sm">
                        <FaStar color="#f9d44dff" />
                        <Text>
                            {`${local.rating.toFixed(2)} (${local.cantidadReviews}+ reviews) · ${local.pedidos} ${local.pedidos === 1 ? 'pedido' : 'pedidos'}`}
                        </Text>
                    </HStack>
                </Flex>
            </VStack>

            <Tabs.Root variant="line" w="100%" defaultValue="menu" px="1rem" marginTop="3">
                <Tabs.List>
                    <Tabs.Trigger value="menu" fontWeight="semibold"> Menú </Tabs.Trigger>
                    <Tabs.Trigger value="reseñas" fontWeight="semibold"> Reseñas </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="menu">
                    <VStack w="100%" gap="1">
                        {platos.map(plato => (
                            <CardPlato key={plato.id} plato={plato} onClickPlato={() => handlePlatoClickeado(plato)} />
                        ))}
                    </VStack>
                </Tabs.Content>

                <Tabs.Content value="reseñas">
                    <VStack w="100%" gap="3" mt="3">
                        {local.reviews.length === 0 ? (
                            <Text color="gray.500">No hay reseñas todavía</Text>
                        ) : (
                            local.reviews.map((review, index) => (
                                <Card.Root key={index} w="100%" p="4" boxShadow="sm">
                                    <Card.Body p="1">
                                        <HStack mb="2">
                                            <Text fontWeight="semibold" fontSize="sm">
                                                Reseña #{index + 1}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.700">
                                            {review}
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            ))
                        )}
                    </VStack>
                </Tabs.Content>
            </Tabs.Root>

            <Box p="4" bg="white">
                <Button colorScheme="red" w="100%" onClick={irAlCheckout}> Ver pedido ({carrito.cantidadTotal})</Button>
            </Box>


            {platoSeleccionado && (
                <PlatoModal
                    open={open}
                    onClose={onClose}
                    plato={platoSeleccionado}
                    cantidadActual={obtenerCantidadActual(platoSeleccionado)}
                    onAgregar={handleAgregarPlato}
                />
            )}

        </Box>
    )
}