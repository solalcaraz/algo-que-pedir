import { Dialog, VStack, Image, Heading, Text, HStack, Flex } from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Plato } from '@/domain/Plato'
import { Button } from '@/components/boton/boton'


interface PlatoModalProps {
    plato: Plato
    open: boolean
    onClose: () => void
    onAgregar: (plato: Plato, cantidad: number) => void
    cantidadActual: number
}

export const PlatoModal = ({
    plato,
    open,
    onClose,
    onAgregar,
    cantidadActual = 0
}: PlatoModalProps) => {
    {/*Entiendo que muestra lo que agregas o 1 si es por 1era vez*/}
    const [cantidad, setCantidad] = useState(cantidadActual > 0 ? cantidadActual : 1) 

    {/*Cada modal arranca con cantidad en 1 para permitirte elegir, si volves a abrir
    el modal de un mismo plato, te muestra la cantidad que ya agregaste al pedido */}
    useEffect( () => {
        if(open){
            setCantidad(cantidadActual > 0 ? cantidadActual : 1)
        }
    }, [open, cantidadActual])


    {/*Funciones para los botones de sumar/restar item*/}
    const incrementaItem = () => setCantidad( numero => numero + 1 )
    const decrementaItem = () => setCantidad( numero => numero > 1 ? numero - 1 : 1)

    {/* Funcion para agregar ligada al boton */}
    const botonAgregarItem = () => {
        onAgregar(plato, cantidad)
    }

    return(
        <Dialog.Root open={open} onOpenChange={onClose} placement="center"> {/* Codigo del modal */}
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content px="1rem" py="1.5rem" maxW={{ base: '100%', sm:'600px'}}>
                    <Image src={plato.imagenUrl} alt={plato.nombre} h="200px" objectFit="cover" rounded="xl" />    {/*Img del plato*/}

                    <VStack gap="4" w="100%" align="start" p="2">                               {/*Contenedor principal del modal*/}
                        <Dialog.Header p="0">
                            <Heading size="lg" fontWeight="bold">{plato.nombre}</Heading>                {/*Nombre del plato*/}
                        </Dialog.Header>

                        <Dialog.Body p="0" w="100%">
                            <VStack gap="2.5" align="start">
                                <Text textStyle="sm" fontWeight="medium">{plato.descripcion}</Text>       {/*Descripcion + precio del plato*/}

                                <HStack justifyContent="space-between" w="100%" mb="3">
                                    <Text textStyle="sm" fontWeight="medium">Precio unitario: </Text>   
                                    <Text textStyle="sm" fontWeight="medium">${plato.precioUnitario.toFixed(2)}</Text>   
                                </HStack>
                            </VStack>
                        </Dialog.Body>

                        <HStack w="100%" justifyContent="space-between" bg="fondo">
                            <Button m="0" w="50px" h="40px" maxW="70px" aria-label="Decrementar" onClick={decrementaItem}> <FaMinus/> </Button>       {/*Seccion boton agregar/sacar item*/}
                            
                            <Flex direction="row" w="100%" maxW="70px" fontSize="md" fontWeight="bold" justifyContent="center" alignItems="center">
                                {cantidad}
                            </Flex>

                            <Button m="0" w="50px" h="40px"  aria-label="Incrementar" onClick={incrementaItem}> <FaPlus/> </Button>
                        </HStack>

                        <HStack w="100%" justifyContent="space-between">                        {/*Precio final calculado*/}
                            <Text fontSize="lg"> Precio total:</Text> 
                            <Text fontSize="lg">${(plato.precioUnitario * cantidad).toFixed(2)}</Text>
                        </HStack>

                        <Dialog.Footer as={Flex} w="100%" justifyContent="space-between" p="0">     {/*Seccion botones para finalizar*/}
                            <Button variant="secundario" border="none" color="black" bgColor="gray.100" onClick={onClose}>Cancelar</Button>
                            <Button onClick={botonAgregarItem}>Agregar al Pedido</Button>
                        </Dialog.Footer>
                    </VStack>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )

}