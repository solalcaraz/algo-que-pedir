import { Button } from '@/components/boton/boton'
import { ItemRow } from '@/components/itemRow/itemRow'
import { CheckboxCard, CheckboxGroup, Collapsible, Flex, Heading, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { IoMdArrowBack } from 'react-icons/io'
import { CiSquarePlus } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import type { PerfilContextType } from '../Perfil'
import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { toaster } from '@/components/chakra-toaster/toaster'
import { RestaurenteItem } from '@/components/perfil-usuario/restauranteItem'
import { Contador } from '@/components/contador/contador'
import { Criterio, type TipoCriterio } from '@/domain/CriterioUsuario'
import { CRITERIOS_CONFIG } from '@/types/criterios'
import { Local } from '@/domain/Local'
import { Usuario } from '@/domain/Usuario'
import { ModalLocalesPreferidos } from '@/components/perfil-usuario/modalLocales'
import { ModalPalabrasClave } from '@/components/perfil-usuario/modalPalabras'

export const CriteriosBusqueda = () => {
    const { usuario, setUsuario, navigate } = useOutletContext<PerfilContextType>()
    
    const obtenerCriteriosActuales = (criterio: Criterio): TipoCriterio[] => {
        if(criterio.esCombinado()) {
            return criterio.subCriterios.map(subCriterio => subCriterio.tipo)
        }
        return [criterio.tipo]
    }
    const [seleccionados, setSeleccionados] = useState<TipoCriterio[]>(()=>obtenerCriteriosActuales(usuario.criterio))
    const [localesPreferidos, setLocalesPreferidos] = useState<Local[]>(usuario.criterio.localesPreferidos)
    const [distancia, setDistancia] = useState(usuario.distancia)
    const [palabrasClave, setPalabrasClave] = useState<string[]>(usuario.criterio.palabrasClave)

    const [modalLocalesAbierto, setModalLocalesAbierto] = useState(false)
    const [modalPalabrasAbierto, setModalPalabrasAbierto] = useState(false)
   

    const toggleCriterio = (tipo: TipoCriterio) => {
        setSeleccionados(prev => { 
            if (prev.includes(tipo)) {
                return prev.filter(t => t !== tipo)
            }
            return [...prev, tipo]
        })
    }

    const estaSeleccionado = (tipo: TipoCriterio) => seleccionados.includes(tipo)
    
    const agregarPalabra = (palabras: string[]) => {
        setPalabrasClave(palabras)
    }
    const eliminarPalabra = (palabra: string) => {
        setPalabrasClave(prev => prev.filter(p => p !== palabra))
    }

    const agregarLocal = (locales: Local[]) => {
        setLocalesPreferidos(locales)
    }
    const eliminarLocal = (id: number) => {
        setLocalesPreferidos(prev => prev.filter(l => l.idLocal !== id))
    }

    const abrirModalLocales = () => {
        setModalLocalesAbierto(true)
    }
    const abrirModalPalabras = () => {
        setModalPalabrasAbierto(true)
    }

    const construirCriterio = (): Criterio => {
        if (seleccionados.length === 0) {
            return new Criterio('GENERAL')
        }

        if (seleccionados.length === 1) {
            const tipo = seleccionados[0]
            return new Criterio(
                tipo,
                tipo === 'FIEL' ? localesPreferidos : [],
                tipo === 'MARKETING' ? palabrasClave : []
            )
        }

        // Con más de un criterio, el backend espera un COMBINADO que los tenga como subcriterios
        const subCriterios = seleccionados.map(tipo => new Criterio(
            tipo,
            tipo === 'FIEL' ? localesPreferidos : [],
            tipo === 'MARKETING' ? palabrasClave : []
        ))

        return new Criterio('COMBINADO', [], [], subCriterios)
    }
    
    const guardarCriterios = () => {
        const nuevoCriterio = construirCriterio()

        // Solo actualiza el usuario del perfil: va al backend cuando se toca Guardar Cambios
        setUsuario(Object.assign(new Usuario(), { ...usuario, criterio: nuevoCriterio, distancia: distancia }))
       
        toaster.create({
            title: 'Criterios seleccionados:',
            description: seleccionados.join(', '),
            type: 'info',
        })
        volver()
    }
    
    const volver = () => { navigate(-1) }

    return (
        <><Stack py='5'>
            <HStack alignItems='center' justifyContent='center' onClick={volver}>
                <IconButton variant="ghost"><IoMdArrowBack /></IconButton>
                <Heading as='h1'>Selecciona tu criterio</Heading>
            </HStack>

            <CheckboxGroup bg='white'>
                <Stack gap="2">
                    {CRITERIOS_CONFIG.map((criterio) => (
                        <CheckboxCard.Root key={criterio.value} checked={estaSeleccionado(criterio.value)} onCheckedChange={() => toggleCriterio(criterio.value)}>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control>
                                <CheckboxCard.Content>
                                    <CheckboxCard.Label>{criterio.titulo}</CheckboxCard.Label>
                                    <CheckboxCard.Description>
                                        {criterio.descripcion}
                                    </CheckboxCard.Description>
                                </CheckboxCard.Content>
                                <CheckboxCard.Indicator />
                            </CheckboxCard.Control>

                            {/* Desplegable para locales: criterio FIEL */}
                            {criterio.type === 'restaurantes' && (
                                <Collapsible.Root open={estaSeleccionado(criterio.value)}>
                                    <Collapsible.Trigger display='none'></Collapsible.Trigger> {/* Collapsible necesita un Trigger aunque lo abra el checkbox */}
                                    <Collapsible.Content>
                                        <CheckboxCard.Addon>
                                            {localesPreferidos.length > 0 ? (
                                                localesPreferidos.map((local) => (
                                                    <RestaurenteItem
                                                        id={local.idLocal!} nombre={local.nombre} imagen={local.urlImagenLocal} puntuacion={local.rating} tarifaEntrega={local.tarifaEntrega}
                                                        onEliminar={eliminarLocal} />
                                                ))
                                            ) : (
                                                <Text color='gray.500'> Aún no seleccionaste locales preferidos </Text>
                                            )}
                                            <Flex justifyContent='end'>
                                                <IconButton variant='ghost' onClick={abrirModalLocales}> <CiSquarePlus /> </IconButton>
                                            </Flex>
                                        </CheckboxCard.Addon>
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            )}

                            {/* Desplegable para palabras: criterio MARKETING */}
                            {criterio.type === 'palabras' && (
                                <Collapsible.Root open={estaSeleccionado(criterio.value)}>
                                    <Collapsible.Trigger display='none'></Collapsible.Trigger>
                                    <Collapsible.Content>
                                        <CheckboxCard.Addon>
                                            {palabrasClave.length > 0 ? (
                                                palabrasClave.map((palabra, index) => (
                                                    <ItemRow key={index} titulo={palabra} icono={<MdClose />} onClick={() => eliminarPalabra(palabra)} />
                                                ))
                                            ) : (
                                                <Text color='gray.500'> Aún no tenés palabras clave </Text>
                                            )}
                                            <Flex justifyContent='end'>
                                                <IconButton variant='ghost' onClick={abrirModalPalabras}> <CiSquarePlus /> </IconButton>
                                            </Flex>
                                        </CheckboxCard.Addon>
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            )}

                            {/* Desplegable para distancia: criterio IMPACIENTE */}
                            {criterio.type === 'distancia' && (
                                <Collapsible.Root open={estaSeleccionado(criterio.value)}>
                                    <Collapsible.Trigger display='none'></Collapsible.Trigger>
                                    <Collapsible.Content>
                                        <CheckboxCard.Addon>
                                            <HStack justifyContent='space-between'>
                                                <Text>Distancia máxima (km)</Text>
                                                <Contador valor={distancia} onChange={setDistancia} />
                                            </HStack>
                                        </CheckboxCard.Addon>
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            )}
                        </CheckboxCard.Root>
                    ))}
                </Stack>
            </CheckboxGroup>

            <Button onClick={guardarCriterios}>Guardar</Button>
        </Stack>
        
        <ModalLocalesPreferidos 
            open={modalLocalesAbierto}
            onClose={() => setModalLocalesAbierto(false)}
            localesSeleccionados={localesPreferidos}
            onSeleccionar={agregarLocal}
        />
        <ModalPalabrasClave
            open={modalPalabrasAbierto}
            onClose={() => setModalPalabrasAbierto(false)}
            palabrasActuales={palabrasClave}
            onGuardar={agregarPalabra}
        />
        </>
    )
}