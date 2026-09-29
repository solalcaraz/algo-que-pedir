import { Image, Heading, Text, Flex, Stack, Link, Field, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { Button } from '@/components/boton/boton'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PasswordInput } from '@/components/ui/password-input'
import { registro } from '@/services/authService'
import React from 'react'
import { obtenerErroresRegistro, type InputsRegistro, type ErroresForm } from '@/utils/validacionRegistro'
import { toaster } from '@/components/chakra-toaster/toaster'
import { handleAuthError } from '@/services/authService'



export const RegisterUsuario = () => {
    const navigate = useNavigate()

    //Estado para manejar las validaciones de los inputs
    const [values, setValues] = useState<InputsRegistro>({
        nombre: '',
        apellido: '',
        usuario: '',
        password: '',
        confirmarPassword: '',
        calle: '',
        altura: ''
    })


    //El flag de enviado viene en false y el objeto de errores vacio x default 
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<ErroresForm>({})


    //Maneja los cambios en cualquier input del form
    const manejoCambiosEnInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputsRegistro) => {
        const { value } = e.target
        setValues((datosPrevios) => ({
            ...datosPrevios,
            [field]: value
        }))
    }


    //Funcion que llama al AUTH SERVICE
    const guardarUsuario = async (e: React.FormEvent) => {
        e.preventDefault()

        //Llamo a funcion en /utils que se encarga de chequear los potenciales errores de todos los inputs del Form
        const nuevosErrores = obtenerErroresRegistro(values)
        setErrors(nuevosErrores)
        const esValido = Object.keys(nuevosErrores).length === 0        //Si el objeto de Errores está vacio, es porque está todo OK


        if (esValido) {
            setIsLoading(true)              //Activa el spinner
            try {
                await registro({
                    nombre: values.nombre,
                    apellido: values.apellido,
                    usuario: values.usuario,
                    password: values.password,
                    confirmarPassword: values.confirmarPassword,
                    calle: values.calle,
                    altura: values.altura
                })

                toaster.create({
                    title: 'Cuenta creada',
                    description: 'Usuario registrado exitosamente!',
                    type: 'success',
                    duration: 2000
                })

                navigate('/loginUsuario')       //Redirige a login si todo salio OK
            } catch (error) {
                setIsLoading(false)

                const mensaje = handleAuthError(error)

                toaster.create({
                    title: 'Error en el registro',
                    description: mensaje,
                    type: 'error',
                    duration: 2000
                })
            }
        }
    }

    //Renderizado del spinner de acuerdo a si esta cargando la pagina post registro
    if (isLoading) { return <LoadingSpinner /> }


    return (
        <Stack p="3rem" gap="3" as="form">
            {/*Header titulo + logo*/}
            <Flex justifyContent="center" alignItems="center" gap="2rem">
                <Image src="./logo.svg" alt="Logo app" p="1" w="45px" h="45px" borderRadius="full" bgColor="red" />
                <Heading as="h1" size="3xl">Crea tu cuenta</Heading>
            </Flex>

            {/*Contenedor de todos los inputs y boton*/}
            <Stack gap="5">

                <Field.Root required invalid={!!errors.nombre}>        {/*Nombre del usuario*/}
                    <Field.Label>Nombre*</Field.Label>
                    <Input placeholder="Ingresa tu nombre" value={values.nombre} onChange={(e) => manejoCambiosEnInput(e, 'nombre')} />
                    <Field.ErrorText>{errors.nombre}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.apellido}>        {/*Apellido del usuario*/}
                    <Field.Label>Apellido*</Field.Label>
                    <Input placeholder="Ingresa tu apellido" value={values.apellido} onChange={(e) => manejoCambiosEnInput(e, 'apellido')} />
                    <Field.ErrorText>{errors.apellido}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.calle}>        {/*Direccion: Calle*/}
                    <Field.Label>Calle*</Field.Label>
                    <Input placeholder="Ej: Av. San Martin..." value={values.calle} onChange={(e) => manejoCambiosEnInput(e, 'calle')} />
                    <Field.ErrorText>{errors.calle}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.altura}>        {/*Direccion: Altura*/}
                    <Field.Label>Altura*</Field.Label>
                    <Input type="number" placeholder="Ej: 457" value={values.altura} onChange={(e) => manejoCambiosEnInput(e, 'altura')} />
                    <Field.ErrorText>{errors.altura}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.usuario}>        {/*Usuario*/}
                    <Field.Label>Usuario*</Field.Label>
                    <Input placeholder="Ingresa tu usuario" value={values.usuario} onChange={(e) => manejoCambiosEnInput(e, 'usuario')} />
                    <Field.ErrorText>{errors.usuario}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.password}>       {/*Password*/}
                    <Field.Label>Password*</Field.Label>
                    <PasswordInput placeholder="Ingresa tu contraseña" value={values.password} onChange={(e) => manejoCambiosEnInput(e, 'password')} />
                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.confirmarPassword}>      {/*Reingreso de password*/}
                    <Field.Label>Re-ingrese su Password*</Field.Label>
                    <PasswordInput placeholder="Repeti tu contraseña" value={values.confirmarPassword} onChange={(e) => manejoCambiosEnInput(e, 'confirmarPassword')} />
                    <Field.ErrorText>{errors.confirmarPassword}</Field.ErrorText>
                </Field.Root>

                {/*Boton + link para ir a loginUsuario*/}
                <Button p="2" mt="1rem" borderRadius="full" onClick={guardarUsuario} type="submit">Registrarse</Button>

                <Text textAlign="center">¿Ya tienes una cuenta?
                    <Link textDecoration="underline" mx="1"> <RouterLink to="/loginUsuario"> Inicia Sesión</RouterLink></Link>
                </Text>
            </Stack>
        </Stack>

    )
}