export type ValidacionResultado = {
    esValido: boolean,
    mensajeError?: string
}

export type Ranges = { min: number, max: number } | undefined

interface ValidacionStrategy {
    esValido(valor: string | number, campo?: string, rango?: Ranges): ValidacionResultado
}

// Validacion compuesta
export class CompositeValidacion implements ValidacionStrategy {
    private estrategias: ValidacionStrategy[] = []

    esValido(valor: string | number, campo?: string, rango?: Ranges): ValidacionResultado {
        return {
            esValido: this.estrategias.every((estrategia) => estrategia.esValido(valor, campo, rango).esValido ),
            mensajeError: this.estrategias
                .filter((_) => !(_.esValido(valor, campo, rango).esValido))
                .map((_) => _.esValido(valor, campo, rango).mensajeError)
                .join('. ')
        }
    }

    agregar(nuevaEstrategia: ValidacionStrategy) { this.estrategias.push(nuevaEstrategia)}
}

class TextoRequerido implements ValidacionStrategy {
    esValido(valor: string, campo?: string, _rango?: Ranges): ValidacionResultado {
        const estaVacio = !valor || valor.trim().length === 0
        return {
            esValido: !estaVacio,
            mensajeError: estaVacio ? `El campo ${campo} es requerido` : undefined
        }
    }
}

class ValorRequerido implements ValidacionStrategy{
    esValido(valor: number, campo?: string, _rango?: Ranges): ValidacionResultado {
        const esInvalido = !valor
        return {
            esValido: !esInvalido,
            mensajeError: esInvalido ? `El campo ${campo} es requerido` : undefined
        }
    }
}

class ValorPositivo implements ValidacionStrategy {
    esValido(valor: number, _campo?: string, _rango?: Ranges): ValidacionResultado {
        const esPositivo = valor > 0
        return {
            esValido: esPositivo,
            mensajeError: !esPositivo ? 'Debe ser un número positivo' : undefined
        }
    }
}

class RangoNumerico implements ValidacionStrategy {
    esValido(valor: number, _campo?: string, rango?: { min: number, max: number }): ValidacionResultado {
        if (!rango) {
            throw new Error('Se requiere un rango definido')
        }
        const dentroDelRango = valor >= rango!.min && valor <= rango!.max
        return {
            esValido: dentroDelRango,
            mensajeError: !dentroDelRango 
                ? `Debe estar entre ${rango!.min} y ${rango!.max}` 
                : undefined
        }
    }
}

export const validacionStrategy = {
    textoRequerido: new TextoRequerido(),
    valorRequerido: new ValorRequerido(),
    valorPositivo: new ValorPositivo(),
    rangoNumerido: new RangoNumerico()
}