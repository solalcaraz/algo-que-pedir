import { Usuario } from '@/domain/Usuario'

export const USUARIOS_MOCK: Usuario[] = [
    new Usuario('Pepita', 'Rodriguez', '/usuario-chica.png', '', '', 'correo-pepita@gmail.com', 'Calle Falsa', 'Disneylandia', -3.3, 58.2),
    new Usuario('Mona', 'Gimenez', '/usuario-chica.png', '', '', 'mismo-correo@gmail.com', 'Siempre Vivo', 'Falopita', -34.61, -58.3),
    new Usuario('Lucas', 'Martínez', '/usuario-chica.png', '', '', 'mismo-correo@gmail.com', 'Avenida Cerca', 'Rosario', 2.95, -60.66),
]