import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { buttonRecipe } from '@chakra-ui/react/theme'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        principal: { value: '#FF0000' },
        secundario: { value: '#FFFFFF' },
        textoPrimario: { value: '#000000' },
        textoSecundario: { value: '#9A6E63' },
        bordes: { value: '#eeccbeff' },
        fondo: { value: '#FFF9F8' },
        parrafos: { value: '#ae5986ff' },
      },
      fonts: {
        body: { value: '"Nata Sans", sans-serif' },
      },
    },

    recipes: {
      button: buttonRecipe,
    }
  },
  
  globalCss: {
    'html, body': {
        margin: '0',
        padding: '0',
        backgroundColor: 'fondo',
      },
      a: {
        textDecoration: 'none',
        color: 'textoPrimario',
      },
  },
})

export default createSystem(defaultConfig, config)