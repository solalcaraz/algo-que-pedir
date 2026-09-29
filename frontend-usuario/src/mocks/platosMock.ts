import { Plato } from '@/domain/Plato'

export const PLATOS_MOCK : Plato[] = [
    {
        id: 1,
        nombre: 'Pizza Margherita',
        descripcion: 'Classic pizza with tomato sauce, mozzarella, and basil',
        imagenUrl: '/pizza-margherita.png',
        popular: true,
        precioUnitario: 12.99
    },
        {
        id: 2,
        nombre: 'Fettuccine Alfredo',
        descripcion: 'Fettuccine with creamy Alfredo sauce',
        imagenUrl: '/fettuccine-alfredo.png',
        popular: false,
        precioUnitario: 14.50
    },
        {
        id: 3,
        nombre: 'Pizza Pepperoni',
        descripcion: 'Pizza with tomato sauce, mozzarella, and pepperoni',
        imagenUrl: '/pizza-pepperoni.png',
        popular: true,
        precioUnitario: 13.99
    },
        {
        id: 4,
        nombre: 'Spaghetti Carbonara',
        descripcion: 'Spaghetti with creamy sauce, bacon, and parmesan cheese',
        imagenUrl: 'spaghetti-carbonara.png',
        popular: false,
        precioUnitario: 14.99
    }
]