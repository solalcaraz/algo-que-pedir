const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/


export type InputsRegistro = {
    nombre: string,
    apellido: string,
    usuario: string,
    password: string,
    confirmarPassword: string,
    calle: string,
    altura: string
}

export type ErroresForm = Partial<InputsRegistro>

type Regla = {
    campoAchequear: keyof InputsRegistro,
    esValido: (data: InputsRegistro) => boolean,
    mensajeError: string
}


const reglasValidacion: Regla[] = [
    { campoAchequear: 'nombre', esValido: (data) => !!data.nombre, mensajeError: 'El nombre es obligatorio' },
    { campoAchequear: 'apellido', esValido: (data) => !!data.apellido, mensajeError: 'El apellido es obligatorio' },
    { campoAchequear: 'usuario', esValido: (data) => !!data.usuario, mensajeError: 'El usuario es obligatorio' },
    { campoAchequear: 'password', esValido: (data) => !!data.password, mensajeError: 'La contraseña es obligatoria' },
    { campoAchequear: 'confirmarPassword', esValido: (data) => !!data.confirmarPassword, mensajeError: 'Debe re-ingresar la contraseña' },
    { campoAchequear: 'calle', esValido: (data) => !!data.calle, mensajeError: 'La calle es obligatoria' },

    {
        campoAchequear: 'altura',
        esValido: (data) => data.altura !== '' && !isNaN(Number(data.altura)) && Number(data.altura) > 0,
        mensajeError: 'Ingresa una altura válida'
    },

    {
        campoAchequear: 'confirmarPassword',
        esValido: (data) => data.password === data.confirmarPassword,
        mensajeError: 'Las contraseñas no coinciden'
    },

    {
        campoAchequear: 'calle',
        esValido: (data) => soloTextoRegex.test(data.calle),
        mensajeError: 'La calle solo puede contener letras'
    },
    {
        campoAchequear: 'nombre',
        esValido: (data) => soloTextoRegex.test(data.nombre),
        mensajeError: 'El nombre solo puede contener letras'
    },
    {
        campoAchequear: 'apellido',
        esValido: (data) => soloTextoRegex.test(data.apellido),
        mensajeError: 'El apellido solo puede contener letras'
    }
]

export const obtenerErroresRegistro = (data: InputsRegistro): ErroresForm => {
    const errores: ErroresForm = {}

    reglasValidacion.forEach((regla) => {
        if (!errores[regla.campoAchequear] && !regla.esValido(data)) {
            errores[regla.campoAchequear] = regla.mensajeError
        }
    })

    return errores
}
