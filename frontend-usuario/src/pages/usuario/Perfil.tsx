import { toaster } from '@/components/chakra-toaster/toaster'
import { useOnInit } from '@/customHooks/useOnInit'
import { Usuario } from '@/domain/Usuario'
import { usuarioService } from '@/services/usuarioService'
import { getMensajeError } from '@/utils/errorHandling'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Outlet, useNavigate, type ErrorResponse } from 'react-router-dom'
import type { Preferencias } from './subrutasPerfil'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'

export type PerfilContextType = {
    usuario: Usuario
    setUsuario: Dispatch<SetStateAction<Usuario>> //
    cargando: boolean
    guardando: boolean
    guardarUsuario: (usuarioActualizado: Usuario) => void
    navigate: ReturnType<typeof useNavigate>
    gotoPreferencias: (opcion: Preferencias) => void
}


export const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState<Usuario>(new Usuario())
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const navigate = useNavigate()
    
    const USUARIO_ID = +localStorage.getItem('idUsuario')!

    // Carga de datos inicial
    const traerUsuario = async () => {
        try {
            setCargando(true)
            const usuario = await usuarioService.getById(USUARIO_ID)
            setUsuario(usuario)
        } catch (error: unknown) {
            const mensajeError = getMensajeError(error as ErrorResponse)
            toaster.create({
                title: 'No se puede cargar el usuario',
                description: mensajeError,
                type: 'error',
            })
        } finally { setCargando(false) }
    }
    useOnInit(traerUsuario)

    // Guardar y actualizar el usuario
    const guardarUsuario = async (usuarioActualizado: Usuario) => {
        try {
            setGuardando(true)
            // usuarioActualizado.validarCambios()
            const usuarioGuardado = await usuarioService.actualizar(usuarioActualizado)
            setUsuario(usuarioGuardado)

            toaster.create({
                title: 'Usuario actualizado',
                description: 'Los datos se actualizaron con éxito.',
                type: 'success'
            })
        } catch (error: unknown) {
            const errorMessage = getMensajeError(error as ErrorResponse)
            toaster.create({
                title: 'Error al guardar cambios',
                description: errorMessage,
                type: 'error'
            })
        } finally { setGuardando(false) }
    }

    // Navegación a las preferencias
    const gotoPreferencias = (opcion: Preferencias) => {
        navigate(opcion.path)
    }

    if (cargando) {
        return <LoadingSpinner mensaje='perfil'/>
    }

    return <>
        <Outlet context={{usuario, setUsuario, cargando, guardando, guardarUsuario, navigate, gotoPreferencias}}/>
    </>           
}