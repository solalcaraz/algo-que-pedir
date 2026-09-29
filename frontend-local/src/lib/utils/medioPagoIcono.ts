import { MedioDePago } from '$lib/models/metodosDePago.svelte'

import tarjetaIcono from '$lib/assets/tarjeta-credito.svg'
import efectivoIcono from '$lib/assets/efectivo.svg'
import QRIcono from '$lib/assets/codigo-qr.svg'

const mapaIconoPago = {
  [MedioDePago.EFECTIVO] : efectivoIcono,
  [MedioDePago.QR] : QRIcono,
  [MedioDePago.TARJETA] : tarjetaIcono
} 

export function iconoMedioPago(medio: MedioDePago) : string {
  return mapaIconoPago[medio]
}