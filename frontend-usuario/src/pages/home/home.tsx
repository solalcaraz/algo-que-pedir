import './home.css'
import { Box, Input, Heading, SimpleGrid, Card, Image, Stack, Text, IconButton, HStack, Checkbox, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosLogOut } from 'react-icons/io'
import { MdLocationOn } from 'react-icons/md'
import React from 'react'
import { useOnInit } from '@/customHooks/useOnInit'
import { logout } from '@/services/authService'
import { useNavigate } from 'react-router-dom'
import { toaster } from '@/components/chakra-toaster/toaster'
import { HomeService, type Local } from '@/services/homeService'

export const LocalesView = () => {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [locales, setLocales] = useState<Local[]>([])
  const [showNearby, setShowNearby] = useState<boolean>(false)
  //Estado para poder tener el nombre del usuario
  const [nombreUsuario, setNombreUsuario] = useState<string>('')

  useOnInit(() => {
    //Recupero el nombre con el localStorage y lo seteo con useState
    const nombreActual = localStorage.getItem('nombreUsuario')
    const idUsuario = localStorage.getItem('idUsuario')
    if (nombreActual) { setNombreUsuario(nombreActual) }
    
    const fetchLocales = async () => {
      if (idUsuario) {
        const localesData = await HomeService.fetchLocales(idUsuario)
        setLocales(localesData)
      }
    }

    fetchLocales()
  })

  //Agrego fx que llama al logout del service para asociar la accion con el icono del /home
  const handleLogOut = () => {
    logout()

    toaster.create({
      title: 'Sesión cerrada',
      description: 'Has cerrado la sesion correctamente',
      type: 'info',
      duration: 2000
    })

    navigate('/loginUsuario', { replace: true })
  }


  const filteredLocales: Local[] = locales.filter((localFiltrado: Local) =>
    (localFiltrado.local.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    localFiltrado.local.direccion.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!showNearby || localFiltrado.esCercano)
  )

  return (
    <Box className="delivery-container">
      {/* Header */}
      <Box className="delivery-header">
        <HStack justify="space-between" mb={2}>
          <Heading size="md">Delivery</Heading>
          <Flex justifyContent="space-around" alignItems="center">
            <Text>Hola, {nombreUsuario}!</Text>
            <IconButton variant="ghost" size="xl" onClick={handleLogOut}>
              <IoIosLogOut />
            </IconButton>
          </Flex>
        </HStack>

        {/* Buscador */}
        <Box className="search-container">
          <Input
            className="search-input"
            placeholder="Buscá tu local para pedir..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            pr="40px"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.300"
            _focus={{ bg: 'white', border: '1px solid' }}
          />
          <Box className="search-icon">
            <FiSearch size={20} />
          </Box>
        </Box>

        {/* Checkbox de cercania */}
        <Checkbox.Root pt="3" variant="solid" colorPalette="red" onCheckedChange={() => setShowNearby(!showNearby)}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Buscar locales cercanos</Checkbox.Label>
        </Checkbox.Root>
      </Box>

      {/* Content */}
      <Box className="delivery-content">
        <Heading size="lg" mb={4}>
          Locales de comidas
        </Heading>

        <SimpleGrid columns={2} gap="3">
          {filteredLocales.map((localFiltrado) => (
            <Card.Root
              variant={'outline'}
              key={localFiltrado.local.idLocal}
              className="local-card"
              cursor="pointer"
              borderRadius="20px" overflow="hidden"
              onClick={() => window.location.href = `/local/${localFiltrado.local.idLocal}/platos`}
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.02)' }}
            >
              <Card.Body gap="0" p="0" >
                <Box position="relative">
                  <Image
                    src={localFiltrado.local.urlImagenLocal}
                    alt={localFiltrado.local.nombre}
                    className="local-image"
                  />
                  {localFiltrado.esCercano && (
                    <Box
                      position="absolute"
                      top="2"
                      right="2"
                      bg="white"
                      borderRadius="full"
                      p="1.5"
                      boxShadow="md"
                    >
                      <MdLocationOn size={16} color="#E53E3E" />
                    </Box>
                  )}
                </Box>
                <Stack p={2}>
                  <Card.Title fontSize="sm">
                    {localFiltrado.local.nombre}
                  </Card.Title>
                  <Card.Description fontSize="xs" color="gray.600">
                    {localFiltrado.local.direccion}
                  </Card.Description>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>

        {filteredLocales.length === 0 && (
          <Box className="no-results">
            <Text color="gray.500">
              No se encontraron locales que coincidan con tu búsqueda
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}