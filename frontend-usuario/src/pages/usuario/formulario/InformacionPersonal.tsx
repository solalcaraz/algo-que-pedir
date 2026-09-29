import { CampoTexto } from '@/components/label-input/CampoTexto'
import { validar } from '@/utils/validar'
import { Avatar, Card, Heading, HStack, IconButton, Stack, Text, VStack } from '@chakra-ui/react'
import { preferencias } from '../subrutasPerfil'
import { FaChevronRight } from 'react-icons/fa'
import type { PerfilContextType } from '../Perfil'
import { useOutletContext } from 'react-router-dom'
import { CompositeValidacion, validacionStrategy } from '@/utils/validacionStrategy'
import { Button } from '@/components/boton/boton'
import { useEffect, useState } from 'react'
import { Usuario } from '@/domain/Usuario'
import { useOnInit } from '@/customHooks/useOnInit'

export const InformacionPersonal = () => {
    const { usuario, guardando, guardarUsuario, gotoPreferencias } = useOutletContext<PerfilContextType>()
    
    // Estado local para no generar reactividad en el preview de la informacion
    const [usuarioForm, setUsuarioForm] = useState<Usuario>(usuario)

    // Actualizacion local del form
    const actualizarForm = (referencia: keyof Usuario, valor: unknown) => {
        setUsuarioForm(Object.assign(new Usuario(), { ...usuarioForm, [referencia]: valor }))
    }

    // Validaciones compuestas para los numeros:
    const validacionUbicacion = new CompositeValidacion()
    validacionUbicacion.agregar(validacionStrategy.valorRequerido)
    validacionUbicacion.agregar(validacionStrategy.rangoNumerido)
    
    const validacionAltura = new CompositeValidacion()
    validacionAltura.agregar(validacionStrategy.valorRequerido)
    validacionAltura.agregar(validacionStrategy.valorPositivo)

    return (
        <Stack py='5'>
            <Heading as='h1' size='md' textAlign="center">Perfil</Heading>
                        
            {/* Preview de la informacion del usuario */}
            <VStack py='3'>
                <Avatar.Root size='2xl'>
                    <Avatar.Image src={usuario.imagen}/>
                </Avatar.Root> 
                <Heading as='h2' size='2xl'>{usuario.nombre} {usuario.apellido}</Heading>
                <Text color='textoSecundario'>{usuario.mail}</Text>
            </VStack>
            
            <Card.Root variant='outline'>
                <Card.Header>
                    <Card.Title>Informacion Personal</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Stack gap='4'>
                        <CampoTexto validacion={validar(usuarioForm.nombre, 'textoRequerido', 'nombre')} nombreLabel='Nombre' nombreTest='nombre' placeholder='Nombre'
                        value={usuarioForm.nombre} onChange={(event) => actualizarForm('nombre', event.target.value)} />

                        <CampoTexto validacion={validar(usuarioForm.apellido, 'textoRequerido', 'apellido')} nombreLabel='Apellido' nombreTest='apellido' placeholder='Apellido'
                        value={usuarioForm.apellido} onChange={(event) => actualizarForm('apellido', event.target.value)} />
                        
                        <HStack>
                            <CampoTexto validacion={validar(usuarioForm.calle, 'textoRequerido', 'direccion')} nombreLabel='Direccion' nombreTest='direccion' placeholder='Direccion'
                            value={usuarioForm.calle} onChange={(event) => actualizarForm('calle', event.target.value)} />

                            <CampoTexto validacion={validar(usuarioForm.altura, validacionAltura, 'altura')} nombreLabel='Altura' nombreTest='altura' placeholder='Altura'
                            value={usuarioForm.altura} onChange={(event) => actualizarForm('altura', event.target.value)} />
                        </HStack>

                        <HStack>
                            <CampoTexto validacion={validar(usuarioForm.latitud, validacionUbicacion, 'latitud', {min: -90, max: 90})} nombreLabel='Latitud' nombreTest='latitud' 
                            placeholder='Ej: -34.61' type='number' value={usuarioForm.latitud} onChange={(event) => actualizarForm('latitud', event.target.value)} />
                            
                            <CampoTexto validacion={validar(usuarioForm.longitud, validacionUbicacion, 'longitud', {min: -180, max: 180})} nombreLabel='Longitud' nombreTest='longitud' 
                            placeholder='Ej: 58.38' type='number' value={usuarioForm.longitud} onChange={(event) => actualizarForm('longitud', event.target.value)} />
                        </HStack>
                    </Stack>
                </Card.Body>
            </Card.Root>

            {/* Navegacion a preferencias */}
            <Card.Root variant='outline'>
                <Card.Header>
                    <Card.Title>Preferencias</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Stack>
                        {preferencias.map((opcion) => (
                            <HStack justify="space-between" align="center"
                            key={opcion.vista} onClick={(() => gotoPreferencias(opcion))}>
                                <Text>{opcion.label}</Text>
                                <IconButton variant='ghost' size="sm"
                                ><FaChevronRight /></IconButton>
                            </HStack>
                        ))}
                    </Stack>
                </Card.Body>
            </Card.Root>

            <Button onClick={() => guardarUsuario(usuarioForm)} disabled={guardando} >
                { guardando ? 'Guardando...' : 'Guardar Cambios' }
                </Button>
        </Stack>
    )
}