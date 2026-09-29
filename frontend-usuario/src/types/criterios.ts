import type { TipoCriterio } from '@/domain/CriterioUsuario'

type CriterioConfig= {
    value: TipoCriterio
    titulo: string
    descripcion: string
    type?: 'restaurantes' | 'palabras' | 'distancia'
}

export const CRITERIOS_CONFIG: CriterioConfig[] = [
    { value: 'VEGANO', titulo: 'Veganos', descripcion: 'Sólo los platos veganos' },
    { value: 'EXQUISITO', titulo: 'Exquisitos', descripcion: 'Sólo platos de autor' },
    { value: 'CONSERVADOR', titulo: 'Conservadores', descripcion: 'Sólo platos con ingredientes preferidos' },
    { value: 'FIEL', titulo: 'Fieles', descripcion: 'Sólo los restaurantes preferidos', type: 'restaurantes' },
    { value: 'MARKETING', titulo: 'Marketing', descripcion: 'Filtran platos por palabras buscadas', type: 'palabras' },
    { value: 'IMPACIENTE', titulo: 'Impacientes', descripcion: 'Dentro de una distancia máxima', type: 'distancia' },
]