import { useState } from 'react'
import { 
  Dialog, 
  Stack, 
  Button,
  Input,
  HStack,
  Text,
  IconButton,
  Flex
} from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'

type ModalPalabrasClaveProps = {
  open: boolean
  onClose: () => void
  palabrasActuales: string[]
  onGuardar: (palabras: string[]) => void
}

export const ModalPalabrasClave = ({ 
  open, 
  onClose, 
  palabrasActuales,
  onGuardar 
}: ModalPalabrasClaveProps) => {
  const [palabras, setPalabras] = useState<string[]>([...palabrasActuales])
  const [nuevaPalabra, setNuevaPalabra] = useState('')
  const [error, setError] = useState('')

  // Reiniciar al abrir el modal
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setPalabras([...palabrasActuales])
      setNuevaPalabra('')
      setError('')
    } else {
      onClose()
    }
  }

  const agregarPalabra = () => {
    const palabraLimpia = nuevaPalabra.trim()
    
    if (!palabraLimpia) {
      setError('La palabra no puede estar vacía')
      return
    }

    if (palabras.some(p => p.toLowerCase() === palabraLimpia.toLowerCase())) {
      setError('Esta palabra ya está en la lista')
      return
    }

    setPalabras(prev => [...prev, palabraLimpia])
    setNuevaPalabra('')
    setError('')
  }

  const eliminarPalabra = (index: number) => {
    setPalabras(prev => prev.filter((_, i) => i !== index))
  }

  const confirmar = () => {
    onGuardar(palabras)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => handleOpenChange(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="500px">
          <Dialog.Header>
            <Dialog.Title>Palabras clave</Dialog.Title>
            <Dialog.Description>
              Agrega palabras clave para buscar en las descripciones de los platos
            </Dialog.Description>
          </Dialog.Header>
          
          <Dialog.Body>
            <Stack gap={4}>
              {/* Input para agregar nueva palabra */}
              <HStack>
                <Input
                  placeholder="Escribe una palabra clave..."
                  value={nuevaPalabra}
                  onChange={(e) => setNuevaPalabra(e.target.value)}
                />
                <IconButton
                  onClick={agregarPalabra}
                  colorScheme="blue"
                  aria-label="Agregar palabra"
                >
                  <IoMdAdd size={20} />
                </IconButton>
              </HStack>

              {/* Mensaje de error */}
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              {/* Lista de palabras */}
              <Stack gap={2} maxH="250px" overflowY="auto">
                {palabras.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No hay palabras clave agregadas
                  </Text>
                ) : (
                  palabras.map((palabra, index) => (
                    <Flex
                      key={index}
                      justify="space-between"
                      align="center"
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                      _hover={{ bg: 'gray.100' }}
                    >
                      <Text>{palabra}</Text>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => eliminarPalabra(index)}
                        aria-label="Eliminar palabra"
                        colorScheme="red"
                      >
                        <MdClose />
                      </IconButton>
                    </Flex>
                  ))
                )}
              </Stack>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.CloseTrigger>
            <Button 
              onClick={confirmar}
              colorScheme="blue"
            >
              Guardar ({palabras.length})
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}