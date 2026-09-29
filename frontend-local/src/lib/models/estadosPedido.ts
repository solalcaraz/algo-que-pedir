//Enum del Front para los Estados del Pedido
export enum EstadoDelPedido {
  PENDIENTE = 'PENDIENTE',
  PREPARADO = 'PREPARADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

//Es un array que asocia el valor de un estado (enum) con un label que usan los botones de la vista de las cards de Pedido
export const estadosLabelBoton: { estado: EstadoDelPedido; label: string }[] = [
  { estado: EstadoDelPedido.PENDIENTE, label: 'Pendientes' },
  { estado: EstadoDelPedido.PREPARADO, label: 'Preparados' },
  { estado: EstadoDelPedido.ENTREGADO, label: 'Entregados' },
  { estado: EstadoDelPedido.CANCELADO, label: 'Cancelados' }
]
