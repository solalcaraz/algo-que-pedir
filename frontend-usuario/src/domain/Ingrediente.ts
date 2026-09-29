export class Ingrediente {
    id?: number

  constructor(
    public nombre: string = ''
  ) {}

  static fromJSON(ingredienteJSON: IngredienteJSON): Ingrediente {
    return Object.assign(new Ingrediente(), ingredienteJSON)
  }

  toJSON(): IngredienteJSON {
    return {
        id: this.id!,
        nombre: this.nombre
    }
  }
}

export type IngredienteJSON = {
    id: number,
    nombre: string
}