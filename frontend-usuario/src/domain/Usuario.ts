import type { DireccionJSON } from '@/types/direccionType'
import { Ingrediente, type IngredienteJSON } from './Ingrediente'
import { Criterio, type CriterioJSON } from './CriterioUsuario'

export class Usuario {
  id?: number

  constructor(
    public nombre: string = '',
    public apellido: string = '',
    public imagen: string = '/usuario-chica.png',
    public username: string = '',
    public password: string = '',
    public mail: string = '',
    public calle: string = '',
    public altura: number = 0,
    public latitud: number = 0,
    public longitud: number = 0,
    public distancia: number = 0,
    public criterio: Criterio = new Criterio(),
    public ingredientesPreferidos: Ingrediente[] = [],
    public ingredientesEvitar: Ingrediente[] = []
  ) {}

  static fromJSON(usuarioJSON: UsuarioJSON): Usuario {
      const usuario = Object.assign(new Usuario(), usuarioJSON, {
        calle: usuarioJSON.direccion.calle,
        altura: usuarioJSON.direccion.altura,
        latitud: usuarioJSON.direccion.latitud,
        longitud: usuarioJSON.direccion.longitud,
        distancia: usuarioJSON.distanciaMaximaCercana,
        criterio: Criterio.fromJSON(usuarioJSON.criterio),
        ingredientesPreferidos: usuarioJSON.ingredientesPreferidos.map(ing => Ingrediente.fromJSON(ing)),
        ingredientesEvitar: usuarioJSON.ingredientesEvitar.map(ing => Ingrediente.fromJSON(ing))
      })
      return usuario
  }

  toJSON(): UsuarioJSON {
    return {
      id: this.id!,
      nombre: this.nombre,
      apellido: this.apellido,
      mail: this.mail,
      direccion: {
        direccion: `${this.calle} ${this.altura}`,
        calle: this.calle,
        altura: this.altura,
        latitud: this.latitud,
        longitud: this.longitud
      },
      distanciaMaximaCercana: this.distancia,
      criterio: this.criterio?.toJSON() ?? { tipo: 'GENERAL' },
      ingredientesPreferidos: this.ingredientesPreferidos.map(ing => ing.toJSON()),
      ingredientesEvitar: this.ingredientesEvitar.map(ing => ing.toJSON())
    }
  }
}

export type UsuarioJSON = {
    id: number
    nombre: string,
    apellido: string,
    mail: string,
    direccion: DireccionJSON,
    distanciaMaximaCercana: number,
    criterio: CriterioJSON,
    ingredientesPreferidos: IngredienteJSON[],
    ingredientesEvitar: IngredienteJSON[]
}