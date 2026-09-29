export enum EstadoDelPedido {
  PENDIENTE = 'PENDIENTE',
  PREPARADO = 'PREPARADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export const estadosLabelBoton: { estado: EstadoDelPedido; label: string }[] = [
  { estado: EstadoDelPedido.PENDIENTE, label: 'Pendientes' },
  { estado: EstadoDelPedido.PREPARADO, label: 'Preparados' },
  { estado: EstadoDelPedido.ENTREGADO, label: 'Entregados' },
  { estado: EstadoDelPedido.CANCELADO, label: 'Cancelados' }
]
