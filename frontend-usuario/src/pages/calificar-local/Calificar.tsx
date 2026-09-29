import './calificar.css'
import { Box, Heading, SimpleGrid, Card, Image, Stack, Text, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useOnInit } from '@/customHooks/useOnInit'
import { useNavigate } from 'react-router-dom'
import { CalificarService, type LocalConPuntuacion } from '@/services/calificacionService'

export const CalificacionesView = () => {
  const [locales, setLocales] = useState<LocalConPuntuacion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const idUser = localStorage.getItem('idUsuario')
  const navigate = useNavigate()

  useOnInit(() => {
    const fetchLocalesAPuntuar = async () => {
      try {
        setLoading(true)
        if (idUser) {
          const localesData = await CalificarService.fetchLocalesAPuntuar(idUser)
          setLocales(localesData)
        }
      } catch (error) {
        console.error('Error fetching locales a puntuar:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (idUser) {
      fetchLocalesAPuntuar()
    }
  })

  const handleLocalClick = (local: LocalConPuntuacion) => {
    navigate(`/calificar/${local.idLocal}`, { state: { local } })
  }

  return (
    <Box className="calificaciones-container">
      <Box className="calificaciones-header">
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Calificar</Heading>
        </HStack>
      </Box>

      <Box className="calificaciones-content">
        <Heading size="md" mb={4}>
          Locales para calificar
        </Heading>

        {!idUser ? (
          <Box textAlign="center" py={10}>
            <Text color="red.500">
              Debes iniciar sesión para calificar locales
            </Text>
          </Box>
        ) : loading ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">Cargando locales...</Text>
          </Box>
        ) : (
          <>
            <SimpleGrid columns={2} gap={4}>
              {locales.map((local: LocalConPuntuacion) => (
                <Card.Root
                  key={local.idLocal}
                  className="local-card"
                  cursor="pointer"
                  onClick= {() => handleLocalClick(local)}
                >
                  <Card.Body gap="2" p="0">
                    <Box position="relative">
                      <Image
                        src={local.urlImagenLocal}
                        alt={local.nombre}
                        className="local-image"
                      />
                    </Box>
                    <Stack p={3} gap={2}>
                      <Card.Title fontSize="sm">
                        {local.nombre}
                      </Card.Title>
                      <Card.Description fontSize="xs" color="gray.600">
                        {local.direccion}
                      </Card.Description>
                      <Text fontSize="xs" color="blue.600" fontWeight="medium" mt={1}>
                        Toca para calificar →
                      </Text>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>

            {!loading && locales.length === 0 && (
              <Box>
                <Text color="gray.500">
                  No tienes locales pendientes para calificar
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}