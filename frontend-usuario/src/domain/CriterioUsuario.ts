import { Local, type LocalCriterioJSON } from './Local'

export class Criterio {
  constructor(
    public tipo: TipoCriterio = 'GENERAL',
    public localesPreferidos: Local[] = [], // para fieles
    public palabrasClave: string[] = [],  // para marketing
    public subCriterios: Criterio[] = []  // para combinados
  ) {}

  esCombinado(): boolean { return this.tipo === 'COMBINADO' }

  static fromJSON(criterioJSON: CriterioJSON): Criterio {
    return new Criterio(
      criterioJSON.tipo,
      criterioJSON.localesPreferidos?.map(local => Local.fromJSON(local)) ?? [],
      criterioJSON.palabrasClave ?? [],
      criterioJSON.subCriterios?.map(criterio => Criterio.fromJSON(criterio)) ?? [],
    )
  }

  toJSON(): CriterioJSON {
    const json: CriterioJSON = { tipo: this.tipo }

    if (this.tipo === 'COMBINADO' && this.subCriterios.length > 0) {
      json.subCriterios = this.subCriterios.map(subCriterio => subCriterio.toJSON())
    }
    if (this.tipo === 'FIEL' && this.localesPreferidos.length > 0) {
      json.localesPreferidos = this.localesPreferidos.map(local => local.toJSON())
    }
    if (this.tipo === 'MARKETING') {
      json.palabrasClave = this.palabrasClave
    }

    return json
  }
}

export type TipoCriterio =
  | 'GENERAL' | 'VEGANO' | 'EXQUISITO' | 'CONSERVADOR'
  | 'FIEL' | 'MARKETING' | 'IMPACIENTE' | 'COMBINADO'

export type CriterioJSON = {
  tipo: TipoCriterio
  localesPreferidos?: LocalCriterioJSON[]
  palabrasClave?: string[]
  subCriterios?: CriterioJSON[]
}