import { validacionStrategy, CompositeValidacion, type Ranges } from '@/utils/validacionStrategy'

export const validar = (
    valor: string | number,
    estrategia: keyof typeof validacionStrategy | CompositeValidacion,
    campo?: string,
    rango?: Ranges,
) => {
    return (
        (estrategia instanceof CompositeValidacion)
        ? estrategia.esValido(valor, campo, rango)
        : validacionStrategy[estrategia].esValido(valor as never, campo, rango)
    )
}