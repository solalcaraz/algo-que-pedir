// Nombres del enum MedioDePago del backend
export type MetodoDePago = 'EFECTIVO' | 'QR' | 'TARJETA'

// Texto que muestra la vista para cada medio
export enum MedioDePago {
  EFECTIVO = 'Efectivo',
  QR = 'Qr',
  TARJETA = 'Tarjeta de crédito'
}

const medioPagoTitlecase : {labelBack : string, medio : MedioDePago}[] = [
  {labelBack: 'EFECTIVO', medio: MedioDePago.EFECTIVO},
  {labelBack: 'QR', medio: MedioDePago.QR},
  {labelBack: 'TARJETA', medio: MedioDePago.TARJETA},
]

export function medioPagoDesdeBack(labelBack: string) : MedioDePago {
  const key = labelBack?.trim().toUpperCase()
  const match = medioPagoTitlecase.find(m => m.labelBack === key)
  return match ? match.medio : MedioDePago.EFECTIVO
}