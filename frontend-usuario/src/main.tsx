import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './styles/theme.ts'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={theme} >
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)