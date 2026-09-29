import { Button } from '@/components/boton/boton'
import { ModalIngredientes } from '@/components/perfil-usuario/modalListaIngredientes'
import { Usuario } from '@/domain/Usuario'
import { Box, Flex, Heading, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { IoMdArrowBack } from 'react-icons/io'
import { useOutletContext } from 'react-router-dom'
import type { PerfilContextType } from '../Perfil'
import { useState } from 'react'
import type { Ingrediente } from '@/domain/Ingrediente'
import { toaster } from '@/components/chakra-toaster/toaster'
import { MdClose } from 'react-icons/md'
import { ItemRow } from '@/components/itemRow/itemRow'

export const IngredientesPreferidos = () => {
    const { usuario, setUsuario, navigate } = useOutletContext<PerfilContextType>()

    const [modalAbierto, setModalAbierto] = useState(false)

    const agregarIngredientes = (ingredientes: Ingrediente[]) => {
        setUsuario(Object.assign(new Usuario(), {...usuario, ingredientesPreferidos: ingredientes}))
        
        toaster.create({
            title: 'Ingredientes actualizados',
            description: 'Los cambios se guardarán cuando presiones "Guardar cambios"',
            type: 'info',
        })
    }

    const eliminarIngrediente = (id: number) => {
        const ingredientesActualizados = usuario.ingredientesPreferidos.filter(
            (ing) => ing.id !== id
        )
        setUsuario(Object.assign(new Usuario(), { ...usuario, ingredientesPreferidos: ingredientesActualizados }))

        toaster.create({
            title: 'Ingredientes eliminado',
            description: 'Los cambios se guardarán cuando presiones "Guardar cambios"',
            type: 'info',
        })
    }

    const volver = () => navigate(-1)

    return (
        <>
            <Stack py={5} pb="100px">
                {/* Header */}
                <HStack alignItems='center' justifyContent='center' onClick={volver}>
                    <IconButton variant="ghost"><IoMdArrowBack /></IconButton>
                    <Heading as='h1'>Ingrediente Preferido</Heading>
                </HStack>

                {/* Lista de ingredientes */}
                <Stack gap={2} >
                    {usuario.ingredientesPreferidos.length > 0 ? (
                        usuario.ingredientesPreferidos.map((ingrediente) => (
                            <Box p={3} bg="white" borderRadius="md" shadow="sm">
                                <ItemRow key={ingrediente.id!} titulo={ingrediente.nombre} icono={<MdClose/>} onClick={()=>eliminarIngrediente(ingrediente.id!)}/>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.500" alignContent="center" >
                            No hay ingredientes preferidos
                        </Text>
                    )}
                </Stack>

                {/* Botón agregar ingrediente */}
                <Flex position="fixed" bottom="80px" left={0} right={0} justifyContent="center" px={4} >
                    <Button onClick={() => setModalAbierto(true)} maxW="400px" w="full">
                        Añadir ingrediente
                    </Button>
                </Flex>
            </Stack>

            {/* Modal de selección */}
            <ModalIngredientes
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                ingredientesSeleccionados={usuario.ingredientesPreferidos}
                ingredientesExcluidos={usuario.ingredientesEvitar}
                onSeleccionar={agregarIngredientes}
                titulo="Seleccionar ingredientes preferidos"
            />
        </>
    )
}

export const IngredientesEvitar = () => {
    const { usuario, setUsuario, navigate } = useOutletContext<PerfilContextType>()
    
    const [modalAbierto, setModalAbierto] = useState(false)

    const agregarIngredientes = (ingredientes: Ingrediente[]) => {
        setUsuario(Object.assign(new Usuario(), {...usuario, ingredientesEvitar: ingredientes}))
        
        toaster.create({
            title: 'Ingrediente actualizado',
            description: 'Los cambios se guardarán cuando presiones "Guardar cambios"',
            type: 'info',
        })
    }

    const eliminarIngrediente = (id: number) => {
        const ingredientesActualizados = usuario.ingredientesEvitar.filter(
            (ing) => ing.id !== id
        )
        setUsuario(Object.assign(new Usuario(), { ...usuario, ingredientesEvitar: ingredientesActualizados }))

        toaster.create({
            title: 'Ingrediente eliminado',
            description: 'Los cambios se guardarán cuando presiones "Guardar cambios"',
            type: 'info',
        })
    }

    const volver = () => navigate(-1)

    return (
        <>
            <Stack py={5} pb='100px'>
                {/* Header */}
                <HStack alignItems='center' justifyContent='center' onClick={volver}>
                    <IconButton variant="ghost"><IoMdArrowBack /></IconButton>
                    <Heading as='h1'>Ingredientes a Evitar</Heading>
                </HStack>

                {/* Lista de ingredientes */}
                <Stack gap={2}>
                    {usuario.ingredientesEvitar.length > 0 ? (
                        usuario.ingredientesEvitar.map((ingrediente) => (
                            <Box p={3} bg="white" borderRadius="md" shadow="sm">
                                <ItemRow key={ingrediente.id!} titulo={ingrediente.nombre} icono={<MdClose/>} onClick={()=>eliminarIngrediente(ingrediente.id!)}/>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.500" alignContent="center" >
                            No hay ingredientes a evitar
                        </Text>
                    )}
                </Stack>

                {/* Botón agregar ingrediente */}
                <Flex position="fixed" bottom="80px" left={0} right={0} justifyContent="center" px={4} >
                    <Button onClick={() => setModalAbierto(true)} maxW="400px" w="full">
                        Añadir ingrediente
                    </Button>
                </Flex>
            </Stack>

            {/* Modal de selección */}
            <ModalIngredientes
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                ingredientesSeleccionados={usuario.ingredientesEvitar}
                ingredientesExcluidos={usuario.ingredientesPreferidos}
                onSeleccionar={agregarIngredientes}
                titulo="Seleccionar ingredientes a evitar"
            />
        </>
    )
}