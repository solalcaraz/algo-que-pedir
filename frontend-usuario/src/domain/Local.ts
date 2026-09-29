export type MedioDePago = 'EFECTIVO' | 'QR' | 'TARJETA'

export const medioDePagoLabels: Record<MedioDePago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  QR: 'QR',
}

export class Local {
  idLocal?: number

  constructor(
    public nombre: string = '',
    public urlImagenLocal: string = '',
    public mediosDePago: MedioDePago[] = [],
    public rating: number = 0,
    public cantidadReviews: number = 0,
    public reviews: string[] = [],
    public tarifaEntrega: number = 0,
    public recargosMedioDePago: Record<MedioDePago, number> = { EFECTIVO: 0, TARJETA: 0, QR: 0}
  ){}

  static fromJSON(localJSON: LocalCriterioJSON): Local {
    return Object.assign(new Local(), localJSON)
  }

  toJSON(): LocalCriterioJSON {
    return {
      idLocal: this.idLocal!,
      nombre: this.nombre,
      urlImagenLocal: this.urlImagenLocal,
      rating: this.rating,
      tarifaEntrega: this.tarifaEntrega
    }
  }
}

export type LocalCriterioJSON = {
  idLocal: number,
  nombre: string,
  urlImagenLocal: string,
  rating: number,
  tarifaEntrega: number,
}

export type LocalJSON = {
    idLocal: number,
    nombre: string,
    urlImagenLocal: string,
    mediosDePago: MedioDePago[],
    rating: number,
    cantidadReviews: number,
    reviews: string[],
    tarifaEntrega: number,
    recargosMedioDePago: Record<MedioDePago, number>
}