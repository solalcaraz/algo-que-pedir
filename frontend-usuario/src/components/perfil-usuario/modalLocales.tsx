import { useState, useEffect } from 'react'
import { Dialog, Stack, Text, Button, Spinner, Checkbox, CheckboxCard } from '@chakra-ui/react'
import type { Local } from '@/domain/Local'
import { localService } from '@/services/localService'

type ModalLocalesProps = {
  open: boolean
  onClose: () => void
  localesSeleccionados: Local[]
  onSeleccionar: (locales: Local[]) => void
}

export const ModalLocalesPreferidos = ({ 
  open, 
  onClose, 
  localesSeleccionados,
  onSeleccionar 
}: ModalLocalesProps) => {
  const [locales, setLocales] = useState<Local[]>([])
  const [cargando, setCargando] = useState(true)
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set())

  // Cargar todos los locales al abrir el modal
  useEffect(() => {
    if (open) {
      cargarLocales()
      // Inicializar con los locales ya seleccionados
      const idsSeleccionados = new Set(localesSeleccionados.map(l => l.idLocal!))
      setSeleccionados(idsSeleccionados)
    }
  }, [open, localesSeleccionados])

  const cargarLocales = async () => {
    try {
      setCargando(true)
      const localesData = await localService.obtenerTodos()
      setLocales(localesData)
    } catch (error) {
      console.error('Error al cargar locales:', error)
    } finally {
      setCargando(false)
    }
  }

  const toggleLocal = (localId: number) => {
    setSeleccionados(prev => {
      const nuevos = new Set(prev)
      if (nuevos.has(localId)) {
        nuevos.delete(localId)
      } else {
        nuevos.add(localId)
      }
      return nuevos
    })
  }

  const confirmarSeleccion = () => {
    const localesElegidos = locales.filter(l => seleccionados.has(l.idLocal!))
    onSeleccionar(localesElegidos)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Seleccionar locales preferidos</Dialog.Title>
          </Dialog.Header>
          
          <Dialog.Body>
            {cargando ? (
              <Stack alignItems="center" py={4}>
                <Spinner />
                <Text>Cargando locales...</Text>
              </Stack>
            ) : (
              <Stack gap={3} maxH="400px" overflowY="auto">
                {locales.length === 0 ? (
                  <Text color="gray.500">No hay locales disponibles</Text>
                ) : (
                  locales.map(local => (
                    <CheckboxCard.Root key={local.idLocal} checked={seleccionados.has(local.idLocal!)} onCheckedChange={() => toggleLocal(local.idLocal!)} >
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control>
                            <CheckboxCard.Label>{local.nombre}</CheckboxCard.Label>
                            <CheckboxCard.Indicator />
                        </CheckboxCard.Control>
                    </CheckboxCard.Root>
                  ))
                )}
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
            >
              Confirmar ({seleccionados.size})
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}