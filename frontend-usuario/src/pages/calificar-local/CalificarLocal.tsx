import { Box, Heading, Text, IconButton, HStack, Stack, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { CalificarService } from '@/services/calificacionService'

interface LocalData {
    id: number
    nombre: string
    direccion: string
    urlImagenLocal: string
}

export default function CalificarLocalView() {
    const [rating, setRating] = useState<number>(0)
    const [comentario, setComentario] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()
    const { localId } = useParams<{ localId: string }>()
    const location = useLocation()
    const local = location.state?.local as LocalData
    const idUsuario = localStorage.getItem('idUsuario')

    const handleSubmit = async () => {
        if (!idUsuario || !localId) return

        try {
            setLoading(true)
            await CalificarService.puntuarLocal(idUsuario, localId, rating, comentario)
            navigate('/calificar-local')
        } catch (error) {
            console.error('Error al puntuar local:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            const isActive = i <= rating
            stars.push(
                <Box key={i}>
                    <IconButton
                        m= {0}
                        gap={0}
                        aria-label={`${i} estrellas`}
                        size="2xl"
                        variant="ghost"
                        color={isActive ? 'yellow.400' : 'gray.300'}
                        onClick={() => setRating(i)}
                    >
                        {isActive ? <AiFillStar/> : <AiOutlineStar/>}
                    </IconButton>
                </Box>
            )
        }
        return stars
    }

    if (!local) {
        return (
            <Box className="calificar-container" textAlign="center" py={10}>
                <Text color="red.500">Error: No se encontró información del local</Text>
            </Box>
        )
    }

    return (
        <Box className="calificar-container" m={5}>
            <Box className="calificar-header">
                <HStack justify="space-between" align="center">
                    <IconButton
                        variant="ghost"
                        aria-label="Cerrar"
                        onClick={() => navigate('/calificaciones')}
                        size="lg"
                    >
                        <FiX />
                    </IconButton>
                    <Heading size="md">Calificar</Heading>
                    <Box w="40px" />
                </HStack>
            </Box>
            <Box className="calificar-content">
                <Stack gap={4} align="center">
                    <Heading size="md" textAlign="center">
                        ¿Cómo fue tu experiencia con {local.nombre}?
                    </Heading>

                    <Text fontSize="sm" color="gray.600" textAlign="center">
                        ¡Tu opinión ayuda a otros a elegir el mejor lugar para comer!
                    </Text>

                    <HStack gap={2} className="stars-row">
                        {renderStars()}
                    </HStack>

                    <Box w="100%" mt={4}>
                        <Textarea
                            placeholder="Contanos tu experiencia"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            rows={6}
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            _focus={{ borderColor: 'blue.500' }}
                            resize="none"
                        />
                    </Box>

                    <Box
                        as="button"
                        className="enviar-button"
                        onClick={handleSubmit}
                        bg={rating === 0 ? 'gray.300' : 'red.500'}
                        color="white"
                        py={3}
                        px={6}
                        borderRadius="md"
                        fontSize="md"
                        fontWeight="bold"
                        w="100%"
                        mt={6}
                        opacity={loading ? 0.6 : 1}
                    >
                        {loading ? 'Enviando...' : 'Enviar'}
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}