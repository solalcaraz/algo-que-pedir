import type { Carrito } from './Carrito'
import { Plato } from './Plato'
import { type PlatoJSON } from './Plato'
import type { LocalJSON, MedioDePago } from '@/domain/Local'
import { Usuario, type UsuarioJSON } from './Usuario'

export type EstadoPedido = 'PENDIENTE' | 'PREPARADO' | 'ENTREGADO' | 'CANCELADO'

export type PedidoJSON = {
    id: number
    local: LocalJSON
    platosDelPedido: PlatoJSON[]
    cantidadDePlatos: number
    medioDePago: MedioDePago
    estadoPedido: EstadoPedido
    costoTotalPedido: number
    fechaPedido: string
    usuario: UsuarioJSON
    costoSubtotalPedido: number
    recargoMedioDePago: number
    tarifaEntrega: number
}
export class Pedido {
    id?: number

    constructor(
        public local: LocalJSON | null = null,
        public platosDelPedido: Plato[] | null = null,
        public medioDePago: MedioDePago | null = null,
        public estadoPedido: EstadoPedido = 'PENDIENTE',
        public fechaPedido: Date | null = null,
        public costoTotalPedido = 0,
        public subtotal = 0,
        public recargo = 0,
        public tarifaEntrega = 0,
        public usuario: Usuario | null = null
    ) {}

    static fromJson(pedidoJSON: PedidoJSON): Pedido {
        const pedido = new Pedido(
            pedidoJSON.local,
            pedidoJSON.platosDelPedido.map(platoJSON => Plato.fromJSON(platoJSON)),
            pedidoJSON.medioDePago,
            pedidoJSON.estadoPedido,
            new Date(pedidoJSON.fechaPedido),
            pedidoJSON.costoTotalPedido,
            pedidoJSON.costoSubtotalPedido,
            pedidoJSON.recargoMedioDePago,
            pedidoJSON.tarifaEntrega,
            Usuario.fromJSON(pedidoJSON.usuario)
        )
        pedido.id = pedidoJSON.id
        return pedido
    }

    static fromCarrito(
        carrito: Carrito,
        local: LocalJSON,
        medioDePago: MedioDePago,
        costoTotalPedido: number,
        fechaPedido: Date,
        usuario: Usuario,
        subtotal: number,
        recargo: number,
        tarifaEntrega: number
    ): Pedido {
        const platosDelPedido = carrito.items.flatMap(item => Array(item.cantidad).fill(item.plato))
        return new Pedido(
            local,
            platosDelPedido,
            medioDePago,
            'PENDIENTE',
            fechaPedido,
            costoTotalPedido,
            subtotal,
            recargo,
            tarifaEntrega,
            usuario
        )
    }
        
        toJSON(): PedidoJSON {
        if (!this.local || !this.medioDePago || !this.fechaPedido || !this.usuario || !this.platosDelPedido) {
            throw new Error('Faltan datos para convertir el Pedido a JSON')
        }
        return {
            id: this.id ?? 0,
            local: this.local,
            platosDelPedido: this.platosDelPedido.map(plato => plato.toJSON()),
            cantidadDePlatos: this.platosDelPedido.length,
            medioDePago: this.medioDePago,
            estadoPedido: this.estadoPedido,
            costoTotalPedido: this.costoTotalPedido,
            fechaPedido: this.fechaPedido.toISOString(),
            usuario: this.usuario.toJSON(),
            costoSubtotalPedido: this.subtotal,
            recargoMedioDePago: this.recargo,
            tarifaEntrega: this.tarifaEntrega,
        }
    }
}
    