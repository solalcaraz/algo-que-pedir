import { Carrito } from '@/domain/Carrito'
import { Plato } from '@/domain/Plato'
import { useState } from 'react'
import { toaster } from '@/components/chakra-toaster/toaster'
import { Outlet } from 'react-router-dom'

//Lo que le pasamos a la vistas por el outlet
export type CarritoContext = {
    carrito: Carrito
    setPlatoCantidad: (plato: Plato, cantidad: number, idLocal: number) => void
    decrementarPlato: (platoId: number) => void
    limpiarCarrito: () => void
}

export const CarritoLayout = () => {
    const [carrito, setCarrito] = useState<Carrito>(new Carrito())

    const setPlatoCantidad = (plato: Plato, cantidad: number, idLocal: number) => {
        setCarrito(prev => prev.setPlatoCantidad(plato, cantidad, idLocal))
        toaster.create({
            title: 'Carrito actualizado',
            description: `${cantidad > 0 ? `${cantidad} de ${plato.nombre} agregado(s)` : `${plato.nombre} eliminado`}`,
            type: 'success',
            duration: 1500
        })
    }

    const decrementarPlato = (platoId: number) => {
        setCarrito((prev: Carrito) => prev.decrementarPlato(platoId))
    }

    const limpiarCarrito = () => {
        setCarrito((prev: Carrito) => prev.limpiarCarrito())
    }

    const contextValue: CarritoContext = {
        carrito,
        setPlatoCantidad,
        decrementarPlato,
        limpiarCarrito
    }

    return <Outlet context={contextValue} />
}