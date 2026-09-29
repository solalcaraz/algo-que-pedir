import { Flex, Spinner, Text } from '@chakra-ui/react'

interface SpinnerProps {
    mensaje?: string
}

export const LoadingSpinner = ({
    mensaje
} : SpinnerProps) => {
    return (
        <Flex direction="column" align="center" justify="center" minH="100vh" width="100%" p="4" gap="4">
            <Spinner size="xl" color="red.500"/>
            <Text mt="4" fontWeight="medium">
                Cargando {mensaje}...
            </Text>
        </Flex>
    )
}