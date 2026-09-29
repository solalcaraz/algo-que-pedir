import { useState, useEffect } from 'react'
import { 
  Dialog, 
  Stack, 
  Text, 
  Button,
  Spinner,
  Checkbox,
  Input,
  InputGroup,
  CheckboxCard
} from '@chakra-ui/react'
import { Ingrediente } from '@/domain/Ingrediente'
import { ingredienteService } from '@/services/ingredienteService'
import { IoSearchOutline } from 'react-icons/io5'
import { ItemRow } from '../itemRow/itemRow'

type ModalIngredientesProps = {
  open: boolean
  onClose: () => void
  ingredientesSeleccionados: Ingrediente[]
  ingredientesExcluidos: Ingrediente[] // Los que NO deben aparecer en la lista
  onSeleccionar: (ingredientes: Ingrediente[]) => void
  titulo?: string
}

export const ModalIngredientes = ({ 
  open, 
  onClose, 
  ingredientesSeleccionados,
  ingredientesExcluidos,
  onSeleccionar,
  titulo = 'Seleccionar ingredientes'
}: ModalIngredientesProps) => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState<Ingrediente[]>([])
  const [cargando, setCargando] = useState(true)
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set())
  const [busqueda, setBusqueda] = useState('')

  // Cargar todos los ingredientes al abrir el modal
  useEffect(() => {
    if (open) {
      cargarIngredientes()
      // Inicializar con los ingredientes ya seleccionados
      const idsSeleccionados = new Set(ingredientesSeleccionados.map(i => i.id!))
      setSeleccionados(idsSeleccionados)
      setBusqueda('')
    }
  }, [open, ingredientesSeleccionados])

  // Filtrar ingredientes según búsqueda
  useEffect(() => {
    if (!busqueda.trim()) {
      setIngredientesFiltrados(ingredientes)
    } else {
      const filtrados = ingredientes.filter(ing => 
        ing.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
      setIngredientesFiltrados(filtrados)
    }
  }, [busqueda, ingredientes])

  const cargarIngredientes = async () => {
    try {
      setCargando(true)
      const ingredientesData = await ingredienteService.getAll()
      
      // Filtrar los ingredientes excluidos (prohibidos o preferidos según el caso)
      const idsExcluidos = new Set(ingredientesExcluidos.map(i => i.id!))
      const ingredientesDisponibles = ingredientesData.filter(
        ing => !idsExcluidos.has(ing.id!)
      )
      
      setIngredientes(ingredientesDisponibles)
      setIngredientesFiltrados(ingredientesDisponibles)
    } catch (error) {
      console.error('Error al cargar ingredientes:', error)
    } finally {
      setCargando(false)
    }
  }

  const toggleIngrediente = (ingredienteId: number) => {
    setSeleccionados(prev => {
      const nuevos = new Set(prev)
      if (nuevos.has(ingredienteId)) {
        nuevos.delete(ingredienteId)
      } else {
        nuevos.add(ingredienteId)
      }
      return nuevos
    })
  }

  const confirmarSeleccion = () => {
    const ingredientesElegidos = ingredientes.filter(i => seleccionados.has(i.id!))
    onSeleccionar(ingredientesElegidos)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="500px">
          <Dialog.Header>
            <Dialog.Title>{titulo}</Dialog.Title>
          </Dialog.Header>
          
          <Dialog.Body>
            {cargando ? (
              <Stack alignItems="center" py={4}>
                <Spinner />
                <Text>Cargando ingredientes...</Text>
              </Stack>
            ) : (
              <Stack gap={3}>
                {/* Buscador */}
                  <Input
                    placeholder="Buscar ingrediente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <IoSearchOutline />

                {/* Lista de ingredientes */}
                <Stack gap={2} maxH="400px" overflowY="auto">
                  {ingredientesFiltrados.length === 0 ? (
                    <Text color="gray.500" textAlign="center" py={4}>
                      {busqueda ? 'No se encontraron ingredientes' : 'No hay ingredientes disponibles'}
                    </Text>
                  ) : (
                    ingredientesFiltrados.map(ingrediente => (
                    <CheckboxCard.Root key={ingrediente.id} checked={seleccionados.has(ingrediente.id!)} onCheckedChange={() => toggleIngrediente(ingrediente.id!)} >
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control>
                            <CheckboxCard.Label>{ingrediente.nombre}</CheckboxCard.Label>
                            <CheckboxCard.Indicator />
                        </CheckboxCard.Control>
                    </CheckboxCard.Root>
                    ))
                  )}
                </Stack>
              </Stack>
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.CloseTrigger>
            <Button 
              onClick={confirmarSeleccion}
              disabled={cargando || seleccionados.size === 0}
              colorScheme="red"
            >
              Confirmar ({seleccionados.size})
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}