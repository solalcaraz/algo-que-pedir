import type { Plato } from  '@/domain/Plato'
import { Box, Flex, Heading, Image, Tag, Text, VStack } from '@chakra-ui/react'

interface CardPlatoProps {
    plato: Plato
    onClickPlato: (plato : Plato) => void
}

export const CardPlato = ( {plato, onClickPlato} : CardPlatoProps ) => {
    return (
        <Flex w="100%" align="center" py="1" px="0" gap="1.5" onClick={ () => onClickPlato(plato) }>
            
            <VStack align="flex-start" w="70%">
                {plato.popular && <Tag.Root size="md" variant="subtle" colorPalette="yellow" px="1"><Tag.Label>Popular</Tag.Label></Tag.Root>}
                
                <Heading as="h1" size="md" fontWeight="semibold"> {plato.nombre} </Heading>
                
                <Text fontSize="xs" fontWeight="medium" color="parrafos">
                {plato.descripcion}
                </Text>
                
                <Text fontSize="xs" fontWeight="semibold" bgColor="#f8e6e6ff" borderRadius="md" p="1" px="3.5">${plato.precioUnitario.toFixed(2)}</Text>
            </VStack>

            <Box w="35%">
                <Image 
                src={plato.imagenUrl} 
                alt={plato.nombre} 
                boxSize="120px" 
                objectFit="cover" 
                borderRadius="md" 
                />
            </Box>
        </Flex>
    )
}