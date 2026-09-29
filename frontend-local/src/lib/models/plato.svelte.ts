import { Ingrediente, type IngredienteJSON } from '$lib/models/ingrediente.svelte'
import { ValidarMensaje } from '$lib/utils/validadorMensaje/ValidarMensaje'
import { REST_SERVER_URL } from '$lib/services/configuration'

export class Plato {
  id: number | null = null
  nombre = $state<string>('')
  descripcion = $state<string>('')
  imagenUrl = $state<string>('')
  valorBase = $state<number>(0)
  esDeAutor = $state(false)
  esNuevo = $state(false)
  porcentajeDescuento = $state<number>(0)
  costoProduccion = $state<number>(0)
  ingredientes: Ingrediente[] = $state([])
  errors: ValidarMensaje[] = $state([])

  estaEnPromocion = $state(false)
  imagenUrlCompleta = $derived(`${REST_SERVER_URL}/${this.imagenUrl}`)

  agregarIngrediente(ingrediente: Ingrediente) {
    if (!this.ingredientes.find(i => i.id === ingrediente.id)) {
      this.ingredientes.push(ingrediente)
    }
  }
  eliminarIngrediente(id: number) {
    this.ingredientes = this.ingredientes.filter(i => i.id !== id)
  }

  static fromJson(platoJSON: PlatoJSON): Plato {
    return Object.assign(new Plato(), platoJSON, {
      ingredientes: platoJSON.listaDeIngredientes
        ? platoJSON.listaDeIngredientes.map(ing => Ingrediente.fromJson(ing))
        : []
    })
  }

  toJSON(): PlatoJSON {
    const imagenNombre = this.imagenUrl.split('/').pop() || 'plato-nuevo.png'

    return {
      id: this.id ?? undefined,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagenNombre: imagenNombre,
      valorBase: this.valorBase,
      esDeAutor: this.esDeAutor,
      esNuevo: this.esNuevo,
      estaEnPromo: this.estaEnPromocion,
      porcentajeDescuento: this.porcentajeDescuento,
      costoProduccion: this.costoProduccion,
      listaDeIngredientes: this.ingredientes.map(i =>  i.toJSON())
    }
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

  validarPlato() {
    this.errors.length = 0
    if (!this.nombre || this.nombre.trim().length === 0) {
      this.agregarError('nombre', 'Debe ingresar un nombre para el plato')
    }
    if (!this.descripcion || this.descripcion.trim().length === 0) {
      this.agregarError('descripcion', 'Debe ingresar una descripción')
    }
    if (!this.imagenUrl) {
      this.agregarError('imagen', 'Debe seleccionar una imagen')
    }
    if (this.valorBase == null) {
      this.agregarError('valorBase', 'Debe ingresar un precio válido')
    }
    if (this.valorBase <= 0) {
      this.agregarError('valorBase', 'El precio debe ser mayor a 0')
    }
    if (this.estaEnPromocion && this.porcentajeDescuento == null) {
      this.agregarError('porcentajeDescuento', 'Debe ingresar un porcentaje de descuento')
    }
    if (this.estaEnPromocion && (this.porcentajeDescuento <= 0 || this.porcentajeDescuento >= 100)) {
      this.agregarError('porcentajeDescuento', 'El porcentaje debe estar entre 1% y 100%')
    }
  }
  
  invalid(): boolean {
    return this.errors.length > 0
  }
}

export type PlatoJSON = {
  id?: number,
  nombre: string,
  descripcion: string,
  imagenNombre: string,
  valorBase: number,
  esDeAutor: boolean,
  esNuevo: boolean,
  estaEnPromo: boolean,
  porcentajeDescuento: number,
  costoProduccion: number,
  listaDeIngredientes: IngredienteJSON[]
}