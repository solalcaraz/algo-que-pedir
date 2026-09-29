// export type MetodoDePago = 'Efectivo' | 'QR' | 'Transferencia'  DEPRECADO, no existe Transferencia en el Back

//Tipo que matchea con el enum del Back
export type MetodoDePago = 'EFECTIVO' | 'QR' | 'TARJETA'

//Enums del front de medios de pago. Formato titlecase
export enum MedioDePago {
  EFECTIVO = 'Efectivo',
  QR = 'Qr',
  TARJETA = 'Tarjeta de crédito'
}

//Mapeo de los valores de Enum del BACK con el enum MedioDePago del FRONT
const medioPagoTitlecase : {labelBack : string, medio : MedioDePago}[] = [
  {labelBack: 'EFECTIVO', medio: MedioDePago.EFECTIVO},
  {labelBack: 'QR', medio: MedioDePago.QR},
  {labelBack: 'TARJETA', medio: MedioDePago.TARJETA},
]

//Funcion que asocia los valores del Back con el enum del Front y retorna el match correspondiente
export function medioPagoDesdeBack(labelBack: string) : MedioDePago {
  const key = labelBack?.trim().toUpperCase()
  const match = medioPagoTitlecase.find(m => m.labelBack === key)
  return match ? match.medio : MedioDePago.EFECTIVO
}