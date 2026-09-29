import { HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface ItemRowProps {
    key: number,
    titulo: string
    icono?: ReactNode //Iconos de react
    onClick?: () => void
}

export const ItemRow = ({ key, titulo, icono, onClick }: ItemRowProps ) => {
    return(
        <HStack justifyContent='space-between' key={key} >
            <Stack>
                <Text fontWeight='sm' fontSize='md'>{titulo}</Text>
            </Stack>
            {icono && (
                <IconButton variant='ghost' onClick={onClick}>{icono}</IconButton>
            )}
        </HStack>
    )
}