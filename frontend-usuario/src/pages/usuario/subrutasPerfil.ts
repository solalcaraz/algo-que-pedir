export type Preferencias = {
    vista: string
    label: string
    path: 'criterios-busqueda' | 'ingredientes-preferidos' | 'ingredientes-evitar'
}

export const preferencias: Preferencias[] = [
    { vista: 'busqueda', label: 'Criterios de búsqueda', path: 'criterios-busqueda' },
    { vista: 'preferidos', label: 'Ingredientes preferidos', path: 'ingredientes-preferidos' },
    { vista: 'evitar', label: 'Ingredientes a evitar', path: 'ingredientes-evitar' },
]