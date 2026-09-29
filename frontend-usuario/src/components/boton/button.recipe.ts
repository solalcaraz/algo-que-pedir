import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
    base: {
        border: 'none',
        padding: '.3rem 1rem',
        borderRadius: '10px',
        width: '90%',
        mx: 'auto',
        cursor: 'pointer'
    },
    variants: {
        variant: {
            primario: {bg: 'principal', color: 'secundario'},
            secundario: { bg: ' secundario', color: 'principal', border: '1px solid', borderColor: 'principal'}
        }
    },
    // Dejo como default el boton primario
    defaultVariants: {
        variant: 'primario'
    },
})