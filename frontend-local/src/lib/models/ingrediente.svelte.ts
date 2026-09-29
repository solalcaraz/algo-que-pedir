import { ValidarMensaje } from '$lib/utils/validadorMensaje/ValidarMensaje'

export class Ingrediente {
  id: number | null = null
  nombre = $state<string>('')
  costoMercado = $state<number>(0)
  grupoAlimenticio: GrupoAlimenticio | string = $state('') 
  origenAnimal: Origen = $state('vegetal')
  errors: ValidarMensaje[] = $state([])

  static fromJson(ingredienteJSON: IngredienteJSON): Ingrediente {
    return Object.assign(new Ingrediente(), ingredienteJSON, {
      origenAnimal: ingredienteJSON.origenAnimal ? 'animal' : 'vegetal',
      grupoAlimenticio: mapGrupo(ingredienteJSON.grupoAlimenticio) 
    })
  }
  
  get esAnimal() {
    return this.origenAnimal === 'animal'
  }

  // Setter para que funcione correctamente el binding con el slider
  set esAnimal(value: boolean) {
    this.origenAnimal = value ? 'animal' : 'vegetal'
  }

  tieneError(campo: string): boolean {
    return this.errors.some((_) => _.campo === campo)
  }
  agregarError(campo: string, mensaje: string) {
    this.errors.push( new ValidarMensaje(campo, mensaje))
  }
  mensajesError(campo: string): string {
    return this.errors
      .filter((_) => _.campo === campo)
      .map((_) => _.mensaje)
      .join('. ')
  }

  validarIngrediente() {
    this.errors.length = 0 // se limpian errores anteriores
    if (!this.nombre || this.nombre.trim().length === 0) {
      this.agregarError('nombre', 'Debe ingresar un nombre para el ingrediente')
    }

    if (this.costoMercado == null || this.costoMercado <= 0) {
      this.agregarError('costoMercado', 'Debe ingresar un costo válido y mayor a 0')
    }

    if (this.grupoAlimenticio == null || this.grupoAlimenticio === '') {
      this.agregarError('grupoAlimenticio', 'Debe seleccionar un grupo alimenticio')
    }
  }

  invalid(): boolean {
    return this.errors.length > 0
  }

  toJSON(): IngredienteJSON {
    return {
      id: this.id ?? undefined,
      nombre: this.nombre,
      costoMercado: this.costoMercado,
      grupoAlimenticio: grupoToEnum(this.grupoAlimenticio),
      origenAnimal: this.esAnimal
    }
  }
}

export type Origen = 'animal' | 'vegetal'

export enum GrupoAlimenticio {
  CEREALES_Y_TUBERCULOS = 'Cereales y tubérculos',
  AZUCARES_Y_DULCES = 'Azúcares y dulces',
  LACTEOS = 'Lácteos',
  FRUTAS_Y_VERDURAS = 'Frutas y verduras',
  GRASAS_Y_ACEITES = 'Grasas y aceites',
  PROTEINAS = 'Proteínas'
}

export type IngredienteJSON = {
  id?: number,
  nombre: string,
  costoMercado: number,
  grupoAlimenticio: string,
  origenAnimal: boolean
}

// función que mapea el enum del grupo alimenticio con el label
function mapGrupo(grupo: string): GrupoAlimenticio | '' {
  const mappedValue = GrupoAlimenticio[grupo as keyof typeof GrupoAlimenticio]
  return mappedValue ?? ''
}

// vuelve a mandar el label con el formato de enum
type GrupoEnum = keyof typeof GrupoAlimenticio

function grupoToEnum(label: string): string {
  const keys = Object.keys(GrupoAlimenticio) as GrupoEnum[]
  const found = keys.find(k => GrupoAlimenticio[k] === label)
  return found ?? label
}