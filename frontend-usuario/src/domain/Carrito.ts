import { Plato } from './Plato'

export class ItemPedido {
    constructor(
        public plato: Plato,
        public cantidad = 0
    ) {}
}

export class Carrito {
    constructor(
        public items: ItemPedido[] = [],
        public localId: number | null = null 
    ) {}

    setPlatoCantidad(plato: Plato, cantidad: number, idLocal: number): Carrito {
        let itemPlato: ItemPedido[]

        const platoYaExiste = this.items.find(item => item.plato.id === plato.id) //Me fijo si el plato ya está en el carrito

        if (platoYaExiste) {
            itemPlato = this.items.map(item =>
                item.plato.id === plato.id ? new ItemPedido(item.plato, cantidad): item //Si el plato ya existe actualizo la cantidad
            )
        } else {
            itemPlato = [...this.items, new ItemPedido(plato, cantidad)] //Si el plato no existe, agrego un nuevo item al carrito
        }
        itemPlato = itemPlato.filter(item => item.cantidad > 0) //Filter para dejar solos los items que tengan cantidad > 0
        const nuevoLocalId = itemPlato.length > 0 ? idLocal : null //Si el carrito queda vacío, reseteo el localId a null

        return new Carrito(itemPlato, nuevoLocalId)
    }

    decrementarPlato(platoId: number): Carrito { //Este es un método para el checkout, para que decremente de a 1 con la cruz
        const itemPlato = this.items.find(item => item.plato.id === platoId)
        if (!itemPlato || this.localId === null) {
            return this
        }
        const cantidadActual = itemPlato.cantidad
        return this.setPlatoCantidad(itemPlato.plato, cantidadActual - 1, this.localId)
    }

    limpiarCarrito(): Carrito {
        return new Carrito()
    }

    get cantidadTotal(): number { //cantidad total de articulos
        return this.items.reduce((total, item) => total + item.cantidad, 0)
    }

    cantidadPorPlato(platoId: number): number { //cantidad de un plato en particular
        const itemPlato = this.items.find(item => item.plato.id === platoId)
        return itemPlato ? itemPlato.cantidad : 0
    }

    get subtotal(): number {  // El get me deja acceder al subtotal como si fuera un atributo
        return this.items.reduce((sum, item) => sum + item.plato.precioUnitario * item.cantidad, 0)
    }
}

